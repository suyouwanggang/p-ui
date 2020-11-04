import { customElement, html, internalProperty, LitElement, property, TemplateResult } from 'lit-element';
import { nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import '../icon';
import PLoading from '../loading';
import TreeStyleObj from './tree.scss';
import { defaultFilter, filterTreeData, findDataByKey, toJSONTreeData, TreeFilter, TreeNodeData } from './treeFillter';
import TreeNodeStyle from './treeNode.scss';


export interface TreeNodeRender {
    (data: PTreeNode): TemplateResult;
}
/* 默认渲染节点 template*/
const defaultNodeRender = (data: TreeNodeData) => {
    return html`<span class='node_span'>${data == null ? '' : data.name}</span>`;
};

export { defaultNodeRender };
export { PTreeNode, PTree };
const node_icon_down = 'M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z';
const node_icon_up = 'M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z';
/**
 * 将数组对象根据转化为 root 子节点，
 * @param nodeList 节点列表，通过节点key, 将其递归加入到root 节点孩子中
 * @param root 根节点
 * @returns 返回根节点
 */
@customElement('p-tree-node')
class PTreeNode extends LitElement {
    @property({ type: Object }) nodeRender: TreeNodeRender;
    @property({ type: Number }) subChildSize: number;
    @property({ type: String }) name: string ;
    @property({ type: String }) icon: string ;
    @property({ type: Boolean }) close: boolean = true;
    @property({ type: Boolean }) closeable: boolean = true;
    private _fireNodeEvent(eventName: string) {
        this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            detail: {
                node: this
            }
        }));
    }
    
    static get styles() {
        return TreeNodeStyle;
    }

    toogleNode(event: Event) {
        // this.emptySubTreeNode = this.querySelector('p-tree-node') == null;
        if (this.subChildSize > 0) {
            this.close = !this.close;
            this._fireNodeEvent('nodeToogle');
            if (this.close) {
                this._fireNodeEvent('nodeClose');
            } else {
                this._fireNodeEvent('nodeOpen');
            }
            this.requestUpdate();
        }
    }
    get directTreeNode(): PTreeNode[] {
        const array: Element[] = Array.from(this.children).filter((item: Element) => {
            return item.tagName.toLowerCase() === 'p-tree-node';
        });
        return <PTreeNode[]>array;
    }
    get directTreeNodeSize(){
        return this.directTreeNode.length;
    }
    get _loadingDom():PLoading{
        return this.querySelector('p-loading.loadding');
    }
    render() {
        const nodeRender = this.nodeRender;
        return html`
            <div class='node_container' part='node_container' ?closed=${this.close}>
                <div class='node_div' part="node_div">
                    ${this.closeable? html`<p-icon id='p-iconID' part='node_toogle_icon' class='trigger-status' ?empty=${this.subChildSize === 0 }
                     @click="${this.toogleNode}" path=${!this.close ? node_icon_down : node_icon_up}>
                    </p-icon>`: html``}
                    ${this.icon ? html`<p-icon class='node_icon' name=${this.icon}></p-icon>` : ''}
                    <slot name="node_name" @click=${this._clickNode}> ${this.nodeRender == null ? html`<span
                            class='node_span'>${this.name}</span>` :
                     nodeRender(this)}</slot>
                </div>
                <div class='node_child' part='node_child'>
                    <slot id="slots" ></slot>
                </div>
            </div>
        `;
    }
    
    private _clickNode(ev: MouseEvent) {
        this._fireNodeEvent('node-name-click');
    }
}

@customElement('p-tree')
class PTree extends LitElement {
    static get styles() {
        return TreeStyleObj;
    }
    @property({ type: String, reflect: true }) startKey: string | number = null;
    @property({ type: Boolean, reflect: true }) includeStartNode: boolean ;
    @property({ type: Boolean }) rootCloseable: boolean = true;
    @property({ type: Boolean }) cacheNodeStatus: boolean = true;
    @property({ type: String}) filterString: string ;
    @property({ type: Object }) data: TreeNodeData;
    /**
     * 对于数据 树，控制是否懒加载
     */
    @property({ type: Boolean }) lazy: boolean;
    @property({ type: Number }) batchSize=20;
    @property({ type: Object }) filterFn: TreeFilter = defaultFilter;
    @property({ type: Object }) nodeRender: TreeNodeRender ;
    constructor() {
        super();
    }
    update(_changedProperties: Map<string | number | symbol, unknown>) {
        super.update(_changedProperties);
        if (_changedProperties.has('data') || _changedProperties.has('filterFn') || _changedProperties.has('filterString') || _changedProperties.has('rootCloseable') || _changedProperties.has('cacheNodeStatus')) {
            this.doFilterData();
        }
    }
    
