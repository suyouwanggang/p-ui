import { css, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import { PICon } from '../p-icon';


interface TreeNodeData {
    name?: string;/*节点名称*/
    key?: string | number | undefined;/* ID  */
    close?: boolean;/* 是否关闭 */
    parentKey?: string | number | undefined;
    seqNo?: number;/*同层序号*/
    icon?: string;/*节点图标 */
    child?: TreeNodeData[];/*下级节点 */
    closeable?: boolean;/*false,表示节点不能折叠起来 */
    orginalData?: TreeNodeData;
}
/*节点自定义渲染 template 签名 */
interface TreeNodeRender {
    (data: TreeNodeData): TemplateResult;
}
/* 默认渲染节点 template*/
const defaultNodeRender = function (data: TreeNodeData) {
    return html`<span class='node_span'>${data == null ? '' : data.name}</span>`;
}
/* 节点过滤器*/
interface TreeFilter {
    (data: TreeNodeData, ...args: any): boolean;
}
const defaultFilter: TreeFilter = function (data: TreeNodeData, name: string = '') {
    if (name == null || name === undefined || name === '' || name.trim() === '') {
        return true;
    }
    if (data) {
        name = name.toLowerCase().trim();
        return data.name!.toLowerCase().indexOf(name) !== -1;
    }
    return true;
}
const cacheNodeFiter = new Map<Object, TreeNodeData>();


/**
 * 将数组对象转化为 root 子节点，包括所有下级节点 
 * @param nodeList 
 * @param root 如果为空，会创建一个虚拟的根{name:'@ROOT' ,key:undefined }
 * @returns 返回根节点
 */
const listToTreeData = function (nodeList: TreeNodeData[], rootKey: string | number = undefined): TreeNodeData {
    const nodeMap = new Map<string | number, TreeNodeData>();
    const parentChildMap = new Map<string | number, TreeNodeData[]>();
    nodeList.forEach((item, index) => {
        nodeMap.set(item.key, item);
        const prarentKey = item.parentKey;
        let child: TreeNodeData[] | undefined = parentChildMap.get(prarentKey);
        if (child == null) {
            child = new Array();
            parentChildMap.set(prarentKey, child);
        }
        child.push(item);
    });
    const iterator = function (k: TreeNodeData, parent: TreeNodeData) {
        k.parentKey = parent.key;
        let parentChild = parent.child;
        if (parentChild == null) {
            parent.child = parentChild = [];
        }
        parentChild.push(k);
        const child = parentChildMap.get(k.key);
        if (child != null) {
            child.forEach((item) => {
                iterator(item, parent);
            });
        }
    };
    const root = nodeMap.get(rootKey);
    if (root === null || root === undefined) {
        throw new Error(`root node is null by key: ${rootKey} `);
    }
    const rootChild = parentChildMap.get(rootKey);
    if (rootChild != null) {
        rootChild.forEach((item) => {
            iterator(item, root);
        });
    }
    return root;
};



const findDataByKey = function (data: TreeNodeData, key: string | number): TreeNodeData {
    if (data.key === key) {
        return data;
    } else {
        const child = data.child;
        if (child) {
            let found = null;
            for (let i = 0, j = child.length; i < j; i++) {
                found = findDataByKey(child[i], key);
                if (found) {
                    return found;
                }
            }
        }
    }
    return null;
};

@customElement('p-tree-node')
class PTreeNode extends LitElement {
    @property({ type: Object }) nodeRender: TreeNodeRender = null;
    @property({ type: Object }) data: TreeNodeData = null;
    @property({ type: String }) name: string = null;
    @property({ type: String }) icon: string = null;
    @property({ type: Boolean }) close: boolean = false;
    @property({ type: Boolean }) closeable: boolean = true;

    attributeChangedCallback(name: string, old: string, value: string) {
        super.attributeChangedCallback(name, old, value);
        if (name === 'name' && this.data) {
            this.data.name = value;
        }
        if (name === 'icon' && this.data) {
            this.data.icon = value;
        }
        if (name === 'close' && this.data) {
            this.data.close = this.hasAttribute('close');
        }
        if (name === 'closeable' && this.data) {
            this.data.closeable = this.hasAttribute('closeable');
        }
    }
    // updated(changedProperties: Map<string | number | symbol, unknown>) {
    //     super.updated(changedProperties);
    //     if (this.isConnected && changedProperties.has('close')) {
    //         this._fireNodeEvent('nodeToogle');
    //         if (this.close) {
    //             this._fireNodeEvent('nodeClose');
    //         } else {
    //             this._fireNodeEvent('nodeOpen');
    //         }
    //     }
    // }

    private _fireNodeEvent(eventName: string) {
        this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            detail: {
                close: this.close
            }
        }));
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
            .node_div {
                display:block;
                height:var(--p-tree-nodeHeight,1.6em);
                margin:5px 0;
            }
            .node_div:hover::before{
                z-index:-1;
                background:#e6f7ff;
                content:'';
                left:0; right:0;
                position:absolute;
                height:inherit;
            }
            .node_container{
                line-height:var(--node-text-line-height,1.6em );
                white-space:nowrap;
            }
            .node_child{
                display:inherit;
                padding-left:0.9em;
            }
            .node_container[closed] > .node_child{
                display:none;
            }
        `;
    }
    get subNodeSize(): number {
        return this.querySelectorAll('p-tree-node').length;
    }

    toogleNode(event: Event) {
        if (this.subNodeSize > 0) {
            if (this.data != null) {
                this.data.close = !this.data.close;
                // if (this.data.orginalData) {//搜索的时候，是否记住，是一个问题，
                //     //如果记住，可能会导致查询的节点没有展示开，如果不记住，则查询后的节点状态没有保留
                //     this.data.orginalData.close = this.data.close;
                // }
                this.close = this.data.close;
            } else {
                this.close = !this.close;
            }
            this._fireNodeEvent('nodeToogle');
            if (this.close) {
                this._fireNodeEvent('nodeClose');
            } else {
                this._fireNodeEvent('nodeOpen');
            }
            this.requestUpdate();
        }
    }
    updateNodeDistance() {
        const icon: PICon = this.renderRoot.querySelector('#p-iconID');
        if (icon) {
            if (this.subNodeSize === 0) {
                icon.setAttribute('empty', '');
            } else {
                icon.removeAttribute('empty');
            }
        }
    }
    render() {
        const subNodeSize = this.subNodeSize;
        const nodeRender = this.nodeRender;
        const data = this.data;
        return html`
            <div class='node_container' ?closed=${this.data != null ? this.data.close : this.close} >
                <div class='node_div'>
                    ${(this.data != null ? this.data.closeable !== false : this.closeable !== false) ?
                html`<p-icon id='p-iconID' class='trigger-status'  ?empty=${subNodeSize === 0}  @click="${this.toogleNode}"   name=${!(this.data != null ? this.data.close : this.close) ? 'caret-down' : 'caret-right'} ></p-icon>` : ''}
                    ${this.icon ? html`<p-icon class='node_icon' name=${this.data != null ? this.data.icon : this.icon}></p-icon>` : ''}
                    <slot name="node_name"  @click=${this._clickNode}> ${this.nodeRender == null ? html`<span class='node_span'>${this.data != null ? this.data.name : this.name}</span>` : nodeRender(data)}</slot>
                </div>
               <div class='node_child'><slot id="slots" ></slot></div>
            </div>
        `;
    }
    private _clickNode(ev: MouseEvent) {
        this._fireNodeEvent('nodeNameClick');
    }
}


@customElement('p-tree')
class PTree extends LitElement {
    static get styles() {
        return css`
            :host{
                display:block;
            }
            #container{
                position:relative;
            }
        `;
    }

    @property({ type: String, reflect: true }) startKey: string | number = null;
    @property({ type: Boolean, reflect: true }) includeStartNode: boolean = null;
    @property({ type: Boolean, reflect: true }) rootCloseable: boolean = true;
    @property({ type: String, reflect: true, attribute: 'filter-string' }) filterString: string = null;
    @property({ type: Object }) data: TreeNodeData = null;
    @property({ type: Object }) filterFn: TreeFilter = null;
    @property({ type: Object }) nodeRender: TreeNodeRender = null;
    constructor() {
        super();
        this._observer = new MutationObserver((mutationList) => {
            const result = mutationList.some((item) => {
                return item.type === 'childList';
            });
            if (result) {
                this.updateNodeDistance();
                this.requestUpdate();
            }
        });
        this._observer.observe(this, {
            childList: true
            , subtree: true
        });
        this.requestUpdate();
    }
    get filterData(): TreeNodeData {
        let fun: TreeFilter = null;
        if (this.filterFn == null) {
            fun = defaultFilter;
        }
        const tree = this;
        const oldData = this.data;
        if (oldData == null) {
            return null;
        }
        if (this.filterString == null || this.filterString === undefined || this.filterString.trim() === '') {
            return oldData;
        }
        const cacheString = JSON.stringify(oldData);
        const key = cacheString + '####' + this.filterString;
        if (cacheNodeFiter.has(key)) {
            return cacheNodeFiter.get(key);
        }
        const result = JSON.parse(cacheString); /**克隆一份数据 */
        const set = new Set<any>();
        const iterator = (item: any,
            orginalData: any,
            parentData: any,
            orginalParent: any
        ) => {
            Object.defineProperty(item, 'orginalData', {
                value: orginalData,
                writable: false,
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(item, 'parentData', {
                value: parentData,
                writable: true,
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(item, 'orginalParent', {
                value: orginalParent,
                writable: false,
                enumerable: false,
                configurable: true
            });
            const matched = fun.call(tree, item, tree.filterString);
            if (matched) {
                if (!set.has(item)) {
                    set.add(item);
                    let p = item.parentData;
                    while (p != null) {
                        if (!set.has(p)) {
                            set.add(p);
                            p = p.parentData;
                        } else {
                            break;
                        }
                    }
                }
            }
            //     item:any,
            //     orginalData:any,
            //     parentData:any,
            //     orginalParent:any
            const oldChild = orginalData.child;
            const child = item.child;
            if (child) {
                for (let i = 0, j = child.length; i < j; i++) {
                    iterator(child[i], oldChild[i], item, orginalData);
                }
            }
        };
        const oldChild = oldData.child;
        const child = result.child;
        if (child) {
            for (let i = 0, j = child.length; i < j; i++) {
                iterator(child[i], oldChild[i], result, oldData);
            }
        }
        const iteratorResult = (all: any) => {
            const child = all.child;
            if (child) {
                for (let i = child.length - 1; i >= 0; i--) {
                    const sub: any = child[i];
                    if (!set.has(sub)) {
                        child.splice(i, 1);
                    } else {
                        iteratorResult(sub);
                    }
                }
            }
        }
        iteratorResult(result);
        if (cacheNodeFiter.size > 40) {
            cacheNodeFiter.clear();
        }
        cacheNodeFiter.set(key, result);
        // console.log('size==='+cacheNodeFiter.has(key) +" ;value="+cacheNodeFiter.get(key));

        return result;
    }
    get allTreeNode(): PTreeNode[] {
        const array: PTreeNode[] = Array.from(this.querySelectorAll('p-tree-node'));
        const container = this.renderRoot.querySelector('#container');
        if (container) {
            const nodeList: NodeListOf<PTreeNode> = container.querySelectorAll('p-tree-node');
            for (let i = 0, j = nodeList.length; i < j; i++) {
                array.push(nodeList.item(i));
            }
        }
        return array;
    }

    private _observer: MutationObserver;
    firstUpdated() {

        if (this.data != null) {
            if (this.rootCloseable === false) {
                this.data.closeable = false;
            } else {
                this.data.closeable = true;
            }
            if (this.startKey == null) {
                this.startKey = this.data.key;
            }
        }
        const slots: HTMLSlotElement = <HTMLSlotElement>this.shadowRoot.getElementById('slots');
        slots.addEventListener('slotchange', (event) => {
            this.requestUpdate();
        });
        this.requestUpdate();
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
    renderNode(d: TreeNodeData, tree: PTree): TemplateResult {
        return html`<p-tree-node 
            .data=${d} .orginalData=${d.orginalData}   key=${ifDefined(d.key)}  .nodeRender=${tree.nodeRender}>
                ${tree.renderSubNode(d, tree)}
        </p-tree-node> `;
    }
    private _fireNodeEvent(eventName: string, event: Event, node: PTreeNode) {
        this.dispatchEvent(new CustomEvent('tree-' + eventName, {
            bubbles: true,
            detail: {
                'node': node,
                'close':node.close
            }
        }));
    }
    private _nodeHandler(event: Event) {
        this._fireNodeEvent(event.type, event, event.target as PTreeNode);
    }

    renderSubNode(d: TreeNodeData, tree: PTree): TemplateResult | Array<TemplateResult> {
        // console.log('renderSubNode==='+JSON.stringify(d));

        const child = d.child;
        if (child == null || child.length === 0) {
            return html``;
        } else {
            const result: Array<TemplateResult> = [];
            child.forEach((item: TreeNodeData) => {
                result.push(tree.renderNode(item, tree));
            });
            return result;
        }
    }
    render() {
        const startNode = this.startNode;
        // console.log('startNode==='+JSON.stringify(startNode));
        const child = startNode != null ? startNode.child : null;
        const tree = this;
        return html`<div id="container" 
        @nodeNameClick=${this._nodeHandler} 
        @nodeToogle=${this._nodeHandler} 
        @nodeClose=${this._nodeHandler}
        @nodeOpen=${this._nodeHandler}>
            ${startNode != null && tree.includeStartNode ?
                tree.renderNode(startNode, tree) :
                child != null ?
                    child.map((item: TreeNodeData) => tree.renderNode(item, tree))
                    : ''
            }
            <slot id="slots"  } 
           ></slot>
        </div>
            `;

    }

    updateNodeDistance() {
        this.allTreeNode.forEach((item: PTreeNode) => item.updateNodeDistance());
    }

    async _getUpdateComplete() {
        this.updateNodeDistance();
        await super._getUpdateComplete();
    }
    attributeChangedCallback(name: string, old: string, newval: string) {
        super.attributeChangedCallback(name, old, newval);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._observer.disconnect();
    }
}
export { PTreeNode, PTree, defaultFilter, defaultNodeRender, findDataByKey, listToTreeData };
