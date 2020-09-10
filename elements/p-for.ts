
import { LitElement, html, customElement, property, TemplateResult } from 'lit-element'
const cache = new WeakMap<Array<String>, any>();
const createTemplate = function (template: string, value: string = 'value', index: string = 'index') {
    const str = `return ${'html`'}${template}${'`'};`;
    const key = [];
    key.push(template);
    key.push(value);
    key.push(index);
    let f: any = cache.get(key);
    if (f == null || f === undefined) {
        f = new Function(value, index, str);
        cache.set(key, f);
    }
    return f;
}

function isObject(val: any) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
};
@customElement('p-for')
export class PFor extends LitElement {
    @property({ type: Array, reflect: true, attribute: false }) items: Array<Object> = undefined;
    @property({ type: String, reflect: true }) value: string = 'value';
    @property({ type: String, reflect: true }) index: string = 'index';
    @property({ type: String, reflect: true }) template: string = undefined;
    createRenderRoot() {
        return this.attachShadow({ mode: 'open' });
    }
    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(_changedProperties);
        this.renderSubItem();
    }
    constructor() {
        super();
    }
    get templateString() {
        let template = null;
        const templateDom = this.querySelector('template');
        if (templateDom) {
            template = templateDom.innerHTML;
        } else {
            template = this.template;
        }
        this.template = template;
        return template;
    }
    render() {
        return html`<slot></slot>`;
    }
    renderSubItem() {
        const templateString = this.templateString;
        if (templateString === undefined) {
            return;
        }
        const target = this;
        const htmlResult: TemplateResult[] = [];
        const f = createTemplate(this.templateString, this.value, this.index);
        const renderFun = (this.constructor as typeof LitElement).render;
        this.items.forEach((item, index) => {
            htmlResult.push(f(item, index));
        });
        renderFun(html`${htmlResult}`, this, { scopeName: this.localName, eventContext: this });
    }

    update(changedProperties: Map<string | number | symbol, unknown>) {
        super.update(changedProperties);
        this.renderSubItem();
    }


}


