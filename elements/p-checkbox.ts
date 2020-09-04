import { css, customElement, LitElement, property, html } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import PTips from './p-tips';
@customElement('p-checkbox')
export class PCheckbox extends LitElement {
    @property({ type: String, reflect: true }) errortips: string;
    // @property({ type: String, reflect: true }) tips: string;
    @property({ type: String, reflect: true }) value: string;
    @property({ type: String, reflect: true }) name: string;
    @property({ type: Boolean, reflect: true }) novalidate: boolean = false;
    @property({ type: Boolean, reflect: true }) invalid: boolean = false;
    @property({ type: Boolean, reflect: true }) checked: boolean = false;
    @property({ type: Boolean, reflect: true }) disabled: boolean = false;
    @property({ type: Boolean, reflect: false }) required: boolean = false;
    @property({ type: Boolean, reflect: true }) readonly: boolean = false;
    static get styles() {
        return css`
        :host{ 
            display:inline-block;
            font-size:14px;
            color:var(--fontColor,#333);
            -webkit-tap-highlight-color: transparent;
        }
        :host([disabled]){ 
            pointer-events: none; 
            opacity:.6; 
        }
        :host([disabled]) label{ 
            pointer-events: all;  
            cursor: not-allowed; 
        }
        #checkbox{
            position:absolute;
            clip:rect(0,0,0,0);
        }
        :host(:focus-within) .cheked,:host(:not([disabled])) label:hover .cheked { 
            border-color:var(--themeColor,#42b983);
            /*box-shadow: 0 0 10px rgba(0,0,0,0.1);*/
            z-index:1;
        }
        :host(:focus-within) #checkbox,:host(:active) #checkbox{
            z-index:2
        }
        :host([disabled]) .cheked{ 
            background:rgba(0,0,0,.06);
        }
        label{
            box-sizing:border-box;
            cursor:pointer;
            display:flex;
            align-items:center;
        }
        p-tips{
            display:block;
            padding-left: 0.575em;
            margin-left: -0.575em;
        }
        p-tips[show=true]{
            --themeColor:var(--errorColor,#f4615c);
            --borderColor:var(--errorColor,#f4615c);
        }
        .cheked{
            display:flex;
            justify-content: center;
            align-items: center;
            margin-right:.5em;
            position:relative;
            width: 1em;
            height: 1em;
            border: 0.0875em solid var(--borderColor,rgba(0,0,0,.2));
            border-radius: 0.15em;
            text-align: initial;
            transition:.3s;
        }
        :host(:empty) .cheked{
            margin-right:0;
        }
        .cheked::before{
            position:absolute;
            content:'';
            width:74%;
            height:0.15em;
            background:#fff;
            transform:scale(0);
            border-radius: 0.15em;
            transition: .2s cubic-bezier(.12, .4, .29, 1.46) .1s;
        }
        .cheked::after{
            position:absolute;
            content:'';
            width:100%;
            height:100%;
            background:var(--themeColor,#42b983);
            border-radius:50%;
            opacity:.2;
            transform:scale(0);
            z-index:-1;
            transition: .2s cubic-bezier(.12, .4, .29, 1.46) .1s;
        }
        .icon{
            width: 100%;
            height: 100%;
            transform: scale(0);
            transition: .2s cubic-bezier(.12, .4, .29, 1.46) .1s;
        }
        #checkbox:focus-visible+label .cheked::after{
            transform:scale(2.5);
        }
        #checkbox:checked+label .cheked .icon{
            transform: scale(1.5);
        }
        #checkbox:checked+label .cheked,#checkbox:indeterminate:not(:checked)+label .cheked{
            border-color:transparent;
            background-color:var(--themeColor,#42b983);
        }
        #checkbox:indeterminate:not(:checked)+label .cheked::before{
            transform:scale(1);
        }
    `;
    }
    private _dispatchangeEvent() {
        this.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            detail: {
                value: this.value
                , checed: this.checked
            }
        }));
    }
    firstUpdated() {
        this.checkbox.addEventListener('change', (ev: Event) => {
            this.checked = !this.checked;
            this._dispatchangeEvent();
        });
        this.checkbox.addEventListener('keydown', (ev: KeyboardEvent) => {
            switch (ev.keyCode) {
                case 13://Enter
                    ev.stopPropagation();
                    this.checked = !this.checked;
                    this._dispatchangeEvent();
                    break;
                default:
                    break;
            }
        });

        this.checkbox.addEventListener('focus', (ev: FocusEvent) => {
            ev.stopPropagation();
            this.dispatchEvent(new CustomEvent('focus', {
                detail: {
                    value: this.value
                    , checked: this.checked
                }
            }));
        });
        this.checkbox.addEventListener('blur', (ev: Event) => {
            ev.stopPropagation();
            this.dispatchEvent(new CustomEvent('blur', {
                detail: {
                    value: this.value
                    , checked: this.checked
                }
            }));
        });
    }
    render() {
        return html`
             <p-tips id="tip" type="error" dir="topleft">
             <input type="checkbox" ?checked=${this.checked} name=${ifDefined(this.name)} id="checkbox" ?disabled=${this.disabled} .required=${this.required}>
             <label for="checkbox">
                <span class="cheked"><svg class="icon" style="fill: #fff;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" ><path d="M700.7232 331.008l73.984 70.7584-329.5744 344.7808-192.6656-190.1056 71.936-72.9088L443.0336 600.576z"></path></svg></span>
                <slot></slot>
            </label>
        </p-tips>
        `;
    }
    get form(): HTMLFormElement {
        return this.closest('p-form, form');
    }
    focus() {
        this.checkbox.focus();
    }
    get tip(): PTips {
        return this.shadowRoot.querySelector('#tip');
    }
    reset() {
        this.checkbox.checked = false;
        this.invalid = false;
        this.tip.show = 'false';
    }
    get validity() {
        return this.checkbox.checkValidity();
    }
    checkValidity() {
        if (this.novalidate || this.disabled || this.form && this.form.novalidate) {
            return true;
        }
        if (this.validity) {
            this.invalid = false;
            this.tip.show = 'false';
            return true;
        } else {
            this.focus();
            this.invalid = true;
            this.tip.show = 'true';
            this.tip.tips = this.errortips || this.checkbox.validationMessage;
            return false;
        }
    }
    get checkbox(): HTMLInputElement {
        return this.renderRoot.querySelector('#checkbox');
    }

}


