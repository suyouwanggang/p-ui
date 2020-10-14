/**
 *
 * @param data  对象
 * @param field  对象属性，支持按照.分隔的多重属性
 */
// tslint:disable-next-line: no-any
const getDataFieldValue = (data: any, field: string | Function) => {
    if (typeof field === 'function') {
        return field(data);
    } else {
        if (data && field) {
            if (field.indexOf('.') === -1) {
                return data[field];
            }
            else {
                const fields = field.split('.');
                let value = data;
                for (let i = 0, len = fields.length; i < len; ++i) {
                    value = value[fields[i]];
                }
                return value;
            }
        } else {
            return null;
        }
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
            tempObject = tempObject[fields[i]];
        }
        tempObject[fields[fields.length - 1]] = value;
    }

};
import './dependence';
import Dependence from './dependence';
const isRectiveSymbol = Symbol('isRective');
// tslint:disable-next-line: no-any
const isRective = (data: any) => {
    return Reflect.getOwnPropertyDescriptor(data, isRectiveSymbol) !== undefined;
};
// tslint:disable-next-line: no-any
const setRective = (data: any) => {
    if (isRective(data)) {
        return false;
    }
    if (!isObject(data)) {
        return false;
    }
    Reflect.defineProperty(data, isRectiveSymbol, {
        configurable: false,
        enumerable: false,
        value: null,
        writable: false
    });
    return true;
};
// tslint:disable-next-line: no-any
const isObject = (val: any) => {
    return val !== undefined && val != null && typeof val === 'object' && Array.isArray(val) === false;
};
// tslint:disable-next-line: no-any
const defindeRective = (data: any) => {
    if (!setRective(data)) {
        return;
    }
    Object.keys(data).forEach((key: string) => {
        const dep = new Dependence();
        let oldValue = data[key];
        if(isObject(oldValue)){
            defindeRective(oldValue);
        }
        Reflect.defineProperty(data, key, {
            get() {
                dep.push();
                return oldValue;
            },
            set(value: unknown) {
                if (value !== oldValue) {
                    oldValue = value;
                    dep.notify(value);
                }
            }
        });

    });
};
export { defindeRective, getDataFieldValue, setDataFieldValue };
