import { directive, Part, AttributePart, PropertyPart, BooleanAttributePart } from 'lit-html';
type CacheNode = {
    [key: string]: Set<Part>;
};
const objectDependsCache = new WeakMap<Object, CacheNode>();
const addDependsToCache = (modeValue: Object, fieldPath: string, part: Part) => {
    let node = objectDependsCache.get(modeValue);
    if (node === undefined) {
        node = {};
        objectDependsCache.set(modeValue, node);
    }
    let set = node[fieldPath];
    if (set === undefined) {
        set = new Set<Part>();
        node[fieldPath] = set;
    }
    set.add(part);
};
// tslint:disable-next-line: no-any
const getDataFieldValue = (data: any, field: string ) => {
    if (data && field) {
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
        for (const key in cache) {
            const tempValue = getDataFieldValue(data, key);
            const set = cache[key];
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

/**
 * 实现类似v-model 功能。
 * @param modelObject 对象object
 * @param fieldValue 对象属性，支持按照.分隔。
 * @param eventName 如果绑定属性，或者property ,则通过 eventName 更新model 值，默认为input 事件。
 */
const model = directive((modelObject: Object, fieldValue: string, eventName: string = 'input') => (part: Part) => {
    addDependsToCache(modelObject, fieldValue, part);
    const result = getDataFieldValue(modelObject, fieldValue);
    let element: Element = null;
    if (part instanceof AttributePart || part instanceof PropertyPart) {
        element = part.committer.element;
    } else if (part instanceof BooleanAttributePart) {
        element = part.element;
    }
    if (element != null) {
        // tslint:disable-next-line: no-any
        let oldListener = (element as any).__oldListener;
        // tslint:disable-next-line: no-any
        const oldEventType: string = (element as any).__oldListener_TYPE;
        if (oldListener != null) {
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
        (element as any).__oldListener = oldListener;
        // tslint:disable-next-line: no-any
        (element as any).__oldListener_TYPE = eventName;
    }
    const preivious = previousValueMap.get(part);
    if (preivious === undefined || preivious !== result) {
        part.setValue(result);
        previousValueMap.set(part, result);
    }


});
export { setDataFieldValue };
export default model;