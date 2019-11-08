import { css, customElement, LitElement, property,html } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import PTips from './p-tips';
import { stringify } from 'querystring';

@customElement('p-radio')
export class PRadio extends LitElement {
    @property({ type: String, reflect: true }) value: string;
    @property({ type: String, reflect: true }) name: string;
    @property({ type: Boolean, reflect: true }) checked: boolean = false;
    @property({ type: Boolean, reflect: true }) disabled: boolean = false;
     static get styles(){
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
        #radio{
            position:absolute;
            clip:rect(0,0,0,0);
        }
        :host(:focus-within) .cheked,:host(:not([disabled])) label:hover .cheked{ 
            border-color:var(--themeColor,#42b983);
            /*box-shadow: 0 0 10px rgba(0,0,0,0.1);*/
            z-index:1;
        }
        :host([disabled]) .cheked{ 
            background:rgba(0,0,0,.1);
        }
        label{
            box-sizing:border-box;
            cursor:pointer;
            display:flex;
            align-items:center;
            outline:0;
        }
        .cheked{
            position:relative;
            box-sizing: border-box;
            width: 16px;
            height: 16px;
            display: flex;
            border-radius:50%;
            border: 1px solid var(--borderColor,rgba(0,0,0,.2));
            transition:.3s;
            margin-right:.5em;
        }
        :host(:empty) .cheked{
            margin-right:0;
        }
        .cheked::before{
            content:'';
            width:8px;
            height:8px;
            margin:auto;
            border-radius:50%;
            background:var(--themeColor,#42b983);
            transform: scale(0);
            transition: .2s cubic-bezier(.12, .4, .29, 1.46) .1s;
        }
        :host([checked]) .cheked::before{
            transform: scale(1);
        }
         `;
     }
     tocheck() {//单选点击永远是选中,只能通过选择其他的来不选中
        const group=this.group;
        const selector = group?`p-radio[checked]`:`p-radio[name="${this.name}"][checked]`;
        const parent:any=group||this.getRootNode();
        const prev = parent.querySelector(selector);
        if( prev){
            prev.checked = false;
        }
        this.checked = true;
    }

    firstUpdated(){
            this.radio.addEventListener('change',(ev:any) =>{
                this.tocheck();
            })
            this.radio.addEventListener('keydown', (ev:KeyboardEvent) => {
                switch (ev.keyCode) {
                    case 13://Enter
                        ev.stopPropagation();
                        this.tocheck();
                        break;
                    default:
                        break;
                }
            })
    }
   

    render(){
        return html`
           <input type="checkbox" ?checked=${this.checked}  ?disabled=${this.disabled} id="radio" /><label id="label" for="radio"><span class="cheked"></span><slot></slot></label>
        `;
    }

    get group(){
        return this.closest('p-radio-group');
    }
    get radio():any{
        return this.renderRoot.querySelector("#radio");
    }
    get form(): HTMLFormElement {
        return this.closest('p-form, form');
    }
    focus() {
        this.radio.focus();
    }
}


@customElement('p-radio-group')
export class PRadioGroup extends LitElement {

    static get styles(){
        return css`:host {
            display:inline-block;
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
        ::slotted(p-radio){
            transition: opacity .3s;
        }
        :host([disabled]) ::slotted(p-radio){
            pointer-events: none;
            opacity:.6;
        }
        p-tips[show='true']{
            --themeColor:var(--errorColor,#f4615c);
            --borderColor:var(--errorColor,#f4615c);
        }`;
    }
    @property({ type: String, reflect: true }) name: string;
    @property({ type: String, reflect: true }) value: string;
    @property({ type: Boolean, reflect: true }) disabled: boolean = false;
    @property({ type: Boolean, reflect: true }) novalidate: boolean = false;
    @property({ type: Boolean, reflect: true }) invalid: boolean = false;
    @property({ type: Boolean, reflect: true }) required: boolean = false;

    render(){
        return html`<p-tips id="tip"  type="error"><slot id='slot'></slot></p-tips>`;
    }
    attributeChangedCallback (name: string, old: string, value: string) {
        super.attributeChangedCallback(name,old,value);
    }

    update(changedProperties: Map<string | number | symbol, unknown>){
        super.update(changedProperties);
        if(this.elements&&changedProperties.has('value')&& this.value !==changedProperties.get('value')){
            let value=this.value;
            this.elements.forEach((el:any)=>{
                if(el.value==value){
                    el.checked=true;
                }else{
                    el.checked=false;
                }
            })
            console.log('change');
            this.dispatchEvent(new CustomEvent('change',{
                detail:{
                    value:this.value
                }
            }))
        }
    }
    firstUpdated(){
        const slots=this.shadowRoot.querySelector('#slot');
        if(slots){
            slots.addEventListener('slotchange',()=>{
                this.elements.forEach( (el :PRadio) =>{
                    el.radio.addEventListener('change',(ev:Event) =>{
                        this.value=el.value;
                        this.checkValidity();
                        
                    });
                })
            });
        }
    }
    
   
    get validity(){
        return this.value!=''&&this.value!==undefined;
    }
   

    get elements():any{
        return this.querySelectorAll('p-radio');
    }
    get form():HTMLFormElement{
        return this.closest('p-form,form');
    }
    get tip():PTips{
        return this.renderRoot.querySelector('#tip');
    }
    checkValidity(){
        if(this.novalidate||this.disabled||this.form&&this.form.novalidate){
            return true;
        }
        if(this.validity){
            this.tip.show = 'false';
            this.invalid = false;
            return true;
        }else{
            this.focus();
            this.tip.show = 'true';
            this.invalid = true;
            this.tip.tips='请选择1项';
            return false;
        }
    }
    
   
}