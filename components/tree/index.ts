import { customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import { PICon } from '../icon';
import TreeStyleObj from './tree.scss';
import TreeNodeStyle from './treeNode.scss';

import {TreeNodeData,TreeFilter,defaultFilter, filterTreeData,findDataByKey} from './treeFillter';

export interface TreeNodeRender{
    (data:PTreeNode ) :TemplateResult;
}
/* 默认渲染节点 template*/
 const defaultNodeRender = (data: TreeNodeData) => {
    return html`<span class='node_span'>${data == null ? '' : data.name}</span>`;
};

export {defaultNodeRender};

/**
 * 将数组对象根据转化为 root 子节点，
 * @param nodeList 节点列表，通过节点key, 将其递归加入到root 节点孩子中
 * @param root 根节点
 * @returns 返回根节点
 */
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
                node:this
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
                        nodeRender(this)}</slot>
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
    @property({type:String,reflect:true}) startKey: string | number = null;
    @property({ type: Boolean, reflect: true }) includeStartNode: boolean = null;
    @property({ type: Boolean, reflect: true }) rootCloseable: boolean = true;
    @property({ type: String, reflect: true, attribute: 'filter-string' }) filterString: string = null;
    @property({ type: Object }) data: TreeNodeData = null;
    @property({ type: Object }) filterFn: TreeFilter = defaultFilter;
    @property({ type: Object }) nodeRender: TreeNodeRender = null;
    constructor() {
        super();
        
    }
    get filterData(): TreeNodeData {
       const rootData= this.data!=null? filterTreeData(this.data,this.filterFn,this.filterString):null;
       if(rootData){
           rootData.closeable=this.rootCloseable;
       }
       return rootData;
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
        return html`<p-tree-node  .data=${d} .close=${d.close} .closeable=${d.closeable} .name=${d.name} .icon=${d.icon}
            key=${ifDefined(d.key)} .nodeRender=${tree.nodeRender}>
            ${tree.renderSubNode(d, tree)}
    </p-tree-node>`;
    }
    private _fireNodeEvent(eventName: string, event: Event, node: PTreeNode) {   
        this.dispatchEvent(new CustomEvent('tree-' + eventName, {
            bubbles: true,
            detail: {
                'node': node,
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
            child.map((item: TreeNodeData) => {
                result.push(tree.renderNode(item, tree));
            });
            return result;
        }
    }
    render() {
        const startNode = this.startNode;
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
        <slot id="slots" ></slot>
    </div>`;

    }

    updateNodeDistance() {
        this.allTreeNode.forEach((item: PTreeNode) => item.requestUpdate());
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
export { PTreeNode, PTree}

