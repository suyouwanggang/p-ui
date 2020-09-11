
import { LitElement, html, customElement, property, TemplateResult ,css} from 'lit-element'
const cache = new WeakMap<Array<String>, any>();
const createTemplate = (template: string, value: string = 'value', index: string = 'index') =>{
    const str = 'return html`'+template +'`;';
    const key = [];
    key.push(template);
    key.push(value);
    key.push(index);
    let f: any = cache.get(key);
    if (f == null || f === undefined) {
        f = new Function(value, index, str);
        cache.set(key, f);
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
        .container{
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
        return html`
        <div class='container' ><template><slot id="template" name="template"></slot></template>
        <slot></slot></div>`;
    }
    get templateHTML(){
       const templateSlot:HTMLSlotElement= this.renderRoot.querySelector("#template");
       const element:Element[]= templateSlot.assignedElements({flatten:true});
       return element.join('');
    }
    renderSubItem() {
       if(this.items){
           const templateHTML=this.templateHTML;
           const templatFun=createTemplate(templateHTML,this.value,this.index);
           const htmlArray:TemplateResult[]=[];
           this.items.forEach( (item:Object,index:number) =>{
                htmlArray.push(templatFun(item,index));
           });
           const frag=document.createDocumentFragment();
           while(this.firstElementChild){
               if((this.firstElementChild as any).isCreateBy==this){
                   this.removeChild(this.firstElementChild);
               }else{
                 frag.appendChild(this.firstElementChild);
               }
           }
           (this.constructor as typeof LitElement)
          .render(
            htmlArray,
              this,
              {scopeName: this.localName, eventContext: this});
            for(let i=0,j=this.children.length;i<j;i++){
                (this.children[i] as any).isCreateBy=this;
            }
            if(this.firstElementChild){
                this.insertBefore(frag,this.firstElementChild);
            }else{
                this.appendChild(frag);
            }
       }
    }
    update(changedProperties: Map<string | number | symbol, unknown>) {
        super.update(changedProperties);
        if(this.isConnected&&changedProperties.size>0){
            this.renderSubItem();
        }
      
    }


}
