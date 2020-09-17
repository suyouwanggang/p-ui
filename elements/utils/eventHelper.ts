type ListenerResult= {
    destory: () => void;
}
const addEvent = (el: Element|SVGAElement, event: string, listener: EventListener, options?: boolean | AddEventListenerOptions): ListenerResult => {
    el.addEventListener(event, listener, options);
    return {
        destory: () => {
            el.removeEventListener(event, listener, options);
        }
    }
}
export default addEvent;