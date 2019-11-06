import { css, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import {ifDefined} from 'lit-html/directives/if-defined';
import { isObject } from 'util';
import { PICon } from '../p-icon';


interface TreeNodeData {
    name?: string;/*节点名称*/
    key?: string|number|undefined;/* ID  */
    close?: boolean;/* 是否关闭 */
    parentKey?:string|number|undefined;
    seqNo?: number;/*同层序号*/
    icon?: string;/*节点图标 */
    child?: TreeNodeData[];/*下级节点 */ 
    closeable?:boolean;/*false,表示节点不能折叠起来 */
    orginalData?:TreeNodeData; 
}
/*节点自定义渲染 template 签名 */
interface TreeNodeRender {
    (data: TreeNodeData): TemplateResult;
}
/* 默认渲染节点 template*/
const defaultNodeRender=function(data:TreeNodeData){
    return html`<span class='node_span'>${data==null?'':data.name}</span>`;
}
/* 节点过滤器*/
interface TreeFilter {
    (data: TreeNodeData, ...args:any): boolean;
}
const defaultFilter: TreeFilter = function (data: TreeNodeData, name: string = '') {
    if(name==null||name==undefined||name==''||name.trim()==''){
        return true;
    }
    if (data) {
        name = name.toLowerCase().trim();
        return data.name!.toLowerCase().indexOf(name) !== -1;
    }
    return true;
}
const cacheNodeFiter=new Map<Object,TreeNodeData>();


/**
 * 将数组对象转化为 root 子节点，包括所有下级节点 
 * @param nodeList 
 * @param root 如果为空，会创建一个虚拟的根{name:'@ROOT' ,key:undefined }
 * @returns 返回根节点
 */
const listToTreeData=function(nodeList:TreeNodeData[], root:TreeNodeData|string|number|undefined=undefined): TreeNodeData {
        const nodeMap = new Map<string|number|null|undefined, TreeNodeData>();
        const parentChildMap = new Map<string|number|null|undefined, TreeNodeData[]>();
        nodeList.forEach((item,index) => {
            nodeMap.set(item.key, item);
            const prarentKey = item.parentKey;
            let child: TreeNodeData[]|undefined = parentChildMap.get(prarentKey);
            if (child == null) {
                child = new Array();
                parentChildMap.set(prarentKey, child);
            }
            child.push(item);
        });
        const iterator = function (k: TreeNodeData, parent: TreeNodeData) {
            k.parentKey = parent.key;
            let parentChild=parent.child;
            if(parentChild==null){
                parent.child= parentChild=[];
            }
            parentChild.push(k);
            const child = parentChildMap.get(k.key);
            if(child!=null){
                child.forEach((item) => {
                    iterator(item, parent);
               });
            }
        };
        let rootObj:TreeNodeData=null;
        if(root==null||root==undefined){
            rootObj={
                name:'@ROOT'
            };
        }else if(!isObject(root)){
            rootObj={
                name:'@ROOT',
                key:(root as any)
            }
        }else {
            rootObj=<TreeNodeData>root;
        }
        const rootChild = parentChildMap.get(rootObj.key);
        if(rootChild!=null){
            rootChild.forEach((item) => {
                iterator(item, rootObj);
            });
        }
        return rootObj;
}



const findDataByKey=function(data:TreeNodeData,key:string|number|undefined|null): TreeNodeData{
    if(data.key===key){
        return data;
    }else{
        let child=data.child;
        if(child){
            let found=null;
            for(let i=0,j=child.length;i<j;i++){
                found=findDataByKey(child[i],key);
                if(found){
                    return found;
                }
            }
        }
    }
    return null;
}

@customElement('p-tree-node')
class PTreeNode extends LitElement {
    @property({type:Object}) nodeRender: TreeNodeRender = null;
    @property({type:Object}) data: TreeNodeData =null;
    @property({type:String}) name: string =null;
    @property({type:String}) icon: string = null;
    @property({type:Boolean}) close:boolean=false;
    @property({type:Boolean}) closeable: boolean=true;
   
    attributeChangedCallback(name: string, old: string, value: string){
        super.attributeChangedCallback(name,old,value);
        if(name=='name'&&this.data){
            this.data.name=value;
            if(this.data.orginalData){
                this.data.orginalData.name=value;
            }
        }
        if(name=='icon'&&this.data){
            this.data.icon=value;
            if(this.data.orginalData){
                this.data.orginalData.icon=value;
            }
        }
        if(name=='close'&&this.data){
            this.data.close=this.hasAttribute('close');
            if(this.data.orginalData){
                this.data.orginalData.close=this.data.close;
            }
        }
        if(name=='closeable'&&this.data){
            this.data.closeable=this.hasAttribute('closeable');
            if(this.data.orginalData){
                this.data.orginalData.closeable=this.data.closeable;
            }
        }
    }
    static get styles() {
        return css`
            :host{
                display:block;
            }
             .trigger-status {
                display:inline-block;
                position:relative;
                top:var(--node-trigger-top,-2px);
                padding-right:3px;
                width:var(--node-unit,0.8em);
                height:var(--node-unit,0.8em);
                padding-left:3px;
                font-size:8px;
                cursor:pointer;
            }
            .trigger-status[empty]{
                cursor:default;
                opacity:0;
            }
            .node_icon{
                position: relative;
                vertical-align: middle;
                top:var(--node-icon-top,0);
                color:var(--node-icon-color,inherit );
            }
            .node_div:hover{
                background:#e6f7ff;
            }
            
            .node_container{
                line-height:var(--node-text-line-height,1.8em );
                white-space:nowrap;
            }
            .node_child{
                display:inherit;
            }
            .node_container[closed] > .node_child{
                display:none;
            }
        `
    }
    
   
    firstUpdated() {
        const node = this;
    }
    get subNodeSize(): number {
         return this.querySelectorAll('p-tree-node').length;
    }
    get nodeDistance() {
        let width = 0;
        let p: HTMLElement = this;
        while (p.parentElement instanceof PTreeNode) {
            width += 1;
            p = p.parentElement;
        }
        return width+"em";
    }
    toogleNode(event: Event) {
        if (this.subNodeSize > 0) {
            if(this.data!=null){
                this.data.close=!this.data.close;
                if(this.data.orginalData){//搜索的时候，是否记住，是一个问题，
                    //如果记住，可能会导致查询的节点没有展示开，如果不记住，则查询后的节点状态没有保留
                    this.data.orginalData.close=this.data.close;
                }
                this.close = this.data.close;
            }else{
                this.close=!this.close;
            }
        }
    }
    updateNodeDistance() {
        let span:HTMLElement=this.renderRoot.querySelector('#nodeDistance_span');
        if(span){
            span.style.marginLeft=this.nodeDistance;
        }
        let icon:PICon=this.renderRoot.querySelector("#p-iconID");
        if(icon){
            if(this.subNodeSize==0){
                icon.setAttribute('empty','');
            }else{
                icon.removeAttribute('empty');
            }
        }
    }
    render() {
        const subNodeSize = this.subNodeSize;
        let nodeRender=this.nodeRender;
        let data=this.data;
        return html`
            <div class='node_container' ?closed=${this.data!=null?this.data.close: this.close} >
                <div class='node_div'>
                    <span id="nodeDistance_span" style='margin-left:${this.nodeDistance} '></span>
                    ${(this.data!=null?this.data.closeable!=false:this.closeable!=false) ? 
                        html`<p-icon id='p-iconID' class='trigger-status'  ?empty=${subNodeSize === 0}  @click="${this.toogleNode}"  
                            name=${!(this.data!=null?this.data.close: this.close) ? 'caret-down' : 'caret-right'} ></p-icon>` :
                        ''
                     }
                    ${this.icon ? html`<p-icon class='node_icon' name=${this.data!=null? this.data.icon:this.icon}></p-icon>` : ''}
                    <slot name="node_name"> ${this.nodeRender == null ? html`<span class='node_span'>${this.data!=null?this.data.name:this.name}</span>` : nodeRender(data) }</slot>
                </div>
               <div class='node_child'><slot id="slots" ></slot></div>
            </div>
        `;
    };
}


@customElement('p-tree')
class PTree extends LitElement {
    static get styles() {
        return css`
            :host{
                display:block;
            }
        `
    };

    @property({ type: String,reflect:true }) startKey: string | number = null;
    @property({ type: Boolean,reflect:true }) includeStartNode: boolean = null;
    @property({ type: Boolean,reflect:true }) rootCloseable: boolean = true;
    @property({ type: String,reflect:true,attribute:'filter-string' }) filterString: string =null;
    @property({ type: Object }) data: TreeNodeData =null;
    @property({ type: Object }) filterFn: TreeFilter=null;
    @property({ type: Object})  nodeRender: TreeNodeRender = null;
    constructor() {
        super();
        this._observer = new MutationObserver((mutationList) => {
            let result=mutationList.some(item => {
                return item.type==='childList';
            })
            if(result){
                this.updateNodeDistance();
                this.requestUpdate();
            }
        });
        this._observer.observe(this, {
            childList: true
            ,subtree:true
        });
        this.requestUpdate();
    }
    get filterData():TreeNodeData{
        let fun:TreeFilter=null;
        if(this.filterFn==null){
            fun=defaultFilter;
        }
        const tree=this;
        const oldData=this.data;
        if(oldData==null){
            return null;
        }
        if(this.filterString==null||this.filterString==undefined||this.filterString.trim()==''){
            return oldData;
        }
        let cacheString=JSON.stringify(oldData);
        let key=cacheString+"####"+this.filterString;
        if(cacheNodeFiter.has(key)){
            console.log('hit cache=='+this.filterString);
            return cacheNodeFiter.get(key);
        }
        let result=JSON.parse(cacheString); /**克隆一份数据 */
        let set=new Set<any>();
        let iterator=(item:any,
                orginalData:any,
                parentData:any,
                orginalParent:any
            ) =>{
            Object.defineProperty(item,'orginalData',{
                value:orginalData,
                writable:false,
                enumerable : false,
                configurable : true
            });
            Object.defineProperty(item,'parentData',{
                value:parentData,
                writable:true,
                enumerable : false,
                configurable : true
            });
            Object.defineProperty(item,'orginalParent',{
                value:orginalParent,
                writable:false,
                enumerable : false,
                configurable : true
            });
            let matched= fun.call(tree,item,tree.filterString);
            if(matched){
                if(!set.has(item)){
                    set.add(item);
                    let p=item.parentData;
                    while(p!=null){
                        if(!set.has(p)){
                            set.add(p);
                            p=p.parentData;
                        }else{
                            break;
                        }
                    }
                }
            }
            //     item:any,
            //     orginalData:any,
            //     parentData:any,
            //     orginalParent:any
            let oldChild=orginalData.child;
            let child=item.child;
            if(child){
                for(let i=0,j=child.length;i<j;i++){
                    iterator(child[i],oldChild[i],item,orginalData);
                }
            }
        };
        let oldChild=oldData.child;
        let child=result.child;
        if(child){
            for(let i=0,j=child.length;i<j;i++){
                iterator(child[i],oldChild[i],result,oldData);
            }
        }
        let iteratorResult=(all:any) =>{
            let child=all.child;
            if(child){
                for(let i=child.length-1;i>=0;i--){
                    let sub:any=child[i];
                    if(!set.has(sub)){
                        child.splice(i,1);
                    }else{
                        iteratorResult(sub);
                    }
                }
            }
        }
        iteratorResult(result);
        cacheNodeFiter.set(key,result);
        if(cacheNodeFiter.size>15){
            cacheNodeFiter.clear();
        }
        // console.log('size==='+cacheNodeFiter.has(key) +" ;value="+cacheNodeFiter.get(key));

        return result;
    }
    get allTreeNode():PTreeNode[] {
        let array:PTreeNode[]=Array.from(this.querySelectorAll('p-tree-node'));
        let container=this.renderRoot.querySelector('#container');
        let nodeList:NodeListOf<PTreeNode>=container.querySelectorAll('p-tree-node');
        for(let i=0,j= nodeList.length;i<j;i++){
            array.push(nodeList.item(i));
        }
        return array;
    }
    
    private _observer:MutationObserver;
    firstUpdated() {
      
        if(this.data!=null){
            if(this.rootCloseable==false){
                this.data.closeable=false;
            }else{
                this.data.closeable=true;
            }
            if(this.startKey==null){
                this.startKey=this.data.key;
            }
            // const itreatorFun=(data:TreeNodeData) =>{
            //     if(data.closeable==undefined){
            //         data.closeable=true;
            //     }
            // }
            // itreatorFun(this.data);
        }
        // this.requestUpdate();
        
        const slots: HTMLSlotElement = <HTMLSlotElement>this.shadowRoot.getElementById('slots');
        slots.addEventListener('slotchange', (event) => {
            this.requestUpdate();
        });
    }
    
    get startNode(): TreeNodeData {
        let filterData=this.filterData;
        if(this.startKey==null||this.startKey==undefined){
            return filterData;
        }else if(filterData!=null){
           return  findDataByKey(filterData,this.startKey);
        }
        return null;
    }
    renderNode(d: TreeNodeData, tree: PTree): TemplateResult {
        // console.log('renderNode==='+JSON.stringify(d));

        return html`<p-tree-node 
            .data=${d} .orginalData=${d.orginalData}   data-key=${ifDefined(d.key)}  .nodeRender=${tree.nodeRender}>
                ${tree.renderSubNode(d, tree)}
        </p-tree-node> `;
    }

    
    renderSubNode(d: TreeNodeData, tree: PTree): TemplateResult | Array<TemplateResult> {
        // console.log('renderSubNode==='+JSON.stringify(d));

        const child = d.child;
        if (child == null || child.length == 0) {
            return html``;
        } else {
            const result: Array<TemplateResult> = [];
            child.forEach(item => {
                result.push(tree.renderNode(item, tree))
            })
            return result;
        }
    }
    render() {
        const startNode = this.startNode;
        // console.log('startNode==='+JSON.stringify(startNode));
        let child =startNode!=null? startNode.child:null;
        const tree = this;
        return html`<div id="container">
            ${startNode!=null&& tree.includeStartNode ?
                tree.renderNode(startNode, tree) :
                child!=null? 
                    child.map(item => tree.renderNode(item, tree))
                    :''
            }
            <slot id="slots"></slot>
        </div>
            `;
        
    }
    
    updateNodeDistance(){
        this.allTreeNode.forEach(item => item.updateNodeDistance());
    }
    
    async _getUpdateComplete(){
        await super._getUpdateComplete();
        this.allTreeNode.forEach( (item) =>item.requestUpdate());
    }
    attributeChangedCallback(name:string, old:string,newval:string){
        super.attributeChangedCallback(name,old,newval);
        // console.log(`name=${name} old=${old} newVal=${newval}`);
    }
    disconnectedCallback(){
        super.disconnectedCallback();
        this._observer.disconnect();
    }
}
export { PTreeNode, PTree, defaultFilter, defaultNodeRender };