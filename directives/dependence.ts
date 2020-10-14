import { Part } from 'lit-html';

export default class Dependence {
    public static target: Part = null;
    private partList: Part[] = new Array<Part>();
    public push() {
        if (Dependence.target != null) {
            this.partList.push(Dependence.target);
        }

    }
    public notify(value: unknown) {
        this.partList.forEach((item: Part) => {
            if(item.value!==value){
                item.setValue(value);
                item.commit();
            }
        });
    }
}