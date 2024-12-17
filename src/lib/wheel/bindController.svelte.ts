import { untrack } from "svelte";

export function bindController(
    target: () => HTMLElement | undefined,
    centerX: () => number,
    centerY: () => number
) {
    const phi = $state({ value: <number | null> null })

    let currentCenterX = 0, currentCenterY = 0;
    let originX = 0, originY = 0;
    let moving = false;

    function stopMoving(ev: PointerEvent) {
        moving = false
        phi.value = null
        ev.preventDefault()
    }

    function startMoving(ev: PointerEvent) {
        moving = true
        ev.preventDefault()

        const rect = target()!.getBoundingClientRect();
        originX = rect.left;
        originY = rect.top;
        currentCenterX = centerX()
        currentCenterY = centerY()

        updatePhi(ev.clientX, ev.clientY);
    }

    function keepMoving(ev: PointerEvent) {
        if (!moving) return;

        ev.preventDefault()
        updatePhi(ev.clientX, ev.clientY)
    }

    function updatePhi(clientX: number, clientY: number) {
        untrack(() => {
            phi.value = Math.atan2(clientY - originY - currentCenterX,
                                   clientX - originX - currentCenterY)
        })
    }

    $effect(() => {
        const t = target()!
        t.style.touchAction = "none"
        t.addEventListener("pointerdown", startMoving)
        document.addEventListener("pointermove", keepMoving)
        document.addEventListener("pointerup", stopMoving)

        return () => {
            t.removeEventListener("pointerdown", startMoving)
            document.removeEventListener("pointermove", keepMoving)
            document.removeEventListener("pointerup", stopMoving)
        }
    })

    return phi
}
