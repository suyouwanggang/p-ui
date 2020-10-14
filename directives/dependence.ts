import { Part } from 'lit-html';
import { getDataFieldValue } from './objectuitls';
export default class Dependence {
    public static target: Part = null;
    private partList: Part[] = new Array<Part>();
    private setPart: WeakSet<Part> = new WeakSet<Part>();
    public push() {
        if (Dependence.target != null && !this.setPart.has(Dependence.target)) {
            this.partList.push(Dependence.target);
        }
    }
    public notify(value: unknown, key: string) {
        this.partList.forEach((item: Part) => {
            const fieldValue: string = (item as any).fieldValue;
            if (key === fieldValue) {
                if (item.value !== value) {
                    item.setValue(value);
                    item.commit();
                }
            } else {
                const field_result = getDataFieldValue(value, fieldValue.substring(key.length + 1));
                if (item.value !== field_result) {
                    item.setValue(field_result);
                    item.commit();
                }
            }

        });
    }
}