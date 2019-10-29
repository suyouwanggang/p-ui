import { css, customElement, html, LitElement, property,  } from 'lit-element';
import  {ifDefined} from 'lit-html/directives/if-defined';
import {getNumberReg} from './helper/util';
import PTips, {} from './p-tips';
 type inputtype= 'text'|'password'|'email'|'url'|'number';


 @customElement('p-input')
export class PInput extends LitElement {
    @property({ type: String, reflect: true }) tips: string ;
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
    @property({ type: Boolean, reflect: true }) required: boolean = false;
    @property({ type: String, reflect: true }) pattern: string = undefined;
    @property({ type: Number, reflect: true }) minLength: number = undefined;
    @property({ type: Number, reflect: true }) maxLength: number = undefined;
    @property({ type: Number, reflect: true }) min: number = undefined;
    @property({ type: Number, reflect: true }) max: number = undefined;
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
    @property({type:Object}) validateMethod:Function=null;
    private _intalInput: HTMLInputElement|any = null;
    get validity(): ValidityState {
        if (this.novalidate) {
            return {
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
        }
        if (this._intalInput == null) {
            this._intalInput = this.input.cloneNode(true);
        }

        this. _intalInput.type = this.type;
        if(this.pattern!=undefined&&this.pattern!=''){
            this._intalInput.pattern= this.pattern;
        }
        if(this.min!=undefined){
            this._intalInput.min = this.min;
        }
        if(this.minLength!=undefined){
            this._intalInput.minLength = this.minLength;
        }
        if(this.maxLength!=undefined){
            this._intalInput.maxLength = this.maxLength;
        }
        this._intalInput.required=this.required;
        if(this.scale!=undefined&&this.scale!=0){
            this._intalInput.step=1/Math.pow(10,this.scale);
        }
        this._intalInput.value=this.value;
        let stat:ValidityState = this._intalInput.validity;
        let validString:string=null;
        if(stat.valid&&this.validateMethod!=null){
            const result:any=this.validateMethod(this);
            if(result!=true){
                stat={
                    badInput: false,
                    customError: true,
                    patternMismatch: false,
                    rangeOverflow: false,
                    rangeUnderflow: false,
                    stepMismatch: false,
                    tooLong: false,
                    tooShort: false,
                    typeMismatch: false,
                    valid: false,
                    valueMissing: false
                }
                validString=result.tips||`custom Error For Metho:${this.validateMethod}`;
            }
        }else{
             validString=this._intalInput.validationMessage;
        }
        this.dataset.validationMessage=validString;
        return stat;
    }
    get validationMessage(){
        this.validity;
        return this.dataset.validationMessage;
    }


    get input(): HTMLInputElement {
        return this.renderRoot.querySelector('#input');
    }

    focus() {
        this.input!.focus();
    }
    reset() {
        this.value = "";
        this.input!.value ='';
        this.invalid = false;
    }
    get form() {
        return this.closest('p-form');
    }
   
     private typePassword() {
       if (this.type == "password") {
           this.type = "text";
           this.fromPassword = true;
       } else {
            this.type = "password";
       }
    }
    clearValue(){
        this.input.value="";
    }
     dispatchChange() {
        const changeEvent = new CustomEvent('change', {
            detail: {value: this.input.value}
        });
        this.dispatchEvent(changeEvent);
     }
     setCustomValidity(validity:string){
        this.dataset.oldTip=this.tips;
        this.tips=validity;
        if(validity!=null&&validity!=''){
            this.invalid=true;
            this.pTipCon.show='true';
            
        }else{
            this.pTipCon.show='false';
        }
     }
     public checkValidity(){
        if(!this.validity.valid){
            const event=new CustomEvent('invalide');
            this.dispatchEvent(event);
        }
     }

     processInput(event: Event) {
         this.input.dataset.oldInput=this.input.value;
        if (this.type =='number'|| this.fromPassword) {
            const regExp = getNumberReg(this.scale);
            const inputValue = this.input.value.replace(regExp,'$1');
            if (inputValue !== this.input.value) {
                this.input.value = inputValue;
            }
        }
        this.setCustomValidity('');
        const inputEvent = new CustomEvent('input', {
            cancelable:true,
            detail: {value: this.input.value}
        });
       if(!this.dispatchEvent(inputEvent)){
            this.input.value=this.input.dataset.oldInput;
       }
        this.value=this.input.value;
        this.checkValidity();
    }
    get pTipCon():PTips{
        return this.renderRoot.querySelector('#tips');
    }
    private passwordEyeIcon: string = null;
    private fromPassword: boolean = false;
    render() {
        if (this.type == 'password' && this.passwordEyeIcon == null ) {
            this.passwordEyeIcon ='eyeclose-fill'; //eye-fill
        }
        return html`
            <p-tips .tips=${this.tips} id="tips" >
                ${this.leftIcon ? html`<p-icon  name='${this.leftIcon}'  class='leftIcon' ></p-icon>` : ''}
                <input id="input" .name="${this.name}"  placeholder="${this.placeholder}" .value="${this.value}"  @input="${this.processInput}" @change="${this.dispatchChange}"
                  ?readOnly=${this.readonly}  .type="${this.type}" ?required=${this.required} pattern=${ifDefined(this.pattern)}  ?disabled=${this.disabled}   />
                ${this.passwordEyeIcon ? html`<p-icon  name='${this.passwordEyeIcon}' @click=${this.typePassword}  class='eyeIcon' ></p-icon>` : ''}
                ${this.clear ? html`<p-icon  name='close-circle'  class='clearIcon' @click=${this.clearValue} ></p-icon>` : ''}
                ${this.rightIcon ? html`<p-icon  name='${this.rightIcon}'   class='rightIcon' ></p-icon>` : ''}
            </p-tips>
        `;
    }
}
