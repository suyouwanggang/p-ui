import {  property,  html,  customElement,  CSSResult,  css,  TemplateResult,  LitElement, eventOptions} from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import { styleMap } from 'lit-html/directives/style-map';
import { customStyle } from '../../decorators/customStyle';
import styleObj from './org-node.scss';
import orgStyleObj from './org.scss';
import  '../../components/icon';
import { nothing } from 'lit-html';
import props from '../../directives/props';
export type OrganiazationNodeType={
  data:{
    roleName?:string;
    userName?:string;
    userImage?:string;
    [key:string]:unknown;
  }
  styleClass?:string;
  collapsible?:boolean;
  expanded?:boolean;
  children?:OrganiazationNodeType[];
  [key:string]:unknown;
}
@customStyle()
@customElement('p-org-node')
export  class POrganizationChartNode extends LitElement{
  static styles: CSSResult = styleObj;
  /**
   * 节点数据
   */
  @property({type:Object})
  data:OrganiazationNodeType;
  /**
   * 节点是否允许收缩
   */
  @property({type:Boolean})
  collapsible:boolean=true;


   /**
   * 节点容器样式
   */
  @property({type:String})
  styleClass:string;

  /**
   * 节点是展开，还是收拢
   */
  @property({type:Boolean})
  expanded:boolean=true;

  
  /**
   * 节点自定义渲染
   */
  @property({type:Object})
  nodeRender:(node:OrganiazationNodeType) =>TemplateResult|TemplateResult[];
  get iconPath(){
    return this.expanded?'M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3c-3.8 5.3-0.1 12.7 6.5 12.7h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z':'M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3 0.1-12.7-6.4-12.7z';
  }
  get _childStyleObj(){
    return {
      display:(this.expanded==false?'none':'')
    }
  }
  render(){
    return html`<table  class='p-organizationchart-table'>
      <tbody>
        ${this.data? 
          html`
          <tr>
            <td colspan=${ifDefined(this.colspan)}>
              <div part='node-content' class='p-organizationchart-node-content ${this.styleClass?this.styleClass:''}'><div  @click=${this.onNodeClick} part='node-content-wrap'>${this.nodeRender(this.data)}</div>
                  ${this.toogleable ?
                  html`
                  <span   class='p-node-toogler' part='toogle' 
                  @click=${this.onToogleNode}>
                    <p-icon part='toogle-icon' .path=${this.iconPath} class='p-node-toggler-icon'></p-icon>
                  </span>`:nothing}
              </div>
            </td>
          </tr>
          ${this._childNodeSize>0?html`
            <tr class='p-organizationchart-lines' style=${styleMap(this._childStyleObj)}>
              <td colspan=${ifDefined(this.colspan)}>
                  <div class='p-organizationchart-line-down'></div>
              </td>
            </tr>
            <tr  class="p-organizationchart-lines"  style=${styleMap(this._childStyleObj)}>
                ${this._childNodeSize==1?
                  html`<td colspan=${this.colspan}>
                          <div class="p-organizationchart-line-down"></div>
                      </td>`:this._renderChildNodeLines()}
            </tr>
              <tr  class='p-organizationchart-nodes' style=${styleMap(this._childStyleObj)}>
                ${this._renderChildNode()}
              </tr>
            `:nothing}
        `:nothing}
      </tbody>
    </table>`;
  }
  onNodeClick(event:Event){
      this._dispatchCustomeEvent('node-click');
  }
  protected _dispatchCustomeEvent(event:string){
    this.dispatchEvent(new CustomEvent(event,{
      bubbles:true,
      detail:{
        node:this.data
      }
    }));
  }
  private onToogleNode(event:Event){
    this.expanded=!this.expanded;
    this.data.expanded=this.expanded;
    this._dispatchCustomeEvent('toogle-node');
  }
  private _renderChildNode(){
    const result=[];
    const child=this.data.children;
    for(let i=0,j=this._childNodeSize;i<j;i++){
      const subNode=child[i];
      result.push(html`<td colspan='2'><p-org-node 
       center=${this.hasAttribute('center')}  .customStyle=${(this as any).customStyle } ..=${props(subNode,'children','data','nodeRender','customStyle')} .nodeRender=${this.nodeRender} .data=${subNode}></p-org-node></td>`);
    }
    return result;
  }
  private _renderChildNodeLines(){
    const result=[];
    for(let i=0,j=this._childNodeSize;i<j;i++){
      result.push(html`<td class="p-organizationchart-line-left ${!(i === 0)?'p-organizationchart-line-top':''}" >&nbsp;</td>
      <td class="p-organizationchart-line-right ${!(i===j-1)?'p-organizationchart-line-top':''} ">&nbsp;</td>`);
    }
    return result;
  }
 
  get leaf(){
    return this._childNodeSize==0;
  }
  get toogleable(){
    return this.collapsible&& !this.leaf;

  }
  get _childNodeSize(){
    return this.data&&this.data.children ? this.data.children.length:0;
  }
  get colspan(){
    return this._childNodeSize>0? this._childNodeSize*2:1;
  }
}
const  defaultRoleRender=(data:OrganiazationNodeType)=>{
    return html`
        <div class='roleName'>${data.data!.roleName}</div>
        ${data.data&&data.data.userImage?
          html`<img class='userImg'>${data.data!.userName}</div>`:nothing}
       <div class='userName'>${data.data!.userName}&nbsp;</div>
      `;
}
@customStyle()
@customElement('p-org-chart')
export default class POrganizationChart extends LitElement {
  static styles: CSSResult = orgStyleObj;
  @property({type:Object})
  data:OrganiazationNodeType;

  @property({type:Boolean,reflect:true})
  center:boolean=true;
  @property({type:Object})
  nodeRender:(node:OrganiazationNodeType) =>TemplateResult|TemplateResult[]=defaultRoleRender;
  render() {
    return html`<div class='p-organizationchart' part='container'>
        ${this.data? html`<p-org-node 
        .data=${this.data}
           ..=${props(this.data,'children','data','nodeRender')} .customStyle=${(this as any).customStyle}
        ?center=${this.center} @node-click=${this._nodeClickHander}  @toogle-node=${this._toogleNodeHander} 
        .nodeRender=${this.nodeRender}></p-org-node>`:null}
    </div>      
    `;
  }
  protected _dispatchCustomeEvent(event:string,node:POrganizationChartNode){
    this.dispatchEvent(new CustomEvent(event,{
      bubbles:true,
      detail:{
        node:node,
        data:node.data
      }
    }));
  }

  private _nodeClickHander(event:Event){
    this._dispatchCustomeEvent('org-node-click',event.target as POrganizationChartNode)
  }

  private _toogleNodeHander(event:Event){
    this._dispatchCustomeEvent('org-node-toogle',event.target as POrganizationChartNode)

  }
}