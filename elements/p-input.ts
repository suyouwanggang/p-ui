import { css, customElement, html, LitElement, property,  } from 'lit-element';
import  {ifDefined} from 'lit-html/directives/if-defined';
import {getNumberReg} from './helper/util';
 type inputtype='text'|'password'|'email'|'url'|'number';

 @customElement('p-input')
export class PInput extends LitElement {
     
    @property({ type: String, reflect: false }) name: string = '';
    @property({ type: String, reflect: true }) type: inputtype = 'text';
    @property({ type: String, reflect: false }) pattern: string= undefined;
    @property({ type: String, reflect: false }) placeholder: string = '';
    @property({ type: String, reflect: false }) value: string = '';
    @property({ type: String, reflect: false }) leftIcon: string = '';
    @property({ type: String, reflect: false }) rightIcon: string = '';
    @property({ type: Boolean, reflect: true }) block: boolean = false;
    @property({ type: Boolean, reflect: true }) disabled: boolean = false;
    @property({ type: Boolean, reflect: true }) readonly: boolean = false;
    @property({ type: Boolean, reflect: true }) search: boolean = false;
    @property({ type: Boolean, reflect: true }) clear: boolean = false;
    @property({ type: Boolean, reflect: true }) novalidate: boolean = false;
    @property({ type: Boolean, reflect: true }) required: boolean = false;
    @property({ type: Boolean, reflect: true }) invalid: boolean = false;
    @property({ type: Number, reflect: false }) scale: number = 0;


    static get styles(){
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
        div{
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
        div>input{
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
    get input():HTMLInputElement{
        return this.shadowRoot.querySelector('#input');
    }
    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>){
        super.firstUpdated(_changedProperties);
    }
    focus(){
        this.input!.focus();
    }
    reset(){
        this.value="";
        this.input!.value="";
        this.invalid=false;
    }
    @property({ type: Object }) customValidity: any;
    
    get validity(){
        return this.input.checkValidity()&&this.customValidity!.method(this);
    }
    get form(){
        return this.closest('p-form');
    }
    checkValidity(){
        if(this.novalidate||this.disabled||this.form&& ((this.form as any).novalidate)){
            return true;
        }
        if(this.validity){
            this.invalid = false;
            return true;
        } else {
            this.focus();
            this.invalid = true;
            return false;
        }
    }
     clearValue(){
        this.value="";
        this.requestUpdate();
    }
     private typePassword(){
       if(this.type=="password"){
           this.type="text";
           this.fromPassword=true;
       }else{
            this.type="password";
       }
    }
    
     dispatchChange(){
        let changeEvent=new CustomEvent("change",{
            detail:{value:this.input.value}
        });
        this.dispatchEvent(changeEvent);
     }
    asyncValue(event:any){
        if(this.type=="number"||this.fromPassword){
            let regExp=getNumberReg(this.scale);
            let inputValue=this.input.value.replace(regExp,"$1");
            if(inputValue!=this.input.value){
                this.input.value=inputValue;
            }
        }
        this.value=this.input.value;
        let inputEvent=new CustomEvent("input",{
            detail:{value:this.input.value}
        });
        this.dispatchEvent(inputEvent );
    }

    private passwordEyeIcon:string=null;
    private fromPassword:boolean=false;
    render() {
        if(this.type=='password'&&this.passwordEyeIcon==null ){
            this.passwordEyeIcon="eyeclose-fill"; //eye-fill
        }
        return html`
            <div>
                <!--${this.type=='number'|| this.type=='password'||this.fromPassword ?html`<p-icon  name='${this.type=='number'?'creditcard':'lock'}'  class='leftIcon' ></p-icon>`:''}-->
                ${this.leftIcon?html`<p-icon  name='${this.leftIcon}'  class='leftIcon' ></p-icon>`:''}
                <input id="input" .name="${this.name}"  placeholder="${this.placeholder}" .value="${this.value}"  @input="${this.asyncValue}" @change="${this.dispatchChange}"
                  ?readOnly=${this.readonly}  .type="${this.type}" ?required=${this.required} pattern=${ifDefined(this.pattern)}  ?disabled=${this.disabled}   />
                ${this.passwordEyeIcon ?html`<p-icon  name='${this.passwordEyeIcon}' @click=${this.typePassword}  class='eyeIcon' ></p-icon>`:''}
                ${this.clear?html`<p-icon  name='close-circle'  class='clearIcon' @click=${this.clearValue} ></p-icon>`:''}
                ${this.rightIcon?html`<p-icon  name='${this.rightIcon}'   class='rightIcon' ></p-icon>`:''}
            </div>
        `;
    }
    
}