@customElement('p-checkbox-group')
export class PCheckboxGroup extends LitElement {

    static get styles() {
        return css`:host {
            display:inline-block;
        }
        :host([invalid]) {
            --borderColor: var(--errorColor,#f4615c);
        }

        :host(:focus-within) p-tips,:host(:hover) p-tips{
            z-index:2;
        }
        :host([disabled]){ 
            pointer-events: none; 
        }
        :host([disabled]) p-tips{
            pointer-events: all;
            cursor: not-allowed;
            outline: 0;
        }
        :host([vertical]) ::slotted(p-checkbox){
            display:block;
        }
        :host([disabled]) ::slotted(p-checkbox){
            pointer-events: none;
            opacity:.6;
        }
        ::slotted(p-checkbox){
            transition: opacity .3s;
        }
        `;
    }


    @property({ type: String, reflect: true }) name: string;
    @property({ type: Number, attribute:false }) min: number = 0;
    @property({ type: Number, attribute:false }) max: number = Infinity;
    @property({ type: Boolean, reflect: true }) disabled: boolean = false;
    @property({ type: Array, reflect: true }) value: Array<String>;
    @property({ type: Boolean, reflect: true }) novalidate: boolean = false;
    @property({ type: Boolean, reflect: true }) invalid: boolean = false;
    @property({ type: Boolean, reflect: false }) required: boolean = false;
    @property({ type: Boolean, reflect: false }) vertical: boolean = false;
    @property({ type: Boolean, reflect: true }) readonly: boolean = false;

    render() {
        return html`<p-tips id="tip" @change="${this._handerEvent}" type="error"><slot id='slot'></slot></p-tips>`;
    }
    attributeChangedCallback(name: string, old: string, value: string) {
        super.attributeChangedCallback(name, old, value);
        if (name === 'disabled' && this.tip) {
            if (value !== null) {
                this.tip.setAttribute('tabindex', '-1');
            } else {
                this.tip.removeAttribute('tabindex');
            }
        } if (name === 'value' && old !== value) {
            this._setChildValue();
        }
    }
    _setChildValue() {
        if (this.value != null) {
            this.elements.forEach((el: PCheckbox) => {
                const val = el.value;
                if (this.value.includes(val)) {
                    el.checked = true;
                } else {
                    el.checked = false;
                }
            })
        }
    }
    private getChildCheckValue() {
        const result: Array<String> = [];
        this.elements.forEach((el: PCheckbox) => {
            if (el.checked) {
                result.push(el.value);
            }
        });
        return result;
    }
    private _handerEvent(event: Event) {
        const p = event.target;
        if (p instanceof PCheckbox) {
            this.value = this.getChildCheckValue();
            this.dispatchEvent(new CustomEvent('change', {
                bubbles: true,
                detail: {
                    value: this.value
                }
            }));
            this.checkValidity();
        }
    }
    firstUpdated() {
        if (this.value && this.value.length > 0) {
            this.value.forEach((item, index) => {
                this.value[index] = String(item);
            })
        }

        const slots: HTMLSlotElement = this.shadowRoot.querySelector('#slot');
        if (slots) {
            slots.addEventListener('slotchange', () => {
                this._setChildValue();
            });
        }
    }

    get validity() {
        const len = this.len;
        if (!this.required && len === 0) {
            return true;
        }
        return len >= this.min && len <= this.max;
    }
    get len() {
        return this.value != null ? this.value.length : 0;
    }
    reset() {
        this.value = [];
        this.invalid = false;
        this.tip.show = 'false';
    }

    checkAll() {
        this.elements.forEach((el: PCheckbox) => {
            el.checked = true;
        });
    }
    get elements(): NodeListOf<PCheckbox> {
        return this.querySelectorAll('p-checkbox');
    }
    get form(): HTMLFormElement {
        return this.closest('p-form,form');
    }
    get tip(): PTips {
        return this.renderRoot.querySelector('#tip');
    }
    checkValidity() {
        if (this.novalidate || this.disabled || this.form && this.form.novalidate) {
            return true;
        }
        if (this.validity) {
            this.tip.show = 'false';
            this.invalid = false;
            return true;
        } else {
            this.focus();
            this.tip.show = 'true';
            this.invalid = true;
            if (this.len < this.min) {
                this.tip.tips = `请至少选择${this.min}项`;
            }
            if (this.len > this.max) {
                this.tip.tips = `至多选择${this.max}项`;
            }
            return false;
        }
    }


}