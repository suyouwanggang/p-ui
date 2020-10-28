import { LitElement, PropertyDeclaration, UpdatingElement } from "lit-element";

/**
 * 属性监听回调方法。
 * @param value: 属性新的值
 * @param oldValue 属性历史值
 * @param name 属性名称
 * @param isFirstChange,属性是否是第一发生变化
 */
export type CallBackFunction<T> = (value: T, oldValue: T, name: PropertyKey, isFirstChange: boolean) => void;

/**
 *
 * @watch, @property 合并。
 * 将属性设置为property ，同时能通过@watchMethodName 监听属性变化
 * 监听方法 ，接收参数四个参数：
 *   value:当前值，oldValue:历史值，
 *   name:属性名称，
 *   isFirst:是否是第一次设置
 * @param watchMethodName 监听的方法的名称，或者直接是监听方法（方法调用的this 为当前组件)
 * @param options 同@property 参数一致
 */
export default function watchProperty<T>(watchMethodName: string | CallBackFunction<T>, options?: PropertyDeclaration) {
    // tslint:disable-next-line: no-any
    return (protoOrDescriptor: any, name: PropertyKey) => {
        const callBackFn: CallBackFunction<T> = typeof watchMethodName === 'string' ? (protoOrDescriptor as any)[watchMethodName] : watchMethodName;
        if (!callBackFn) {
            console.warn(`Cannot find method ${watchMethodName} in class ${protoOrDescriptor.constructor.name} or watchMethodName is not a function`);
        }
        const isFirstChangeKey = Symbol();
          (protoOrDescriptor.constructor as typeof UpdatingElement).createProperty(name,options);
          const defaultDescriptor=Object.getOwnPropertyDescriptor(protoOrDescriptor,name);
         Object.defineProperty(protoOrDescriptor, name, {
            configurable: true,
            enumerable: true,
            set(value) {
                const oldValue = defaultDescriptor.get.call(this);
                const isFirst = this[isFirstChangeKey] === undefined;
                if (!isFirst && oldValue === value) {
                    return;
                }
                if (callBackFn) {
                    callBackFn.call(this, value, oldValue, name, isFirst);
                }
                this[isFirstChangeKey] = false;
                defaultDescriptor.set.call(this,value);
            },
            // tslint:disable-next-line: no-any
            get:defaultDescriptor.get
        });
    };
}
