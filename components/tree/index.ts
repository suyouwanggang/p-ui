import { customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import { PICon } from '../icon';
import TreeStyleObj from './tree.scss';
import TreeNodeStyle from './treeNode.scss';


export interface TreeNodeData {
    name?: string;/*节点名称*/
    key?: string | number |Date| undefined;/* ID  */
    close?: boolean;/* 是否关闭 */
    seqNo?: number;/*同层序号*/
    icon?: string;/*节点图标 */
    child?: TreeNodeData[];/*下级节点 */
    closeable?: boolean;/*false,表示节点不能折叠起来 */

}
/*节点自定义渲染 template 签名 */
export interface TreeNodeRender {
    (data: TreeNodeData): TemplateResult;
}
/* 默认渲染节点 template*/
const defaultNodeRender = (data: TreeNodeData) => {
    return html`<span class='node_span'>${data == null ? '' : data.name}</span>`;
};
/* 节点过滤器*/
export interface TreeFilter {
    (data: TreeNodeData, ...args: unknown[]): boolean;
}
const defaultFilter: TreeFilter = function (data: TreeNodeData, name: string = '') {
    if (name == null || name === undefined || name === '' || name.trim() === '') {
        return true;
    }
    if (data) {
        name = name.toLowerCase().trim();
        return data.name!.toLowerCase().indexOf(name) !== -1;
    }
    return false;
};
const filterTreeDataArray = (nodes: TreeNodeData[], filter?: TreeFilter, ...args: unknown[]): TreeNodeData[] => {
    if (filter == null) {
        return nodes;
    }
    if (!(nodes && nodes.length)) {
        return [];
    }
    const newChildren: TreeNodeData[] = [];
    for (const node of nodes) {
        if (filter(node, args)) {
            newChildren.push(node);
            if (node.child) {
                node.child = filterTreeDataArray(node.child, filter, args);
                //递归处理子节点
            }
        } else if (node.child) {
            newChildren.push(...filterTreeDataArray(node.child, filter, args));
            //递归处理子节点
        }
    }
    return newChildren;
};



/**
 * 过滤树
 * @param root 根节点
 * @param filter 
 * @param args 
 */
export const filterTreeData = (root: TreeNodeData, filter?: TreeFilter, ...args: unknown[]): TreeNodeData => {
    if (filter == null) {
        return root;
    }
    const cloneRoot: TreeNodeData = JSON.parse(JSON.stringify(root));
    const rootMap={ child:[cloneRoot]};
    const child= filterTreeDataArray(rootMap.child);
   
    return child[0];
}


/**
 * 将数组对象根据转化为 root 子节点，
 * @param nodeList 节点列表，通过节点key, 将其递归加入到root 节点孩子中
 * @param root 根节点
 * @returns 返回根节点
 */
export const listTreeDataToRoot = (nodeList: TreeNodeData[], root: TreeNodeData = {}): TreeNodeData => {
    const map = new Map<string | number | Date | undefined, Array<TreeNodeData>>();
    nodeList.forEach((item: TreeNodeData) => {
        let sub = map.get(item.key);
        if (sub === undefined) {
            sub = new Array<TreeNodeData>();
            map.set(item.key, sub);
        }
        sub.push(item);
    });
    const iteratorFun = (key: string | number | Date | undefined, data: TreeNodeData) => {
        const subChild = map.get(key);
        subChild!.forEach((item: TreeNodeData) => {
            if (!data.child) {
                data.child = [];
            }
            data.child.push(item);
            iteratorFun(item.key, item);
        });
    };
    iteratorFun(root.key, root);
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
    @property({ type: String }) name: string = null;
    @property({ type: String }) icon: string = null;
    @property({ type: Boolean }) close: boolean = false;
    @property({ type: Boolean }) closeable: boolean = true;

    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(_changedProperties);
        const slot: HTMLSlotElement = this.renderRoot.querySelector('#slots');
        slot.addEventListener('slotchange', () => {
            this.requestUpdate();
        });

    }
    private _fireNodeEvent(eventName: string) {
        this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            detail: {
                close: this.close
            }
        }));
    }
    static get styles() {
        return TreeNodeStyle;
    }
    get subNodeSize(): number {
        return this.querySelectorAll('p-tree-node').length;
    }

    toogleNode(event: Event) {
        if (this.subNodeSize > 0) {
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
        return html`
            <div class='node_container' part='node_container' ?closed=${this.close}>
                <div class='node_div' part="node_div">
                    ${(this.closeable !== false) ? html`<p-icon id='p-iconID' class='trigger-status' ?empty=${subNodeSize===0}
                        @click="${this.toogleNode}" name=${!this.close ? 'caret-down' : 'caret-right' }></p-icon>` : ''}
                    ${this.icon ? html`<p-icon class='node_icon' name=${this.icon}></p-icon>` : ''}
                    <slot name="node_name" @click=${this._clickNode}> ${this.nodeRender == null ? html`<span
                            class='node_span'>${this.name}</span>` :
                        nodeRender({ name: this.name, close: this.close, icon: this.icon, closeable: this.closeable })}</slot>
                </div>
                <div class='node_child' part='node_child'>
                    <slot id="slots"></slot>
                </div>
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
        return TreeStyleObj;

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
        return html`<p-tree-node .data=${d} .close=${d.close} .closeable=${d.closeable} .name=${d.name} .icon=${d.icon}
    key=${ifDefined(d.key)} .nodeRender=${tree.nodeRender}>
    ${tree.renderSubNode(d, tree)}
</p-tree-node>`;
    }
    private _fireNodeEvent(eventName: string, event: Event, node: PTreeNode) {
        this.dispatchEvent(new CustomEvent('tree-' + eventName, {
            bubbles: true,
            detail: {
                'node': node,
                'close': node.close
            }
        }));
    }
    private _nodeHandler(event: Event) {
        this._fireNodeEvent(event.type, event, event.target as PTreeNode);
    }

    renderSubNode(d: TreeNodeData, tree: PTree): TemplateResult | Array<TemplateResult> {

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
        return html`<div id="container" @nodeNameClick=${this._nodeHandler} @nodeToogle=${this._nodeHandler} @nodeClose=${this._nodeHandler}
    @nodeOpen=${this._nodeHandler}>
    ${startNode != null && tree.includeStartNode ?
    tree.renderNode(startNode, tree) :
    child != null ?
    child.map((item: TreeNodeData) => tree.renderNode(item, tree))
    : ''
    }
    <slot id="slots"></slot>
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

