import { directive, Part, AttributePart, PropertyPart, BooleanAttributePart } from 'lit-html';
import Dependence from './dependence';
import { defindeRective, getDataFieldValue, setDataFieldValue } from './objectuitls';
const previouseEventSet = new WeakSet<Part>();
/**
 * 实现类似v-model 功能。
 * @param modelObject 对象object
 * @param fieldValue 对象属性，支持按照.分隔。
 * @param eventName 如果绑定属性，或者property ,则通过 eventName 更新model 值，默认为input 事件。
 */
const model = directive((modelObject: Object, fieldValue: string, eventName: string = 'input') => (part: Part) => {
    defindeRective(modelObject);
    previouseEventSet.add(part);
    Dependence.target = part;
    (part as any).fieldValue=fieldValue;
    const result = getDataFieldValue(modelObject, fieldValue);
    let element: Element = null;
    if (part instanceof AttributePart || part instanceof PropertyPart) {
        element = part.committer.element;
    } else if (part instanceof BooleanAttributePart) {
        element = part.element;
    }
    if (element != null) {
        element.addEventListener(eventName, (event: Event) => {
            // tslint:disable-next-line: no-any
            if ((element as any).value !== undefined) {
                // tslint:disable-next-line: no-any
                setDataFieldValue(modelObject, fieldValue, (element as any).value);
            } else if (event instanceof CustomEvent) {
                setDataFieldValue(modelObject, fieldValue, event.detail.value);
            }
        });
    }
    part.setValue(result);
    Dependence.target =null;
});

export default model;