import {  property,  html,  customElement,  CSSResult,  css,  TemplateResult,  LitElement, eventOptions, internalProperty, query, queryAll, PropertyValues} from 'lit-element';
import { customStyle } from '../../decorators/customStyle';
import {classMap} from 'lit-html/directives/class-map';
import orgStyleObj from './org.scss';
import props from '../../directives/props';
export type OrganiazationNodeType={
  /**
   * 内置组织架构图数据
   */
  data:any;
  styleClass?:string;
  /**
   * 是否允许收缩
   */
  collapsible?:boolean;
  /**
   * 是否是展开
   */
  expanded?:boolean;
  children?:OrganiazationNodeType[];
  [key:string]:unknown;
}
const  defaultRoleRender=(data:OrganiazationNodeType)=>{
  return html`${JSON.stringify(data.data)}`;
}

@customElement('p-org-node')
export  class POrganizationChartNode extends LitElement{
  
  
  /**
   * 节点数据
   */
  @property({type:Object})
  data:OrganiazationNodeType;
  /**
   * 节点是否允许收缩
   */
  @property({type:Boolean,attribute:true})
  collapsable:boolean=true;


   /**
   * 组织架构节点自定义样式
   */
  @property({type:String})
  styleClass:string;

  /**
   * 节点是展开，还是收拢，默认是展开
   */
  @property({type:Boolean})
  expanded:boolean=true;
 
  createRenderRoot(){
    return this;
  }
  update(changeProperties:PropertyValues){
    super.update(changeProperties);
    if(changeProperties.has('expanded')){
      if(this.expanded){
        this.classList.remove('collapsed');
      }else{
        this.classList.add('collapsed');
      }
    }
  }

  /**
   * 节点自定义渲染
   */
  @property({type:Object})
  nodeRender:(node:OrganiazationNodeType) =>TemplateResult|TemplateResult[];
  
 
  render(){
    const isLeaf=this.isLeaf;
    return html`
        <div class='org-tree-node-label ' part='org-tree-node-label'>
          <div  class='org-tree-node-label-inner ${this.styleClass?this.styleClass:''}' @click=${this.onNodeClick}>${this.nodeRender(this.data)}
            ${!isLeaf&&this.collapsable ?html`<span class="org-tree-node-btn ${this.expanded?'expanded':''}"  @click=${this.onToogleNode}></span>`:''}
          </div>
        </div>
        ${!isLeaf&&this.expanded?html`<div class='org-tree-node-children' >${this._renderChildNode()}</div>`:''}
  `;
  }
  onNodeClick(event:Event){
      this._dispatchCustomeEvent('click-node');
  }
  protected _dispatchCustomeEvent(eventName:string){
    this.dispatchEvent(new CustomEvent(eventName,{
      bubbles:true,
      detail:{
        data:this.data,
      }
    }));
  }
  private onToogleNode(event:Event){
    event.stopPropagation();
    this.expanded=!this.expanded;
    this.data.expanded=this.expanded;
    this._dispatchCustomeEvent('toogle-node');
  }
  private _renderChildNode(){
    const result=[];
    if(this.data.children){
      const child=this.data.children;
      for(let i=0,j=child.length;i<j;i++){
        const subNode=child[i];
        const classObj={
          'is-leaf':(!(subNode.children&&subNode.children.length>0))
        };
        result.push(html`<p-org-node class='org-tree-node ${classMap(classObj)}'
        .customStyle=${(this as any).customStyle } 
        ..=${props(subNode,'children','data','nodeRender','customStyle')} 
        .nodeRender=${this.nodeRender} .data=${subNode}></p-org-node>`);
      }
    }
    return result;
  }
 
  get tree(){
    return this.closest('p-org-tree');
  }
  @queryAll('p-org-node')
  subOrgNodes:POrganizationChartNode[];
  
  get isLeaf(){
    return this._childNodeSize==0;
  }
  get _childNodeSize(){
    return this.data&&this.data.children ? this.data.children.length:0;
  }
}
@customStyle()
@customElement('p-org-tree')
export default class POrganizationTree extends LitElement {
  static styles: CSSResult[] = [orgStyleObj];
  @property({type:Object})
  data:OrganiazationNodeType;

  @property({type:Boolean,reflect:true})
  center:boolean=true;
  @property({type:Boolean,reflect:true})
  horizontal:boolean=false;
  @property({type:Object})
  nodeRender:(node:OrganiazationNodeType) =>TemplateResult|TemplateResult[]=defaultRoleRender;
  render() {
    const tree:POrganizationTree=this;
    return html`<div class='org-tree-container ' part='container'   >
        <div class='org-tree collapsable ${this.horizontal?'horizontal':''}' part='tree'>
          ${this.data? html`<p-org-node id='node'  class='org-tree-node' .style=${this.horizontal?'display:table':''}
            .data=${this.data}
            ..=${props(this.data,'children','data','nodeRender')} 
          .nodeRender=${this.nodeRender}
          @click-node=${this.handNodeEvent}
          @toogle-node=${this.handNodeEvent}
          ></p-org-node>`:null} 
        </div>
    </div>      
    `;
  }
  @query('#node',true)
  rootNode:POrganizationChartNode;
  private handNodeEvent(event:CustomEvent ){
    //console.log(event,event.detail);
    const node=event.target as  POrganizationChartNode;
    this.dispatchEvent(new CustomEvent(`tree-${event.type}`,{
      bubbles:true,
      detail:{
       node:node,
       data:node.data
      }
    }))
  }
 
}