type ListenerResult= {
    destory: () => void;
}
/**
 * @returns 返回一个对象，可以删除监听
 * @param el DOM对象
 * @param event 事件类型
 * @param listener 监听
 * @param options 事件监听options
 */
const addEvent = (el: Element|SVGAElement, event: string, listener: EventListener, options?: boolean | AddEventListenerOptions): ListenerResult => {
    el.addEventListener(event, listener, options);
    return {
        destory: () => {
            el.removeEventListener(event, listener, options);
        }
    }
};
export default addEvent;