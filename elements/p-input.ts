import { css, customElement, html, LitElement, property } from 'lit-element';
import {styleMap, StyleInfo} from 'lit-html/directives/style-map';
import  {ifDefined} from 'lit-html/directives/if-defined';
import {classMap} from 'lit-html/directives/class-map';
 type inputtype='text'|'password'|'email'|'url'|'number';
 @customElement('p-input')
export class PInput extends LitElement {
   
    @property({ type: String, reflect: false }) name: string = '';
    @property({ type: String, reflect: true }) type: inputtype = 'text';
    @property({ type: String, reflect: false }) pattern: string= null;
    @property({ type: String, reflect: false }) placeholder: string = '';
    @property({ type: String, reflect: false }) value: string = '';
    @property({ type: String, reflect: false }) leftIcon: string = '';
    @property({ type: String, reflect: false }) rightIcon: string = '';
    @property({ type: Boolean, reflect: true }) block: boolean = false;
    @property({ type: Boolean, reflect: true }) disabled: boolean = false;
    @property({ type: Boolean, reflect: true }) readonly: boolean = false;
    @property({ type: Boolean, reflect: true }) novalidate: boolean = false;
    @property({ type: Boolean, reflect: true }) required: boolean = false;
    @property({ type: Boolean, reflect: true }) invalid: boolean = false;


    static get styles(){
       return  css `
        :host{
            display:inline-block;
            height:1.8em;
            border:1px solid var(--borderColor,rgba(0,0,0,.2));
            border-radius:var(--borderRadius,.25em);
            transition:border-color .3s,box-shadow .3s; 
            color: var(--fontColor,#333);
        }
        :host([block]){
            display:block;
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
            cursor:pointer;
        }
        div[disabled]{
            cursor:not-allowed;
            pointer-events:all;
            opacity:var(--disabled-opaticity,0.4)
       }


        div[disabled]>input{
            cursor:not-allowed;
            pointer-events:none;
            opacity:var(--disabled-opaticity,0.4)
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
        }
        
        p-icon{
            display: flex;
            font-size:1.2em;
            margin-left: 4px;
            color: #999;
        }
        .rightIcon{
            margin-right:4px;
        }
        div:active .leftIcon{
            color:var(--themeColor,#42b983);
        }
        :host(:focus-within:not([disabled])) .leftIcon,
        :host(:not([disabled]):hover) .icon-pre,:host(:not([disabled]):hover) .input-label,:host(:focus-within:not([disabled])) .input-label{
            color:var(--themeColor,#42b983);
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
        this.input!.value="";
        this.invalid=false;
    }
    @property({ type: Object }) customValidity: any;
    
    get validity(){
        return this.input.checkValidity()&&this.customValidity.method(this);
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

    render() {
        let lefticonValue = this.leftIcon;
        let rightticonValue = this.rightIcon;
        if(!lefticonValue){
            const type = this.type;
            if(type ==='number'){
                lefticonValue = 'creditcard';
            } else if(type ==='password') {
                lefticonValue = "lock";
            }
        }
        if(!rightticonValue){
            const type = this.type;
            if(type ==='number'){
                rightticonValue = 'creditcard';
            } else if(type ==='password') {
                rightticonValue = "lock";
            }
        }
        
        // lefticonValue='search';
        const iconStyle:any= {};
        if(!lefticonValue){
            iconStyle['display']='none';
        }
        return html`
            <div  ?disabled=${this.disabled} >
                 <p-icon style=${styleMap(iconStyle)} name=${lefticonValue}  class='leftIcon' ></p-icon>
                <input id="input" .name="${this.name}"  placeholder="${this.placeholder}" value="${this.value}"
                  ?readOnly=${this.readonly}  type="${this.type}" ?required=${this.required} pattern=${ifDefined(this.pattern)}  ?disabled=${this.disabled}   ></input>
                  <p-icon style=${styleMap(iconStyle)} name=${rightticonValue}  class="rightIcon" ></p-icon>
            </div>
        `;
    }
    renderIcon(name:string, className:string){
        return html`<p-icon style=${!name?'display:none':''} name=${name}  class="${className}" ></p-icon>`;
    }
}
