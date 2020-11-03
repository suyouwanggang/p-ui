import {  property,  html,  customElement,  CSSResult,  css,  TemplateResult,  LitElement} from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import { styleMap } from 'lit-html/directives/style-map';
import { customStyle } from '../../decorators/customStyle';
import styleObj from './organization-chart.scss';
import  '../../components/icon';
export type OrganiazationNodeType={
  data?:any;
  styleClass?:string;
  collapsible?:boolean;
  leaf?:boolean;
  [key:string]:unknown;
  children?:OrganiazationNodeType[];
}
@customStyle()
@customElement('p-org-node')
export  class POrganizationChartNode extends LitElement{
  static styles: CSSResult = styleObj;
  @property({type:Object})
  node:OrganiazationNodeType;
  @property({type:Boolean})
  collapsible:boolean;
  @property({type:Boolean})
  expanded:boolean;
  @property({type:Boolean})
  selected:boolean;
  @property({type:Object})
  nodeRender:(node:OrganiazationNodeType) =>TemplateResult|TemplateResult[];
  get iconPath(){
    return this.node.collapsible?'M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3c-3.8 5.3-0.1 12.7 6.5 12.7h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z':'M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3 0.1-12.7-6.4-12.7z';
  }
  render(){
    return html`<table class='p-organizationchart-table'>
      <tbody>
        ${this.node? 
          html`
          <tr>
            <td colspan=${ifDefined(this.colspan)}>
              <div class='p-organizationchart-node-content ${this.node.styleClass?this.node.styleClass:''}' @click=${this.onNodeClick}>
                  <slot>${this.nodeRender(this.node)}</slot>
                  <a tabindex="0"  class='p-node-toogler' 
                  @click=${this.onToogleNode} @keydown=${this.keyToogleNode}>
                    <p-icon .path=${this.iconPath} class='p-node-toggler-icon'></p-icon>
                  </a>
              </div>
            </td>
          </tr>
          <tr class='p-organizationchart-lines' style=${styleMap(this._childStyle)}>
            <td colspan=${ifDefined(this.colspan)}>
                <div class='p-organizationchart-line-down'></div>
            </td>
          </tr>
          <tr  class="p-organizationchart-lines" style=${styleMap(this._childStyle)} >
              ${this._childNodeSize==1?
                html` <td colspan=${this.colspan}>
                        <div class="p-organizationchart-line-down"></div>
                    </td>`:this._renderChildNodeLines()}
          </tr>

            <tr style=${styleMap(this._childStyle)} class='p-organizationchart-nodes'>
               ${this._renderChildNode()}
            </tr>
        `:null}
      </tbody>
    </table>`;
  }
  private _renderChildNode(){
    const result=[];
    for(let i=0,j=this._childNodeSize;i<j;i++){
      const subNode=this.node.children[i];
      result.push(
        html`<td colspan='2'>
           <p-org-node .nodeRender=${this.nodeRender} .node=${subNode}></p-org-node>
        </td>`
      );
    }
    return result;
  }
  private _renderChildNodeLines(){
    const result=[];
    for(let i=0,j=this._childNodeSize;i<j;i++){
      result.push( html`<td class="p-organizationchart-line-left ${!(i === 0)?'p-organizationchart-line-top':''}" >&nbsp;</td>
      <td class="p-organizationchart-line-right ${!(i===j-1)?'p-organizationchart-line-top':''} ">&nbsp;</td>`);
    }
    return result;
  }
  get _childStyle() {
    return {
      visibility: this.leaf ? 'hidden':'visiable'
    }
  }
  get leaf(){
    return this.node.leaf === false ? false : !(this.node.children && this.node.children.length);
  }
  get toogleable(){
    return this.collapsible && this.node.collapsible !== false && !this.leaf;

  }
  get _childNodeSize(){
    return this.node.children ? this.node.children.length:0;
  }
  get colspan(){
    return this._childNodeSize==0? this._childNodeSize*2:1;
  }
  
  onNodeClick(event:Event){

  }
  onToogleNode(event:Event){

  }
  keyToogleNode(event:KeyboardEvent){

  }
}
const  chartRender=(node:OrganiazationNodeType)=>{
    return html`<div>${node.data}</div>`;
}
@customElement('p-org-chart')
export default class POrganizationChart extends LitElement {

  createRenderRoot(){
    return this;
  }
  @property({type:Object})
  node:OrganiazationNodeType;

  @property({type:Object})
  nodeRender:(node:OrganiazationNodeType) =>TemplateResult|TemplateResult[]=chartRender;
  render() {
    return html`<div class='p-organizationchart'>
        ${this.node? html`<p-org-node .node=${this.node}  .nodeRender=${this.nodeRender}></p-org-node>`:null}
    </div>      
    `;
  }
}