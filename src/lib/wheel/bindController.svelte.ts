import { untrack } from "svelte";

export function bindController(
    target: () => HTMLElement | undefined,
    centerX: () => number,
    centerY: () => number
) {
    const phi = $state({ value: 0 })

    let currentCenterX = 0, currentCenterY = 0;
    let originX = 0, originY = 0;
    let moving = false;
    
    function startMoving(ev: PointerEvent) {
        moving = true
        ev.preventDefault()
        
        const rect = target()!.getBoundingClientRect();
        originX = rect.left;
        originY = rect.top;
        currentCenterX = centerX()
        currentCenterY = centerY()
        
        updatePhi(ev.clientX, ev.clientY);
        
        document.addEventListener("pointermove", keepMoving)
        document.addEventListener("pointerup", stopMoving, { once: true })
    }
    
    function keepMoving(ev: PointerEvent) {
        if (!moving) return;
        
        ev.preventDefault()
        updatePhi(ev.clientX, ev.clientY)
    }
    
    
    function stopMoving(ev: PointerEvent) {
        moving = false
        ev.preventDefault()
        
        document.removeEventListener("pointermove", keepMoving)
    }
    
    function updatePhi(clientX: number, clientY: number) {
        phi.value = Math.atan2(clientY - originY - currentCenterX,
                               clientX - originX - currentCenterY)
    }

    $effect(() => {
        const t = target()!
        t.addEventListener("pointerdown", startMoving)

        return () => {
            t.removeEventListener("pointerdown", startMoving)
            document.removeEventListener("pointermove", keepMoving)
            document.removeEventListener("pointerup", stopMoving)
        }
    })

    return phi
}
