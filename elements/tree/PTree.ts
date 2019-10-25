import { css, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { isArray } from 'util';

interface TreeNodeData {
    name: string;/*节点名称*/
    key?: string|number|undefined;/* ID  */
    closed?: boolean;/* 是否关闭 */
    parentKey?:string|number|undefined;
    seqNo?: number;/*同层序号*/
    icon?: string;/*节点图标 */
    child?: TreeNodeData[];/*下级节点 */ 
    toogle?:boolean;/*false,表示节点不能折叠起来 */
}
/*节点自定义渲染 template 签名 */
interface TreeNodeRender {
    (data: TreeNodeData): TemplateResult;
}
/* 默认渲染节点 template*/
const defaultNodeRender=function(data:TreeNodeData){
    return html`<span class='node_span'>${data==null||data.name==undefined?'':data.name}</span>`;
}
/* 节点渲染 */
interface TreeFilter {
    (data: TreeNodeData, ...args: []): boolean;
}
const defaultFilter: TreeFilter = function (data: TreeNodeData, name: string = '') {
    if(name==''||name.trim()==''){
        return true;
    }
    if (data) {
        name = name.toLowerCase().trim();
        return data.name!.toLowerCase().indexOf(name) !== -1;
    }
    return true;
}
const binaraySearch = function (searchArray: TreeNodeData[], searchElement: TreeNodeData) {
    let stop = searchArray.length;
    let last, p = 0, delta = 0;
    do {
        last = p;
        if (searchArray[p].seqNo > searchElement.seqNo) {
            stop = p + 1;
            p -= delta;
        } else if (searchArray[p].seqNo === searchElement.seqNo) {
            // FOUND A MATCH!
            return p;
        }
        delta = Math.floor((stop - p) / 2);
        p += delta; //if delta = 0, p is not modified and loop exits
    } while (last !== p);
    return -1;
};
const binarayAdd = function (searchArray: TreeNodeData[], searchElement: TreeNodeData) {
    const mid = binaraySearch(searchArray,searchElement);
    if ( mid === -1 || mid === searchArray.length-1 ) {
        searchArray.push(searchElement);
    } else {
        searchArray.splice(mid,0,searchElement);
    }
};

class TreeData {
    tree:PTree;
    root: TreeNodeData;
    keyNodeMap = new Map<String|number|undefined, TreeNodeData>();
    constructor() {
        this.root={
            name:'@root',
            parentKey:undefined,
            key:undefined,
            seqNo:0,
            closed:false
        };
        this.keyNodeMap.set(this.root.key, this.root);
    }

    bindTree(tree:PTree){
        this.tree=tree;
    }
    /**
     * 重构所有的树节点 
     * @param data 
     */
    initTreeByObject(data: TreeNodeData) {
        if (data == null||data==undefined) {
            throw new Error('tree root should not be null or undefined ');
        }
        let currentIndex=1;
        const tree = this;
        tree.root = data;
        tree.keyNodeMap.clear(); //清空所有节点
        tree.keyNodeMap.set(data.key, data);
        const child: TreeNodeData[]|undefined = data.child;
        if (child != null) {// only set root  会查找child ，看是否有下级节点，如果有，
            const iterator = function (k: TreeNodeData, parent: TreeNodeData) {
                if(k.key==null){
                    k.key=Math.random()+(currentIndex++)+'_Key';
                }
                if(k.toogle==null){
                    k.toogle=true;
                }
                k.parentKey = parent.key;
                tree.keyNodeMap.set(k.key, k);
                const child: TreeNodeData[] = k.child;
                if(child!=null){
                    child.forEach((item) => {
                        iterator(item, parent);
                    });
                }
            };
            child.forEach((item) => {
                iterator(item, this.root);
            });
        }
    }
   
    /**
     * @param nodeList 添加节点到树中，根据parentKey, key 循环所有的节点，自动构建树数据。<br/>
     * 节点顺序同层次已 seqNo 为准，如果seqNo 为空，则seqNo 为添加的顺序号
     */
    initTreeByArray(nodeList: TreeNodeData[]) {
        const tree = this;
        const nodeMap = new Map<string|number|null|undefined, TreeNodeData>();
        const parentChildMap = new Map<string|number|null|undefined, TreeNodeData[]>();
        nodeList.forEach((item,index) => {
            if (item.key==null|| item.key==undefined) {
                throw new Error('tree Node key should not null');
            }
            if(item.seqNo===undefined){
                item.seqNo=index;
            }
            if(item.toogle==null){
                item.toogle=true;
            }
            nodeMap.set(item.key, item);
            const prarentKey = item.parentKey;
            let child: TreeNodeData[]|undefined = parentChildMap.get(prarentKey);
            if (child == null) {
                child = new Array();
                parentChildMap.set(prarentKey, child);
            }
            binarayAdd(child, item);
        });
        const iterator = function (k: TreeNodeData, parent: TreeNodeData) {
            k.parentKey = parent.key;
            let parentChild=parent.child;
            if(parentChild==null){
                parent.child= parentChild=[];
            }
            parentChild.push(k);
            tree.keyNodeMap.set(k.key, k);
            const child = parentChildMap.get(k.key);
            if(child!=null){
                child.forEach((item) => {
                    iterator(item, parent);
               });
            }
        };
        const rootChild = parentChildMap.get(this.root.key);
        if(rootChild!=null){
            rootChild.forEach((item) => {
                iterator(item, this.root);
            });
        }
    }

    addTreeNode(node: TreeNodeData){
        const key = node.key;
        if ( key == null) {
            throw new Error(`node ${node.name} : key should not null and unique! `);
        }
       const parentKey = node.parentKey;
       const parent = this.keyNodeMap.get(parentKey);
        if ( parent == null) {
            throw new Error('node ${node.name} : parentNode doest not exist ! ');
        }
        let child = parent.child;
        if(child==null){
           parent.child= child=[];
        }
        let maxSeqNo=0;
        child.forEach(item => {
            if(item.seqNo>maxSeqNo){
                maxSeqNo=item.seqNo;
            }
        })
        if(node.toogle==undefined){
            node.toogle=true;   
        }
        node.seqNo=maxSeqNo;
        child.push(node);
        this.keyNodeMap.set(key, node);
        this.updateTree();
    }
    updateTree(){
        if(this.tree!=null){
            this.tree.requestUpdate();
        }
    }
    getTreeNode(key: string|undefined|number): TreeNodeData|null {
        return this.keyNodeMap.get(key);
    }
    getChild(key: string |number|undefined, includeSub: boolean = false): TreeNodeData[]|null {
        const node = this.getTreeNode(key);
        if(node==null||node.child==null){
            return null;
        }
        if(includeSub ){
            const result : Array<TreeNodeData>=[];
            result.push(node);
            const iterator = function (k: TreeNodeData) {
                result.push(k);
                if(k.child){
                    k.child.forEach( (item) => {
                        iterator(item);
                    });
                }
            };
            node.child.forEach( (item) => {
                iterator(item);
            } ) ;
            return result;
        }else{
            return node.child;
        }
       
    }
    getParentNode(key: string|number|undefined): TreeNodeData {
        let node = this.getTreeNode(key);
        if (node != null) {
            node = this.getTreeNode(node.parentKey);
            return node;
        }
        return null;
    }
    hasNode( key: string|number|undefined): boolean {
        return this.keyNodeMap.has(key);
    }
    /**
     * 
     * @param key 节点主键
     * @returns 返回删除的节点数据
     */
    removeChild(key: string|number|undefined): TreeNodeData {
        const tree = this;
        const node = this.getTreeNode(key);
        if (node != null) {
           const parent = this.getParentNode(key);
           const allChild = this.getChild(key, true);
           if ( parent && parent.child && parent.child.length > 0 ) {
               const index = parent.child.indexOf(node);
               if ( index >= 0) {
                   parent.child.splice(index, 1);
               }
           }
           if(allChild){
                 allChild.forEach( (item) => {
                    tree.keyNodeMap.delete(item.key);
                });
           }
           this.updateTree();
           return node;
        }
        return null;
    }
}








@customElement('p-tree-node')
export class PTreeNode extends LitElement {
    @property({ type: Boolean, reflect: true }) toogle: boolean = true;
    @property({ type: String }) name: string = null;
    @property({ type: String }) icon: string = null;
    @property({ type: Boolean, reflect: true }) closed: boolean = false;
    @property({type:Object}) nodeRender: TreeNodeRender = null;
    private  _data: TreeNodeData = null;
    set data(d: TreeNodeData) {
        this._data = d;
        if (d.name && this.name != d.name) {
            this.name = d.name;
        }
        if (d.icon && this.icon != d.icon) {
            this.icon = d.icon;
        }
        if(d.toogle!=undefined){
            this.toogle=d.toogle;
        }
        if (d.closed) {
            this.closed = d.closed;
        }
    }
    get data() {
        return this._data;
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
                margin-right:3px;
                width:var(--node-unit,0.8em);
                height:var(--node-unit,0.8em);
                margin-left:3px;
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
    private _observer: MutationObserver = null;
    private updateNodeDistance() {
        const children = this.querySelectorAll('p-tree-node');
        children.forEach((item) => {
            const node = (<PTreeNode>item);
            const span: HTMLElement = node.renderRoot.querySelector('#nodeDistance_span');
            if (span) {
                span.style.marginLeft = node.nodeDistance + 'em';
            }
        });
        this.requestUpdate();
    }
    firstUpdated() {
        const node = this;
        this._observer = new MutationObserver((mutationList) => {
            mutationList.forEach((item) => {
                if (item.type === 'childList') {
                    node.updateNodeDistance();
                    return;
                }
            });
        });
        this._observer.observe(this, {
            childList: true
        });
        const slots: HTMLSlotElement = <HTMLSlotElement>this.shadowRoot.getElementById('slots');
        slots.addEventListener('slotchange', (event) => {
            node.updateNodeDistance();
        });
    }
    get subNodeSize(): number {
        if (this.hasUpdated) {
            return this.querySelectorAll('p-tree-node').length;
        }
        return 0;
    }
    get nodeDistance() {
        let width = 0;
        if (this.hasUpdated) {
            let p: HTMLElement = this;
            while (p.parentElement instanceof PTreeNode) {
                width += 1;
                p = p.parentElement;
            }
        }
        return width;
    }
    toogleNode(event: Event) {
        if (this.subNodeSize > 0) {
            this.closed = !this.closed;
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._observer.disconnect();
    }
    render() {
        const subNodeSize = this.subNodeSize;
        let nodeRender=this.nodeRender;
        let data=this.data;
        return html`
            <div class='node_container' ?closed=${this.closed} >
                <div class='node_div'>
                    <span id="nodeDistance_span" style='margin-left:${this.nodeDistance}em;'></span>
                    ${this.toogle ? 
                        html`<p-icon class='trigger-status' ?empty=${subNodeSize === 0}  @click="${this.toogleNode}" } 
                            name=${!this.closed ? 'caret-down' : 'caret-right'} ></p-icon>` :
                        ''
                     }
                    ${this.icon ? html`<p-icon class='node_icon' name=${this.icon}></p-icon>` : ''}
                    <slot name="node_name"> ${this.nodeRender == null ? html`<span class='node_span'>${this.name}</span>` : nodeRender(data) }</slot>
                </div>
               <div class='node_child'><slot id="slots" ></slot></div>
            </div>
        `;
    };
}


@customElement('p-tree')
export class PTree extends LitElement {
    static get styles() {
        return css`
            :host{
                display:block;
            }
        `
    };
    @property({ type: String }) startKey: string | number = null;
    @property({ type: Boolean }) includeStartNode: boolean = true;
    @property({ type: Boolean }) rootCloseable: boolean = true;
    @property({ type: Object})  nodeRender: TreeNodeRender = defaultNodeRender;

    private __data:Object=null;
    set data( obj:any){
        this.initialNodeData(obj);
        this.__data=obj;
    }
    get data(){
        return this.__data;
    }
    private treeData:TreeData=new TreeData();
    constructor() {
        super();
    }
     
    initialNodeData(obj :any){
        if(isArray(obj)){
            this.treeData.initTreeByArray(<TreeNodeData[]>obj);
        }else{
            this.treeData.initTreeByObject(obj);
        }
        this.requestUpdate();
    }
    firstUpdated() {
        if(this.rootCloseable==false){
            this.treeData.root.toogle=false;
        }
        if(this.startKey==null){
            this.startKey=this.treeData.root.key;
        }
        this.treeData.bindTree(this);
        this.requestUpdate();
    }
    
    get startNode(): TreeNodeData {
        let d= this.treeData.getTreeNode(this.startKey);
        if(d==null){
            d=this.treeData.root;
        }
        return d;
    }
    renderNode(d: TreeNodeData, tree: PTree): TemplateResult {
        return html`<p-tree-node 
            .data=${d}  .toogle=${d.toogle==undefined?true:d.toogle}  .closed=${d.closed} data-key=${d.key}  .nodeRender=${tree.nodeRender}>
                ${tree.renderSubNode(d, tree)}
        </p-tree-node> `;
    }
    renderSubNode(d: TreeNodeData, tree: PTree): TemplateResult | Array<TemplateResult> {
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
        if (this.hasUpdated) {
            const startNode = this.startNode;
            let child = startNode.child;
            const tree = this;
            return html` <div>
                ${tree.includeStartNode ?
                    tree.renderNode(startNode, tree) :
                    child!=null? 
                        child.map(item => tree.renderNode(item, tree))
                        :''
                }
            </div>;
             `
        } else {
            return html``;
        };
    }

    log(methodName: string, array: any[]) {
        console.log(`start methodName=${methodName}`);
        for (const key of array) {
            console.log(key);
        }
        console.log(`end methodName=${methodName}`);
    }
    attributeChangedCallback(name: string, old: string | null, value: string | null) {
        this.log('attributeChangedCallback', [...arguments]);
        super.attributeChangedCallback(name, old, value);

    }
    connectedCallback() {
        super.connectedCallback();
        this.log('connectedCallback', [...arguments]);

    }
    performUpdate(): void | Promise<unknown> {

        this.log('performUpdate', [...arguments]);
        super.performUpdate();
    }

    shouldUpdate(_changedProperties: Map<string | number | symbol, unknown>): boolean {

        this.log('shouldUpdate', [...arguments]);
        return super.shouldUpdate(_changedProperties);
    }

    update(changedProperties: Map<string | number | symbol, unknown>) {
        super.update(changedProperties);
        this.log('update', [...arguments]);
    }
    

    updated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(_changedProperties);
        this.log('updated', [...arguments]);

    }
}