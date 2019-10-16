import { LitElement, css, customElement, html, property } from 'lit-element';
 type inputtype='text'|'passoword'|'email'|'url'|'number';
 @customElement('p-input')
export class PInput extends LitElement {
    protected form:Element;
    @property({ type: String, reflect: true }) name: string = "";
    @property({ type: String, reflect: true }) type: inputtype = "text";
    @property({ type: String, reflect: true }) pattern:string=null;
    @property({ type: String, reflect: false }) placeholder: string = "";
    @property({ type: String, reflect: false }) value: string = "";
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
            font-size: 14px;
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
            padding: 0;
            padding:  .25em .625em;
            margin:val(--input-margin,0);
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
    `;
    }
    
    protected input:HTMLInputElement=null;
    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>){
        super.firstUpdated(_changedProperties);
        this.input=this.shadowRoot.querySelector("input");
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
    connectedCallback(){
       super.connectedCallback();
        this.form=this.closest("form,p-form");
    }
    checkValidity(){
        if(this.novalidate||this.disabled||this.form&& ((this.form as any).novalidate)){
            return true;
        }
        if(this.validity){
            this.invalid = false;
            return true;
        }else{
            this.focus();
            this.invalid = true;
            return false;
        }
    }

    render() {
        return html`
            <div  ?disabled=${this.disabled}>
                <input id="input" .name="${this.name}"  placeholder="${this.placeholder}" value="${this.value}"
                  ?readOnly=${this.readonly}  type="${this.type}" ?required=${this.required} pattern=${this.pattern}  ?disabled=${this.disabled}   />
            </div>
        `;
    }
}
