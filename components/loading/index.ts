// tslint:disable-next-line: quotemark
import { LitElement ,customElement,html, css,property} from "lit-element";
import {styleMap} from 'lit-html/directives/style-map';
import PLodingStyle from './style.scss';
const isNumber = function (value:any){
   return typeof value === 'number' && isFinite(value);
};
@customElement('p-loading')
export default class PLoading extends LitElement {

   static  get styles(){
        return PLodingStyle;

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


