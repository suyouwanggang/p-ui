/**
 * 属性监听回调方法。
 * @param value: 属性新的值
 * @param oldValue 属性历史值
 * @param name 属性名称
 * @param isFirstChange,属性是否是第一发生变化
 */
export type CallBackFunction<T> = (value: T, oldValue: T, name: PropertyKey, isFirstChange: boolean) => void;

/**
 * 属性改变监听器
 * 监听方法 ，接收参数四个参数：
 *   value:当前值，oldValue:历史值，
 *   name:属性名称，
 *   isFirst:是否是第一次设置
 * @param watchMethod 监听的方法的名称，或者 直接是监听方法
 */
export default function watch<T>(watchMethod: string | CallBackFunction<T>) {
    const cachedValueKey = Symbol();
    const isFirstChangeKey = Symbol();
    return (target: any, name: PropertyKey) => {
        const callBackFn: CallBackFunction<T> = typeof watchMethod === 'string' ? target[watchMethod] : watchMethod;
        if (!callBackFn) {
            throw new Error(`Cannot find method ${watchMethod} in class ${target.constructor.name}`);
        }
        const oldProperty = Object.getOwnPropertyDescriptor(target, name);
        Object.defineProperty(target, name, {
            set: function (value) {
                const isFirst = this[isFirstChangeKey] === undefined;
                if (!isFirst && this[cachedValueKey] === value) {
                    return;
                }
                const oldValue = this[cachedValueKey];
                this[cachedValueKey] = value;
                this[isFirstChangeKey] = false;
                callBackFn.call(this, value, oldValue, name, isFirst);
                if (oldProperty != null && oldProperty.set) {
                    oldProperty.set.call(this, value);
                }
            },
            get: ( ) => {
                return oldProperty && oldProperty.get ? oldProperty.get.call(target) : target[cachedValueKey];
            }
        });
    };
}
