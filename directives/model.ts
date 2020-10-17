import { directive, Part, AttributePart, PropertyPart, BooleanAttributePart } from 'lit-html';
// tslint:disable-next-line: no-any
type CacheNode = Map<string | ((modelValue: any) => any) | undefined, Set<Part>>;//缓存 被监听对象 ，有哪些node 需要被修改的
const objectDependsCache = new WeakMap<Object, CacheNode>();
const addDependsToCache = (modeValue: Object, fieldPath: string | ((modelValue: any) => any) | undefined, part: Part) => {
    let node = objectDependsCache.get(modeValue);
    if (node === undefined) {
        // tslint:disable-next-line: no-any
        node = new Map<string | ((modelValue: any) => any) | undefined, Set<Part>>();
        objectDependsCache.set(modeValue, node);
    }
    let set = node.get(fieldPath);
    if (set === undefined) {
        set = new Set<Part>();
        node.set(fieldPath, set);
    }
    set.add(part);
};
// tslint:disable-next-line: no-any
const getDataFieldValue = (data: any, field: string | ((modelValue: any) => any) | undefined) => {
    if (field === undefined || field == null) {
        return data;
    } else if (typeof field === 'function') {
        return field(data);
    } else if (typeof field === 'string') {
        if (field.indexOf('.') === -1) {
            return data[field];
        }
        else {
            const fields = field.split('.');
            let value = data;
            for (let i = 0, len = fields.length; i < len && value != null && value !== undefined; ++i) {
                value = value[fields[i]];
            }
            return value === undefined ? '' : value;
        }
    } else {
        return null;
    }
};
// tslint:disable-next-line: no-any
const setDataFieldValue = (data: any, field: string, value: any) => {
    if (field.indexOf('.') === -1) {
        data[field] = value;
    } else {
        const fields = field.split('.');
        let tempObject = data;
        for (let i = 0, len = fields.length - 1; i < len; ++i) {
            tempObject = tempObject[fields[i]] || {};
        }
        tempObject[fields[fields.length - 1]] = value;
    }
    const cache = objectDependsCache.get(data);
    if (cache !== undefined) {
        for (const [key, set] of cache) {
            const tempValue = getDataFieldValue(data, key);
            for (const d of set) {
                if (d.value !== tempValue) {
                    d.setValue(tempValue);
                    previousValueMap.set(d, tempValue);
                    d.commit();
                }
            }
        }
    }
};

const previousValueMap = new WeakMap<Part, unknown>();
const oldListenerSymbol = Symbol();
const oldEventTypeSymbol = Symbol();
/**
 * 实现类似v-model 功能。
 * @param modelObject 需要被跟踪的对象object
 * @param fieldValue 对象属性，支持按照“.” 分隔。,或者是一个函数，将对象转换需要的值
 * @param eventName 如果绑定Atrtribute，或者property ,则通过 eventName 更新model 值，默认为input 事件，此时fieldValue 必须是modeleObject 的属性值。
 */
const model = directive((modelObject: Object, fieldValue: string |((modelValue: any) => any) | undefined, eventName: string = 'input') => (part: Part) => {
    addDependsToCache(modelObject, fieldValue, part);
    const result = getDataFieldValue(modelObject, fieldValue);
    let element: Element = null;
    if (part instanceof AttributePart || part instanceof PropertyPart) {
        element = part.committer.element;
    } else if (part instanceof BooleanAttributePart) {
        element = part.element;
    }
    if (element != null&&typeof fieldValue ==='string') {
        // tslint:disable-next-line: no-any
        let oldListener = (element as any)[oldListenerSymbol];
        // tslint:disable-next-line: no-any
        if (oldListener != null) {
            const oldEventType: string = (element as any)[oldEventTypeSymbol];
            element.removeEventListener(oldEventType, oldListener);
        }
        oldListener = (event: Event) => {
            // tslint:disable-next-line: no-any
            if ((element as any).value !== undefined) {
                // tslint:disable-next-line: no-any
                setDataFieldValue(modelObject, fieldValue, (element as any).value);
            } else if (event instanceof CustomEvent) {
                setDataFieldValue(modelObject, fieldValue, event.detail.value);
            }
        };
        element.addEventListener(eventName, oldListener);
        // tslint:disable-next-line: no-any
        (element as any)[oldListenerSymbol] = oldListener;
        // tslint:disable-next-line: no-any
        (element as any)[oldEventTypeSymbol] = eventName;
    }
    const preivious = previousValueMap.get(part);
    if (preivious === undefined || preivious !== result) {
        part.setValue(result);
        previousValueMap.set(part, result);
    }


});
export { setDataFieldValue };
export default model;