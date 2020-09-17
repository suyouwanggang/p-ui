
type Listener = {
    callback: (...args: unknown[]) => void
    scope?: unknown,
    args?: unknown[]
};
type ListenerMap={
    [Key: string]: Listener[]
};
class EventBus {
    private listenersMap: ListenerMap = {};
    private getTypeListeners(type: string) {
        let result = this.listenersMap[type];
        if (result == null) {
            result = new Array<Listener>();
            this.listenersMap[type] = result;
        }
        return result;
    }
    /**
     * 添加事件监听
     * @param type 事件类型
     * @param callback  回调函数 
     * @param scope ：事件回调scope
     * @param args ：事件回调 传递的参数，会添加此参数事件参数的最后面
     */
    on(type: string, callback: (...args: unknown[]) => void, scope?: unknown, ...args: unknown[]) {
        const result = this.getTypeListeners(type);
        result.push({ callback, args, scope: scope === null ? null : scope });
    }
    /**
     * 删除事件监听
     * @param type 事件类型
     * @param callback 回调函数 ，为空，则删除此类型的所有监听
     * @param scope  事件回调scope, 可以为空,则删除所有对象的监听
     */
    off(type: string, callback?: (...args: unknown[]) => void, scope?: unknown) {
        const result = this.getTypeListeners(type);
        let findList:Listener[] = [];
        for (let i = result.length - 1; i >= 0; i--) {
            const l = result[i];
            if ((callback == null || l.callback === callback) && (scope == null || l.scope === scope)) {
                findList=[...findList, ...result.splice(i,1)];
            }
        }
        return findList;
    }
    /**
     * 触发事件
     * @param type  事件类型
     * @param args  事件参数
     */
    dispatch(type: string, ...args: unknown[]) {
        const result = this.getTypeListeners(type);
        result.forEach((listener: Listener) => {
            const argArray = [...args, ...listener.args];
            if (listener.scope !== null) {
                listener.callback.apply(listener.scope, argArray);
            } else {
                listener.callback(argArray);
            }
        });
    }
}

const eventBus = new EventBus();
export { eventBus, EventBus };
