
import { LitElement, html, customElement, property, TemplateResult ,css} from 'lit-element'
import { Ppop } from './p-pop';
const cache = new Map<String,any>();
type functionTemplate={
    (item:any,index:number):unknown
}
const createTemplate = (template: string, value: string = 'value', index: string = 'index') :functionTemplate=>{
    const str = 'return LitHelper.html`'+template +'`;';
    const key = `${template}_${value}_${index}`;
    let f: any = cache.get(key);
    if (f == null || f === undefined) {
        f = new Function(value, index, str);
        cache.set(key, f);
        console.log(`template=${str}`);
    }
    return f;
}

function isObject(val: any) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
}
@customElement('p-for')
export class PFor extends LitElement {
    @property({ type: Array, reflect: true, attribute: false }) items: Array<Object> = undefined;
    @property({ type: String, reflect: true }) value: string = 'value';
    @property({ type: String, reflect: true }) index: string = 'index';
   
    static styles =css`
        :host{
            display:content;
        }
    `
    ;
    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(_changedProperties);
        this.renderSubItem();
    }
    constructor() {
        super();
    }
    
    render() {
        return html`<slot></slot>`;
    }
    private _oldTemplate:string=null;
    get templateHTML(){
      if(this._oldTemplate==null){
        const template:HTMLTemplateElement= this.querySelector("template");
        if(template){
            this._oldTemplate= template.innerHTML;
            return this._oldTemplate;
        }
      }
      return this._oldTemplate;
    }
    renderSubItem() {
        const templateHTML=this.templateHTML;
        const render=LitElement.render;
       if(this.items&&templateHTML){
           while(this.firstElementChild){
               this.removeChild(this.firstElementChild);
           }
           const templateFun=createTemplate(templateHTML,this.value,this.index);
           const htmlArray=document.createDocumentFragment();
           this.items.forEach( (item:Object,index:number) =>{
               let temp=document.createDocumentFragment();
               render(templateFun(item,index),temp ,{scopeName:this.localName});
               htmlArray.appendChild(temp);
           });
           this.appendChild(htmlArray);
       }
    }
    update(changedProperties: Map<string | number | symbol, unknown>) {
        super.update(changedProperties);
        if(this.isConnected&&changedProperties.size>0){
            this.renderSubItem();
        }
    }
}