    @internalProperty()
    private _filterData: TreeNodeData = null;
    @internalProperty()
    private _dataUpdate: number = Math.random();
    public doFilterData() {
        this._dataUpdate = Math.random();
        this._filterData = this.data != null ? filterTreeData(this.data, this.filterFn, this.filterString) : null;
        this.loadeSubChildMap.clear();
        if (this._filterData) {
            this._filterData.closeable = this.rootCloseable;
        }
    }
    get filterData(): TreeNodeData {
        if (this._filterData == null) {
            this.doFilterData();
        }
        return this._filterData;
    }
    firstUpdated() {
        if (this.data != null) {
            if (this.rootCloseable === false) {
                this.data.closeable = false;
            } else {
                this.data.closeable = true;
            }
            if (!this.startKey ) {
                this.startKey = this.data.key;
            }
        }
        this.observerChildrenNode();
        
    }
    private _insectionObserver:IntersectionObserver;
    private  lazyLodNodeInsetionObserver(){
        if(this._insectionObserver){
            return ;
        }
        const tree=this;
        this._insectionObserver= new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            entries.forEach((ioe) => {
                const el:PLoading = ioe.target as PLoading;
                const intersectionRatio = ioe.intersectionRatio;
                if (intersectionRatio > 0 && intersectionRatio <= 1) {
                    const node=el.closest('p-tree-node')as PTreeNode;
                    const data=(node as any).data as TreeNodeData;
                    let size:number=this.loadeSubChildMap.get(data);
                    if(size==undefined){
                        size=0;
                    }
                    const length=data._children?data._children.length:0;
                    size+=this.batchSize;
                    if(size>length){
                        size=length;
                        this._insectionObserver.unobserve(el);
                    }
                    this.loadeSubChildMap.set(data,size);
                    tree.requestUpdate();
                }
            });
        },{
            root:this,
            rootMargin:'10px'
        });
        
    }
    private observerChildrenNode(){
        const callBack=()=>{
           
            this.lazyLodNodeInsetionObserver();
            const iteratorSub=(node:PTreeNode)=>{
                const children=node.directTreeNode;
                node.subChildSize=children.length;
                children.forEach((item) =>{
                    iteratorSub(item);
                })
            }
            let nodeList=Array.from(this.children);
            nodeList.forEach((item)=>{
                if(item instanceof PTreeNode){
                    iteratorSub(item);
                }
            });
            nodeList=Array.from(this.renderRoot.querySelector('#container').children);
            nodeList.forEach((item)=>{
                if(item instanceof PTreeNode){
                    iteratorSub(item);
                }
            });
        }
        this._motaionObersever=new MutationObserver(callBack);
        this._motaionObersever.observe(this,{
            childList:true,
            subtree:true
        });
        this._motaionObersever.observe(this.renderRoot.querySelector("#container"),{
            childList:true,
            subtree:true
        });
        callBack();
    }
    disconnectedCallback(){
        super.disconnectedCallback();
        this._insectionObserver.disconnect();
        this._motaionObersever.disconnect();
    }
    private _motaionObersever:MutationObserver;

    public toJSONData() {
        return toJSONTreeData(this.data);
    }
    public getNodeData(node: PTreeNode | string): TreeNodeData {
        if (node instanceof PTreeNode) {
            // tslint:disable-next-line: no-any
            return <TreeNodeData>(node as any).data;
        } else {
            return findDataByKey(this.data, node);
        }
    }
    get startNode(): TreeNodeData {
        const filterData = this.filterData;
        if (this.startKey == null || this.startKey === undefined) {
            return filterData;
        } else if (filterData != null) {
            return findDataByKey(filterData, this.startKey);
        }
        return null;
    }
    
    private loadeSubChildMap=new  Map<TreeNodeData,number> ();
    renderNode(d: TreeNodeData): TemplateResult {
        if (d.closeable === undefined) {
            d.closeable = true;
        }
        return html`<p-tree-node .data=${d} .close=${d.close} .closeable=${d.closeable} .name=${d.name} .icon=${d.icon}
            key=${ifDefined(d.key)} .nodeRender=${this.nodeRender} 
           >
         ${this.renderSubNode(d)}
</p-tree-node>`;
    }
    private _fireNodeEvent(eventName: string, event: Event, node: PTreeNode) {
        this.dispatchEvent(new CustomEvent('tree-' + eventName, {
            bubbles: true,
            detail: {
                'node': node,
            }
        }));
        // tslint:disable-next-line: no-any
        const data = <TreeNodeData>(node as any).data;
        if (data&&this.cacheNodeStatus) {
            data.close = node.close;
        }
    }
    private _nodeHandler(event: Event) {
        const treeNode = <PTreeNode>event.target;
        this._fireNodeEvent(event.type, event, treeNode);
    }
    private renderLoadingNode(d:TreeNodeData){
        const dom=document.createElement('p-loading');
        dom.classList.add('loadding');
        if(!this._insectionObserver){
            this.lazyLodNodeInsetionObserver();
        }
        this._insectionObserver.observe(dom);
        return dom;
    }
   
    renderSubNode(d: TreeNodeData):unknown {
        const child = d._children;
        if (child == null || child.length === 0) {
            return nothing;
        } else {
            const result: Array<TemplateResult|Element> = [];
            let index=this.loadeSubChildMap.get(d);
            if(index===undefined){
                index=this.batchSize;
            }
            const length=child.length;
            let item:TreeNodeData;
            const endIndex=Math.min(index,length);
            for(let i=0;i<endIndex;i++){
                 item=child[i];
                 result.push(this.renderNode(item));
            }
            if(index<length){
                result.push(this.renderLoadingNode(d));
            }
            this.loadeSubChildMap.set(d,endIndex);
            return result;
        }
    }
    renderEmptyNode() {
        return html`<slot name='emptyNode'></slot>`;
    }
    render() {
        const startNode = this.startNode;
        const child = startNode != null ? startNode._children : null;
        const tree = this;
        return html`<div id="container" part='tree-container' @nodeNameClick=${this._nodeHandler} @nodeToogle=${this._nodeHandler}
            @nodeClose=${this._nodeHandler} @nodeOpen=${this._nodeHandler}>
        ${startNode != null && tree.includeStartNode ?
            tree.renderNode(startNode) :
            child != null ?
                child.map((item: TreeNodeData) => tree.renderNode(item))
                : this.renderEmptyNode()
            }
        <slot id="slots"></slot>
</div>`;

    }
}

