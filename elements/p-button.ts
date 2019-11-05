// tslint:disable-next-line: quotemark
import { LitElement ,customElement,html, css,property, TemplateResult} from "lit-element";
import  {} from './p-icon';
import {ifDefined} from 'lit-html/directives/if-defined';
type targetType="_blank" | "_parent" | "_self" | "_top";
type typeType="circle" | "primary" | "danger" | "flat"|'dashed';

@customElement('p-button')
export default class PButton extends LitElement {

   static  get styles(){
        return css`
          :host{ 
            position:relative; 
            display:inline-flex; 
            padding: .25em .625em;
            box-sizing:border-box; 
            vertical-align: middle;
            line-height: 1.8;
            overflow:hidden; 
            align-items:center;
            justify-content: center;
            border:1px solid var(--borderColor,rgba(0,0,0,.2)); 
            font-size: 14px; 
            color: var(--fontColor,#333);  
            border-radius: var(--borderRadius,.25em); 
            transition:background .3s,box-shadow .3s,border-color .3s,color .3s;
        }
        :host([type="circle"]){ 
            border-radius:50%; 
        }
        :host(:not([disabled]):active){
            z-index:1;
            transform:translateY(.1em);
        }
        :host([disabled]),:host([loading]){
            pointer-events: none; 
            opacity:.6; 
        }
        :host([block]){ 
            display:flex; 
        }
        :host([disabled]:not([type])){ 
            background:rgba(0,0,0,.1); 
        }
        :host([disabled]) .btn,:host([loading]) .btn{ 
            cursor: not-allowed; 
            pointer-events: all; 
        }
        :host(:not([type="primary"]):not([type="danger"]):not([disabled]):hover),
        :host(:not([type="primary"]):not([type="danger"]):focus-within),
        :host([type="flat"][focus]){ 
            color:var(--themeColor,#42b983); 
            border-color: var(--themeColor,#42b983); 
        }
        :host(:not([type="primary"]):not([type="danger"])) .btn::after{ 
            background-image: radial-gradient(circle, var(--themeColor,#42b983) 10%, transparent 10.01%); 
        }
        :host([type="primary"]){ 
            color: #fff; 
            background:var(--themeBackground,var(--themeColor,#42b983));
        }
        :host([type="danger"]){ 
            color: #fff; 
            background:var(--themeBackground,var(--dangerColor,#ff7875));
        }
        :host([type="dashed"]){ 
            border-style:dashed 
        }
        :host([type="flat"]),:host([type="primary"]),:host([type="danger"]){ 
            border:0;
            padding: calc( .25em + 1px ) calc( .625em + 1px );
        }
        :host([type="flat"]) .btn::before{ 
            content:''; 
            position:absolute; 
            background:var(--themeColor,#42b983);
            pointer-events:none; 
            left:0; 
            right:0; 
            top:0; 
            bottom:0; 
            opacity:0; 
            transition:.3s;
        }
        :host([type="flat"]:not([disabled]):hover) .btn::before{ 
            opacity:.1 
        }
        :host(:not([disabled]):hover){ 
            z-index:1 
        }
        :host([type="flat"]:focus-within) .btn:before,
        :host([type="flat"][focus]) .btn:before{ 
            opacity:.2; 
        }

        .btn{ 
            background:none; 
            outline:0; 
            border:0; 
            position: 
            absolute; 
            left:0; 
            top:0;
            width:100%;
            height:100%;
            padding:0;
            user-select: none;
            cursor: unset;
        }
        p-loading{ 
            margin-right: 0.35em;  
        }
        ::-moz-focus-inner{
            border:0;
        }
        .btn::after {
            content: "";
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            left: var(--x,0); 
            top: var(--y,0);
            pointer-events: none;
            background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
            background-repeat: no-repeat;
            background-position: 50%;
            transform: translate(-50%,-50%) scale(10);
            opacity: 0;
            transition: transform .3s, opacity .8s;
        }
        .btn:not([disabled]):active::after {
            transform: translate(-50%,-50%) scale(0);
            opacity: .3;
            transition: 0s;
        }
        p-icon{
            margin-right: 0.35em;
            transition: none;
        }
        :host(:empty) xy-icon{
            margin: auto;
        }
        :host(:empty){
            padding: .65em;
        }
        :host([type="flat"]:empty),:host([type="primary"]:empty){ 
            padding: calc( .65em + 1px );
        }
        ::slotted(p-icon){
            transition: none;
        }
        :host([href]){
            cursor:pointer;
        }
        `;

    }
    @property({ type: Boolean }) disabled:boolean;
    @property({ type: Boolean }) toggle:boolean;
    @property({ type: String ,reflect:true }) type:typeType;
    
    @property({ type: String,reflect:true }) htmltype:string;
    @property({ type: String,reflect:true }) shape:string;
    @property({ type: String,reflect:true }) name:string;
    @property({ type: Boolean,reflect:true }) checked:boolean;
    @property({ type: Boolean,reflect:true }) loading:boolean=false;
    @property({ type: String,reflect:true }) href:string;
    @property({ type: String,reflect:false }) target:targetType='_blank';
    @property({ type: String,reflect:true }) rel:string;
    @property({ type: String,reflect:true }) download:string;
    @property({ type: String,reflect:true }) icon:string;

    firstUpdated(){
        this.btn.addEventListener('mousedown', (ev:MouseEvent) =>{
            if(!this.disabled){
                const { left, top } = this.getBoundingClientRect();
                this.style.setProperty('--x',(ev.clientX - left)+'px');
                this.style.setProperty('--y',(ev.clientY - top)+'px');
            }
        });
        this.addEventListener('click',(ev:Event) =>{
            if(this.toggle){
                this.checked=!this.checked;
            }
        })
        this.btn.addEventListener('keydown',(ev:KeyboardEvent) => {
            switch (ev.keyCode) {
                case 13://Enter
                    ev.stopPropagation();
                    break;
                default:
                    break;
            }
        });
    }
    render(){
        
          let renderIcon:TemplateResult;
          if(!this.loading && this.icon && this.icon!=null) {
              renderIcon=html`<p-icon id='icon' .name='${this.icon}'> </p-icon>`;
          }
        return html`${this.href ? 
                html`<a id='btn' class='btn' download=${ifDefined(this.download)} href='${ifDefined(this.href)}' target=${ifDefined(this.target)}></a>`:
                html`<button id='btn'   class='btn'></button>`}
             ${renderIcon} <slot></slot>`;
    }
    
     get iconEl(){
        return this.renderRoot.querySelector("#icon");
    }
   
    get btn(){
        return this.renderRoot.querySelector("#btn");
    }
   
}


