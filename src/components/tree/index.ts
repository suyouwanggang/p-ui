import { customElement, html, internalProperty, LitElement, property, TemplateResult } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import  '../icon';
import TreeStyleObj from './tree.scss';
import { defaultFilter, filterTreeData, findDataByKey, toJSONTreeData, TreeFilter, TreeNodeData } from './treeFillter';
import TreeNodeStyle from './treeNode.scss';


export interface TreeNodeRender {
    (data: PTreeNode, html: (strings: TemplateStringsArray, ...values: unknown[]) => TemplateResult): TemplateResult;
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
    @property({ type: Boolean }) close: boolean = false;
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
                     nodeRender(this, html)}</slot>
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
    @property({ type: Boolean, reflect: true }) includeStartNode: boolean = null;
    @property({ type: Boolean, reflect: true }) rootCloseable: boolean = true;
    @property({ type: Boolean, reflect: true }) cacheNodeStatus: boolean = true;
    @property({ type: String, reflect: true, attribute: 'filter-string' }) filterString: string = null;
    @property({ type: Object }) data: TreeNodeData = null;
    @property({ type: Object }) filterFn: TreeFilter = defaultFilter;
    @property({ type: Object }) nodeRender: TreeNodeRender = null;
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
            if (this.startKey == null) {
                this.startKey = this.data.key;
            }
        }
        this.requestUpdate();
    }
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
    renderNode(d: TreeNodeData): TemplateResult {
        if (d.closeable === undefined) {
            d.closeable = true;
        }
        return html`<p-tree-node .data=${d} .close=${d.close} .closeable=${d.closeable} .name=${d.name} .icon=${d.icon}
    key=${ifDefined(d.key)} .nodeRender=${this.nodeRender} .subChildSize=${d._children ? d._children.length : 0}>
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
        if (this.cacheNodeStatus) {
            data.close = node.close;
        }
    }
    private _nodeHandler(event: Event) {
        const treeNode = <PTreeNode>event.target;
        this._fireNodeEvent(event.type, event, treeNode);

    }

    renderSubNode(d: TreeNodeData): TemplateResult | Array<TemplateResult> {
        const child = d._children;
        if (child == null || child.length === 0) {
            return html``;
        } else {
            const result: Array<TemplateResult> = [];
            child.map((item: TreeNodeData) => {
                result.push(this.renderNode(item));
            });
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

