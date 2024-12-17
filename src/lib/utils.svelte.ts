export function delayEffect(fn: () => () => void, delayMs: number) {
    let lastTimeout: any
    $effect(() => {
        console.log("hiasodaso")
        const afterDelay = fn()
        clearTimeout(lastTimeout)
        lastTimeout = setTimeout(afterDelay, delayMs)
    })
}

export function sizeObserver(fn: () => Element | undefined): { width: number, height: number } {
    const size = $state({ width: 0, height: 0 })

    const handler: ResizeObserverCallback = entries => {
        for (const entry of entries) {
            size.width = entry.contentRect.width
            size.height = entry.contentRect.height
            break
        }
    }

    $effect(() => {
        const el = fn()

        if (!el) return;

        const observer = new ResizeObserver(handler)
        observer.observe(el)

        return () => {
            observer.disconnect()
        }
    })

    return size
}
