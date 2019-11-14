import { css, customElement, html, LitElement, property } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import { getValidityResult } from './helper/formValidate';
import PButton from './p-button';
import PTips from './p-tips';
type inputtype = 'text' | 'password' | 'email' | 'url' | 'number' | 'tel' | 'search';
class MinInputClass extends LitElement {
    public get input(): HTMLInputElement | unknown {
        return this;
    }
    @property({ type: String, reflect: true }) name: string;
    @property({ type: String, reflect: false }) value: string = '';
    @property({ type: Boolean, reflect: true }) invalid: boolean = false;
    @property({ type: Boolean, reflect: true }) novalidate: boolean = false;
    @property({ type: Boolean, reflect: true }) required: boolean = false;
    @property({ type: String, reflect: true }) errorMessage: string = undefined;
    @property({ type: String, reflect: true }) pattern: string = undefined;
    @property({ type: Number, reflect: true }) minLength: number = undefined;
    @property({ type: Number, reflect: true }) maxLength: number = undefined;
    @property({ type: Number, reflect: true }) min: number = undefined;
    @property({ type: Number, reflect: true }) max: number = undefined;
    @property({ type: Number, reflect: true }) scale: number = undefined;
    @property({ type: Object, attribute: false }) customValidateMethod: any = undefined;
    get validity(): boolean {
        return getValidityResult(this).valid;
    }
    get validationMessage(): string {
        const result = getValidityResult(this);
        if (!result.valid) {
            const errorMessage = this.errorMessage;
            if (errorMessage === null || errorMessage === undefined) {
                const array = result.message;
                const message = array[0].message;
                return message;
            } else {
                return errorMessage;
            }
        } else {
            return '';
        }
    }

}

function throttleFunction(fn: any, delay: number, context: any) {
    let previous = 0;
    // 使用闭包返回一个函数并且用到闭包函数外面的变量previous
    return function () {
        const args = [...arguments];
        const now: number = + new Date();
        if (now - previous > delay) {
            fn.apply(context, args);
            previous = now;
        }
    }
}

@customElement('p-input')
class PInput extends MinInputClass {
    @property({ type: String, reflect: true }) tips: string;
    @property({ type: String, reflect: false }) errortips: string;
    @property({ type: Boolean, reflect: true }) disabled: boolean = false;
    @property({ type: Boolean, reflect: true }) readonly: boolean = false;
    @property({ type: String, reflect: true }) type: inputtype = 'text';
    @property({ type: String, reflect: true }) placeholder: string;
    @property({ type: String, reflect: false }) leftIcon: string;
    @property({ type: String, reflect: false }) rightIcon: string;
    @property({ type: Boolean, reflect: true }) block: boolean = false;
    @property({ type: Boolean, reflect: true }) search: boolean = false;
    @property({ type: Boolean, reflect: true }) clear: boolean = false;
    @property({ type: Number, reflect: true }) debounce: number = 0;
    @property({ type: Number, reflect: true }) throttle: number = 0;
    @property({ type: Number, reflect: true }) step: number = undefined;
    @property({ type: Boolean, reflect: true }) showStep: boolean = false;
    static get styles() {
        return css`
        :host{
            display:inline-block;
            height:2em;
            border:1px solid var(--borderColor,rgba(0,0,0,.2));
            border-radius:var(--borderRadius,.25em);
            transition:border-color .3s,box-shadow .3s;
            color: var(--fontColor,#333);
            cursor:text;
        }
        :host([block]){
            display:block;
        }
        :host([disabled]){
            opacity:var(--disabled-opaticity,0.8);
            cursor:not-allowed;
        }
        :host([disabled]) p-tips{
            pointer-events:none;
            background:rgba(0,0,0,.08);
        }

        :host([invalid]){
            --themeColor:var(--errorColor,#f4615c);
            border-color:var(--errorColor,#f4615c);
        }

        :host(:focus-within:not([disabled])), :host(:not([disabled]):hover){
            border-color:var(--themeColor,#42b983);
        }
        p-tips{
            box-sizing:border-box;
            display:flex;
            align-items:center;
            height:100%;
        }
        p-tips[show=true]{
            --color:var(--errorColor,#f4615c);
        }
        p-tips>input{
            text-align: inherit;
            color: currentColor;
            padding:0;
            border: 0;
            outline: 0;
            line-height: inherit;
            font-size: inherit;
            font-family: inherit;
            flex: 1;
            min-width: 0;
            -webkit-appearance: none;
            -moz-appearance: textfield;
            background: none;
            overflow-x: hidden;
            transition: color .3s;
            margin:0.25em 0.25em;
        }

        input[type="number"]::-webkit-inner-spin-button{
            display:none;
        }
        ::-moz-focus-inner,::-moz-focus-outer{
            border:0;
            outline : 0;
        }
        input::placeholder{
            color:#999;
            font-size:90%;
        }
        p-icon{
            display: flex;
            margin: 0.25em;
        }
        :host(:focus-within:not([disabled])) .leftIcon{
            color:var(--themeColor,#42b983);
        }
        .eye-icon{
            line-height: 1em;
            padding:0.3em 0.3em;
            cursor:pointer;
        }
        :host([disabled]) .eye-icon{
            cursor:not-allowed;
        }
        .btn-number{
            display:flex;
            flex-direction:column;
            margin-right:0.25em;
            width:1em;
            visibility:hidden;
            transition:0s;
        }
       
        .btn-number p-button{
            display: flex;
            color: #999;
            border-radius:0;
            width:100%;
            flex:1;
            padding:0;
            font-size:.8em;
            transition:.2s;
        }
        .btn-number p-button:hover{
            flex:1.5;
        }
        :host(:focus-within:not([disabled])) .btn-number, :host(:not([disabled]):hover) .btn-number {
            visibility: visible;
        }
    `;
    }


