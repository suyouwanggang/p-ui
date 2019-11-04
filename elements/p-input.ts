import { css, customElement, html, LitElement, property,  } from 'lit-element';
import  {ifDefined} from 'lit-html/directives/if-defined';
import {getNumberReg} from './helper/util';
import PTips, {} from './p-tips';
 type inputtype= 'text'|'password'|'email'|'url'|'number'|'tel'|'search';

 const defaultOK = {
    badInput: false,
    customError: false,
    patternMismatch: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valid: true,
    valueMissing: false
};

 @customElement('p-input')
export class PInput extends LitElement {
    @property({ type: String, reflect: true }) tips: string ;
    @property({ type: String, reflect: false }) errortips: string ;
    @property({ type: String, reflect: true }) name: string ;
    @property({ type: String, reflect: true }) type: inputtype = 'text';
    @property({ type: String, reflect: true }) placeholder: string ;
    @property({ type: String, reflect: false }) value: string = '';
    @property({ type: String, reflect: false }) leftIcon: string;
    @property({ type: String, reflect: false }) rightIcon: string;
    @property({ type: Boolean, reflect: true }) block: boolean = false;
    @property({ type: Boolean, reflect: true }) disabled: boolean = false;
    @property({ type: Boolean, reflect: true }) readonly: boolean = false;
    @property({ type: Boolean, reflect: true }) search: boolean = false;
    @property({ type: Boolean, reflect: true }) clear: boolean = false;


    @property({ type: Boolean, reflect: true }) invalid: boolean = false;
    @property({ type: Boolean, reflect: true }) novalidate: boolean = false;
    @property({ type: Boolean, reflect: false }) required: boolean = false;
    @property({ type: String, reflect: false }) pattern: string = undefined;
    @property({ type: Number, reflect: false }) minLength: number = undefined;
    @property({ type: Number, reflect: false }) maxLength: number = undefined;
    @property({ type: Number, reflect: false }) min: number = undefined;
    @property({ type: Number, reflect: false }) max: number = undefined;
    @property({ type: Number, reflect: false }) scale: number = 0;



    static get styles() {
       return  css `
        :host{
            display:inline-block;
            height:1.8em;
            border:1px solid var(--borderColor,rgba(0,0,0,.2));
            border-radius:var(--borderRadius,.25em);
            transition:border-color .3s,box-shadow .3s;
            color: var(--fontColor,#333);
            cursor:text;
        }
        :host([block]){
            display:block;
        }
        :host[disabled]{
            opacity:var(--disabled-opaticity,0.4);
            cursor:not-allowed;
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
            height:100%;
        }
        p-tips[show=true]{
            --color:var(--errorColor,#f4615c);
        }
        :host([disabled]) div{
            cursor:not-allowed;
            pointer-events:all;
       }

       :host([disabled]) div input{
            cursor:not-allowed;
            pointer-events:none;
       }
       p-tips>input{
            padding: .25em 4px;
            text-align: inherit;
            color: currentColor;
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
            font-size:1.2em;
            margin-left: 4px;
            margin-right:4px;
            color: #999;
        }
        .rightIcon,.searchIcon{
            margin-right:4px;
        }
        :host(:focus-within:not([disabled])) .leftIcon{
            color:var(--themeColor,#42b983);
        }
        .clearIcon,.eyeIcon {
            visibility:hidden;
            cursor:pointer;
        }
        :host(:focus-within:not([disabled])) .clearIcon,
        :host(:not([disabled]):hover) .clearIcon,
        :host(:focus-within:not([disabled])) .eyeIcon,
        :host(:not([disabled]):hover) .eyeIcon
        {
           visibility:visible;
        }
    `;
    }
    @property({type: Object}) validateObject: any =null;

    get customValidity() : any{
       return this.validateObject||{
           method:(obj:any) =>true    
       };
    }
    get validity(): boolean {
        return  this.input.checkValidity()&&  this.customValidity.method(this) ;
     }
     public checkValidity() {
        if(this.novalidate||this.disabled||this.form&&this.form.novalidate){
            return true;
        }
        if(this.validity){
            this.pTipCon.show='false';
            this.invalid=false;
            return true;
        } else {
            this.focus();
            this.pTipCon.show='true';
            this.invalid=true;

            if(this.input.validity.valueMissing){
                this.pTipCon.tips = this.input.validationMessage;
            } else {
                if(!this.customValidity.method(this)){
                    this.pTipCon.tips = this.customValidity.tips;
                } else {
                    this.pTipCon.tips = this.errortips||this.input.validationMessage;
                }
            }
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
    }
    get form():HTMLFormElement {
        return this.closest('form,p-form');
    }
     private typePassword() {
       if (this.type === 'password') {
          this.type = 'text';
          window.setTimeout(() =>{
              this.type ='password';
          },1000);
       } 
    }
    clearValue() {
        this.value='';
        this.checkValidity();
    }

     dispatchChange() {
        const changeEvent = new CustomEvent('change', {
            detail: {value: this.input.value}
        });
        this.dispatchEvent(changeEvent);
     }
    updated(_changedProperties: Map<string | number | symbol, unknown>){
        console.log('_changedProperties_changedProperties');
        console.log(_changedProperties);
        if(this.isConnected){
            if(_changedProperties.has('value')&& this.value!==_changedProperties.get('value')){
                console.log('dispatchChange');
                this.dispatchChange( );
            }
        }
        super.updated(_changedProperties);
    }
     dispatchFocus() {
        const changeEvent = new CustomEvent('focus', {
            detail: {value: this.input.value}
        });
        this.dispatchEvent(changeEvent);
        this.checkValidity();
     }
     processInput(event: Event) {
        this.input.dataset.oldInput = this.input.value;
        event.stopPropagation();
        this.checkValidity();
        const inputEvent = new CustomEvent('input', {
            cancelable: true,
            detail: {value: this.input.value}
        });
       if (!this.dispatchEvent(inputEvent)) {
            this.input.value = this.input.dataset.oldInput;
       }
       this.value = this.input.value;
    }
    get pTipCon(): PTips {
        return this.renderRoot.querySelector('#tips');
    }
    private passwordEyeIcon: string = null;
    render() {
        return html` <p-tips  .tips=${this.tips} id="tips"  >
                ${this.leftIcon ? html`<p-icon  name='${this.leftIcon}'  class='leftIcon' ></p-icon>` : ''}
                <input id="input" name="${ifDefined(this.name)}"  placeholder="${ifDefined(this.placeholder)}" .value="${this.value}"  @input="${this.processInput}" @change="${this.dispatchChange}"
                  ?readOnly=${this.readonly}  .type="${this.type}"  ?required=${this.required}  pattern=${ifDefined(this.pattern)}  ?disabled=${this.disabled}
                  step=${this.type==='number'?  1/Math.pow(10,this.scale) : ''}  @focus=${this.dispatchFocus} min=${ifDefined(this.min)} max=${ifDefined(this.max)} 
                   minlength=${ifDefined(this.minLength)}  maxlength=${ifDefined(this.maxLength)}  />
                ${this.type==='password' ? html`<p-icon  name='${ifDefined(this.passwordEyeIcon)}' @click=${this.typePassword}  class='eyeIcon' ></p-icon>` : ''}
                ${this.clear ? html`<p-icon  name='close-circle'  class='clearIcon' @click=${this.clearValue} ></p-icon>` : ''}
                ${this.rightIcon ? html`<p-icon  name='${this.rightIcon}'   class='rightIcon' ></p-icon>` : ''}
            </p-tips>`;
    }
}
