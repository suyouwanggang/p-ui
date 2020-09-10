// tslint:disable-next-line: quotemark
import { LitElement ,customElement,html, css,property} from "lit-element";
import {styleMap} from 'lit-html/directives/style-map';
const isNumber = function (value:any){
   return typeof value === 'number' && isFinite(value);
};
@customElement('p-loading')
export default class PLoading extends LitElement {

   static  get styles(){
        return css`
         :host{
            font-size:inherit;
            display:inline-flex;
            align-items: center;
            justify-content:center;
        }
        .loading{
            display: block;
            margin: auto;
            width: 1em;
            height: 1em;
            color:var(--themeColor,#42b983);
            animation: rotate 1.4s linear infinite;
        }
        .circle {
            stroke: currentColor;
            animation:  progress 1.4s ease-in-out infinite;
            stroke-dasharray: 80px, 200px;
            stroke-dashoffset: 0px;
            transition:.3s;
        }
        :host(:not(:empty)) .loading{
            margin-right:.5em;
        }
        @keyframes rotate{
            to{
                transform: rotate(360deg); 
            }
        }
        @keyframes progress {
            0% {
              stroke-dasharray: 1px, 200px;
              stroke-dashoffset: 0px; 
            }
            50% {
              stroke-dasharray: 100px, 200px;
              stroke-dashoffset: -15px; 
            }
            100% {
              stroke-dasharray: 100px, 200px;
              stroke-dashoffset: -125px; 
            } 
        }
        `;

    }
    @property({ type: String, }) size:string;
    @property({ type: String }) color:string;
    
    render(){
        const styleObj:any={};
        if(this.color!=undefined){
            styleObj['color']=this.color;
        }
        if(this.size!=undefined){
            styleObj['font-size']=this.size+(isNumber(this.size)?'px':'');
        }
        return html`<svg class="loading" style="${styleMap(styleObj)}" id="loading" viewBox="22 22 44 44"><circle class="circle" cx="44" cy="44" r="20.2" fill="none" stroke-width="3.6"></circle></svg>
        <slot></slot>
        `;
    }
    get loadingEl(){
        return this.shadowRoot.getElementById('loading');
    }
}


