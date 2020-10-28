/**
 * 属性监听回调方法。
 * @param value: 属性新的值
 * @param oldValue 属性历史值
 * @param name 属性名称
 * @param isFirstChange,属性是否是第一发生变化
 */
export type CallBackFunction<T> = (value: T, oldValue: T, name: PropertyKey, isFirstChange: boolean) => void;

/**
 * 属性改变监听器 ,如果跟 @property 一起使用，则必须放在property 的前面 ,否则@property 不起作用
 *
 * 监听方法 ，接收参数四个参数：
 *   value:当前值，oldValue:历史值，
 *   name:属性名称，
 *   isFirst:是否是第一次设置
 * @param watchMethodName 监听的方法的名称，或者 直接是监听方法
 */
export default function watch<T>(watchMethodName: string | CallBackFunction<T>) {
    const cachedValueKey = Symbol();
    const isFirstChangeKey = Symbol();
    // tslint:disable-next-line: no-any
    return (protoOrDescriptor: any, name: PropertyKey) => {
        const callBackFn: CallBackFunction<T> = typeof watchMethodName === 'string' ? protoOrDescriptor[watchMethodName] : watchMethodName;
        if (!callBackFn) {
            console.warn(`Cannot find method ${watchMethodName} in class ${protoOrDescriptor.constructor.name} or watchMethodName is not a function `);
        }
        const oldProperty = Object.getOwnPropertyDescriptor(protoOrDescriptor, name);
        Object.defineProperty(protoOrDescriptor, name, {
            configurable: true,
            enumerable: true,
            set(value) {
                const isFirst = this[isFirstChangeKey] === undefined;
                const oldValue = this[cachedValueKey];
                if (!isFirst && oldValue === value) {
                    return;
                }
                this[cachedValueKey] = value;
                this[isFirstChangeKey] = false;
                if (callBackFn) {
                    callBackFn.call(this, value, oldValue, name, isFirst);
                }
                if (oldProperty != null && oldProperty.set) {
                    oldProperty.set.call(this, value);
                }
            },
            // tslint:disable-next-line: no-any
            get(this: any) {
                return oldProperty && oldProperty.get ? oldProperty.get.call(this) : this[cachedValueKey];
            }
        });
    };
}