    public checkValidity() {
        if (this.novalidate || this.disabled || this.form && this.form.novalidate) {
            return true;
        }
        if (this.validity) {
            this.pTipCon.show = 'false';
            this.invalid = false;
            this.pTipCon.tips = '';
            return true;
        } else {
            this.pTipCon.show = 'true';
            this.invalid = true;
            this.pTipCon.tips = this.validationMessage;
            return false;
        }
    }


    get input(): HTMLInputElement {
        return this.renderRoot.querySelector('#input');
    }

    focus() {
        this.input!.focus();
    }
    reset() {
        this.value = '';
        this.input!.value = '';
        this.invalid = false;
        this.pTipCon.tips = '';
        this.pTipCon.show = 'false';
    }
    get form(): HTMLFormElement {
        return this.closest('form,p-form');
    }
    private typePassword() {
        const btn: PButton = this.renderRoot.querySelector('#eye-icon');
        if (this.type === 'password') {
            this.type = 'text';
            btn.icon = 'eye';
        } else {
            this.type = 'password';
            btn.icon = 'eye-close';
        }
    }
    clearValue() {
        this.reset();
    }
    searchValue() {
        this.dispatchEvent(new CustomEvent('submit', {
            detail: {
                value: this.value
            }
        }));
    }
    dispatchChange() {
        this.checkValidity();
        const changeEvent = new CustomEvent('change', {
            detail: { value: this.input.value }
        });
    }
    dispatchFocus() {
        const changeEvent = new CustomEvent('focus', {
            detail: { value: this.input.value }
        });
        this.dispatchEvent(changeEvent);
        this.checkValidity();
    }
    _dispatchInput() {
        const inputEvent = new CustomEvent('input', {
            cancelable: true,
            detail: { value: this.input.value }
        });
        this.dispatchEvent(inputEvent);
    }
    private static NUMBERINPUTARRAY: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '-'];
    private _processInput(event: InputEvent) {
        if (this.type === 'number') {
            if (event.data && PInput.NUMBERINPUTARRAY.indexOf(event.data) === -1) {
                const indexOf = this.input.value.lastIndexOf(event.data);
                if (indexOf >= -1) {
                    this.input.value = this.input.value.substring(0, indexOf);
                }
                event.preventDefault();
            }
            if (this.input.value !== '-') {
                const v = Number(this.input.value);
                if (isNaN(v)) {
                    this.input.value = '';
                }
            }
        }
        if (this.maxLength != undefined && this.input.value.length > this.maxLength) {
            this.input.value = this.input.value.substr(0, this.maxLength);
        }
        this.value = this.input.value;
        this.checkValidity();
        const inputEl = this;
        event.stopPropagation();
        if (this.debounce > 0) {
            let timeout: number = (this as any).debounceTimeoutID;
            timeout && window.clearTimeout(timeout);
            (this as any).debounceTimeoutID = timeout = window.setTimeout(() => {
                this._dispatchInput();
            }, this.debounce);
        } else if (this.throttle > 0) {
            let throttleFun = (this as any).throttleFun;
            if (throttleFun === undefined) {
                throttleFun = throttleFunction(() => {
                    inputEl._dispatchInput();
                }, this.throttle, inputEl);
                (this as any).throttleFun = throttleFun;
            }
            throttleFun();
        } else {
            this._dispatchInput();
        }
    }
    update(changedProperties: Map<string | number | symbol, unknown>) {
        super.update(changedProperties);
        if (changedProperties.has('throttle')) {
            (this as any).throttleFun = undefined;
        } else if (changedProperties.has('debounce')) {
            window.clearTimeout((this as any).debounceTimeoutID);
            (this as any).debounceTimeoutID = undefined;
        }
    }
    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.update(changedProperties);
        if (changedProperties.has('type')) {
            this.pTipCon.show = 'false';
            this.pTipCon.tips = '';
            this.invalid = false;

            if (this.value !== '' && this.type === 'number') {
                const n = Number(this.value);
                if (isNaN(n)) {
                    this.value = '';
                }
            }
        }
    }
    get pTipCon(): PTips {
        return this.renderRoot.querySelector('#tips');
    }
    private firstTypePassword: boolean = false;
    firstUpdated() {
        if (this.type === 'password') {
            this.firstTypePassword = true;
        }
    }
    private _stepAdd() {
        if (this.step === undefined) {
            this.step = 1;
        }
        let n = Number(this.value);
        if (this.max === undefined || (n + Number(this.step) < this.max)) {
            n = n + Number(this.step);
            this.value = n.toString();
            this.dispatchChange();
        }
    }
    private _stepDel() {
        if (this.step === undefined) {
            this.step = 1;
        }
        let n = Number(this.value);
        if (this.min === undefined || (n - Number(this.step) >= this.min)) {
            n = n - Number(this.step);
            this.value = n.toString();
            this.dispatchChange();
        }
    }
    private _innerType() {
        if (this.type === 'text' || this.type === 'password' || this.type === 'search') {
            return this.type;
        } else {
            return 'text';
        }
    }
    render() {
        return html`<p-tips  .tips=${this.tips} id="tips"  >
                ${this.leftIcon ? html`<p-icon  name='${this.leftIcon}'  class='leftIcon' ></p-icon>` : ''}
                <input id="input" name="${ifDefined(this.name)}"  placeholder="${ifDefined(this.placeholder)}" .value="${this.value}"  @input="${this._processInput}" @change="${this.dispatchChange}"
                  ?readOnly=${this.readonly}  .type="${this._innerType()}"    ?disabled=${this.disabled}
                  @focus=${this.dispatchFocus} 
                   />
                ${this.rightIcon ? html`<p-icon  name='${this.rightIcon}'   class='rightIcon' ></p-icon>` : ''}
                ${this.firstTypePassword ? html`<p-button class='eye-icon' id='eye-icon' @click='${this.typePassword}'  icon="eye-close" type="flat" shape="circle"></p-button>` : ''}
                ${this.clear ? html`<p-icon  name='close-circle'  class='clearIcon' @click=${this.clearValue} ></p-icon>` : ''}
                ${this.search ? html`<p-button  icon='search'  class='eye-icon' @click=${this.searchValue} type="flat"></p-button>` : ''}
                ${this.type === 'number' && this.showStep ? html`<div class="btn-right btn-number"><p-button id="btn-add" icon="up" @click="${this._stepAdd}" type="flat" ></p-button><p-button id="btn-sub" @click="${this._stepDel}" icon="down" type="flat"></p-button></div>` : ''}
            </p-tips>`;
    }
}
