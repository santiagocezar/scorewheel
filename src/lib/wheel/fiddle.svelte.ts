export function fiddle(
    target: Element,
    callback: (x: number, y: number) => void
) {
    let originX = 0, originY = 0;

    function startMoving(ev: PointerEvent) {
        ev.preventDefault()

        const rect = target.getBoundingClientRect();
        originX = rect.left;
        originY = rect.top;

        callback(ev.clientX - originX, ev.clientY - originY);

        document.addEventListener("pointermove", keepMoving)
        document.addEventListener("pointerup", stopMoving, { once: true })
    }

    function keepMoving(ev: PointerEvent) {
        ev.preventDefault();
        callback(ev.clientX - originX, ev.clientY - originY);
    }


    function stopMoving(ev: PointerEvent) {
        ev.preventDefault()
        document.removeEventListener("pointermove", keepMoving)
    }

    $effect(() => {
        target.addEventListener("pointerdown", startMoving as EventListener)

        return () => {
            target.removeEventListener("pointerdown", startMoving as EventListener)
            document.removeEventListener("pointermove", keepMoving)
            document.removeEventListener("pointerup", stopMoving)
        }
    })
}
