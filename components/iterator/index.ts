
import { css, customElement, html, internalProperty, LitElement, property, TemplateResult } from 'lit-element';
import PLazy from '../lazy-view/index';
const nothing = html``;
@customElement('p-iterator')
export default class PIterator<T> extends LitElement {
    static get styles() {
        return css`
        :host{
            display:content;
        }
        `;
    }
    // tslint:disable-next-line: no-any
    @property({ attribute: false,
            hasChanged:(value:T,oldValue:T)=>{
                return true;
    } }) value: Object | Map<T, any> | Set<T> | Array<T>;
    // tslint:disable-next-line: no-any
    @property({ attribute: false }) template: (item: any, key?: any) => TemplateResult;

    createRenderRoot() {
        return this;
    }
    
    render(): TemplateResult | TemplateResult[] {
        const value = this.value;
        if (value === undefined || value === null || this.template == null) {
            return nothing;
        }
        const result = [];
        if (Array.isArray(this.value)) {
            // tslint:disable-next-line: no-any
            const array = <Array<any>>(this.value);
            for (let i = 0, j = array.length; i < j; i++) {
                result.push(i>100? PLazy.wrapLazy( this.template(array[i], i)): this.template(array[i], i));
            }
        } else if (value instanceof Map) {
            let i=0;
            // tslint:disable-next-line: no-any
            const map = <Map<any, any>>value;
            for (const [key, value] of map) {

                result.push(i>100? PLazy.wrapLazy(this.template(value, key)):this.template(value, key));
                i++;
            }
        } else if (value instanceof Set) {
            let i=0;
            // tslint:disable-next-line: no-any
            const set = <Set<any>>value;
            for (const value of set) {
               
                result.push(i>100?PLazy.wrapLazy(this.template(value)):this.template(value));
                i++;
            }
        } else {
            let i=0;
            // tslint:disable-next-line: no-any
            const object = <any>value;
            for (const key in object) {
                result.push(i>100?PLazy.wrapLazy(this.template(object[key], key)):this.template(value));
                i++;
            }
        }
        return result;
    }
    updated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(_changedProperties);

    }





}


