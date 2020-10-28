type ListenerResult = {
    destory: () => void;
};
/**
 * @returns 返回一个对象，可以删除监听
 * @param el DOM对象
 * @param event 事件类型
 * @param listener 监听
 * @param options 事件监听options
 */
const addEvent = (el: HTMLDocument| Element | SVGAElement, event: string, listener: EventListener, options?: boolean | AddEventListenerOptions): ListenerResult => {
    el.addEventListener(event, listener, options);
    return {
        destory: () => {
            el.removeEventListener(event, listener, options);
        }
    };
};

/**
 * 函数节流， 持续触发事件时，保证一定时间段内只调用一次事件处理函数。节流通俗解释就比如我们水龙头放水，阀门一打开，水哗哗的往下流，秉着勤俭节约的优良传统美德，我们要把水龙头关小点
 * @param method 节流方法
 * @param delay 多少时间调用一次
 * @param scope 函数执行上下文
 */
const throttle = (method: (...arg: unknown[]) => void , delay: number, scope?: unknown) => {
    let begin = new Date().getTime();
    return function (this: unknown, ...args: unknown[]) {
        const context = scope != null ? scope : this, current = new Date().getTime();
        if (current - begin >= delay) {
            method.apply(context, args);
            begin = current;
        }
    };
};

/**
 * 函数防抖
 * 当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次，如果设定的时间到来之前，又一次触发了事件，就重新开始延时
 * @param method
 * @param wait
 * @param scope
 */
const debounce = (method: (...arg: unknown[]) => void, wait: number, scope?: unknown) => {
    let timeout: number = null;
    return function (this: unknown, ...args: unknown[]) {
        const context = scope != null ? scope : this;
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = window.setTimeout(() => {
            method.apply(context, args);
        }, wait);
    };
};

export {addEvent, debounce, throttle};