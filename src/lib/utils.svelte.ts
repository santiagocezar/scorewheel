export function range(size: number, startAt = 0) {
    if (size <= 0) return []
    return [...Array(Math.floor(size)).keys()].map((i) => i + startAt);
}

export function delayEffect(fn: () => () => void, delayMs: number) {
    let lastTimeout: any
    $effect(() => {
        console.log("hiasodaso")
        const afterDelay = fn()
        clearTimeout(lastTimeout)
        lastTimeout = setTimeout(afterDelay, delayMs)
    })
}

export function sliced(phi: number, slices: number, offset?: number = 0.5): number {
    return Math.floor(phi * slices / 2 / Math.PI + slices + offset) % slices
}

// this could've been another dependency, but eh, this is safer i think
// https://github.com/CaptainCodeman/svelte-resize-observer-action/blob/master/src/lib/index.ts

// keep track of which resize callback is associated with each element
type ResizeCallback = (entry: ResizeObserverEntry) => void
const resizeCallbacks = new WeakMap<Element, ResizeCallback>()

// defined outside of action, so we only create a single instance
let resizeObserver: ResizeObserver

export function resize(target: Element, callback: ResizeCallback) {
    // create on first use, inside the action, so we're SSR friendly
    resizeObserver = resizeObserver || new ResizeObserver(entries => {
        for (const entry of entries) {
            const callback = resizeCallbacks.get(entry.target)
            if (callback) {
                callback(entry)
            }
        }
    })

    resizeCallbacks.set(target, callback)
    resizeObserver.observe(target)

    return {
        destroy() {
            resizeObserver.unobserve(target)
            resizeCallbacks.delete(target)
        }
    }
}
