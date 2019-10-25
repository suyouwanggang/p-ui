import { css, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { isArray } from 'util';
import { defaultNodeRender, TreeData, TreeNodeData, TreeNodeRender } from './treeNode';

@customElement('p-tree-node')
export class PTreeNode extends LitElement {
    @property({ type: Boolean, reflect: true }) toogle: boolean = true;
    @property({ type: String }) name: string = null;
    @property({ type: String }) icon: string = null;
    @property({ type: Boolean, reflect: true }) closed: boolean = false;
    _data: TreeNodeData = null;
    set data(d: TreeNodeData) {
        this._data = d;
        if (d.name && this.name != d.name) {
            this.name = d.name;
        }
        if (d.icon && this.icon != d.icon) {
            this.icon = d.icon;
        }
        if (d.closed) {
            this.closed = d.closed;
        }
    }
    get data() {
        return this;
    }

    @property({type:Object}) nodeRender: TreeNodeRender = null;

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
        return html`
            <div class='node_container' ?closed=${this.closed} >
                <div class='node_div'>
                    <span id="nodeDistance_span" style='margin-left:${this.nodeDistance}em;'></span>
                    ${this.toogle ? html`<p-icon class='trigger-status' ?empty=${subNodeSize === 0}  @click="${this.toogleNode}" style=${subNodeSize ? '' : 'opacity:0;'} 
                    name=${!this.closed ? 'caret-down' : 'caret-right'} ></p-icon>` : ''}
                    ${this.icon ? html`<p-icon class='node_icon' name=${this.icon}></p-icon>` : ''}
                    <slot name="node_name"> ${this.nodeRender == null ? defaultNodeRender.bind(this)(this.data) : this.nodeRender.bind(this)(this.data) }</slot>
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

    @property({
        converter: {
            fromAttribute(value: string | null, type?: unknown) {
                return JSON.parse(value!);
            }
        }
    }) data: TreeNodeData | Array<TreeNodeData> = null;
    @property({ type: String }) startKey: string | number = null;
    @property({ type: Boolean }) includeStartNode: boolean = true;
    @property({ type: Boolean, reflect: true }) rootCloseable: boolean = false;
    @property({ type: Object})  nodeRender: TreeNodeRender = defaultNodeRender;
    constructor() {
        super();
    }
    private _treeData: TreeData = new TreeData();
    firstUpdated() {
        if (this.data != null && isArray(this.data)) {
            this.treeData.initTreeNode(this.data);
        } else if (this.data != null) {
            this.treeData.initTree(<TreeNodeData>(this.data));
        }
        this.treeData.bindTree(this);
        this.requestUpdate();
    }
    get treeData() {
        return this._treeData;
    }
    get startNode(): TreeNodeData {
        if (this.startKey == null || this.startKey === undefined) {
            let d = this.treeData.root;
            this.startKey = d.key;
            return d;
        } else {
            return this.treeData.getTreeNode(this.startKey);
        }
    }
    renderNode(d: TreeNodeData, tree: PTree): TemplateResult {
        const isRoot = d.key === tree.treeData.root.key;
        return html`<p-tree-node .data=${d}  ?toogle=${isRoot?tree.rootCloseable:true} ?closed=${ d.closed} data-key=${d.key}  .nodeRender=${tree.nodeRender}>
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
            let child = this.treeData.getChild(startNode.key);
            if (child == null) {
                child = [];
            }
            const tree = this;
            return html` <div>
                ${tree.includeStartNode ?
                    tree.renderNode(startNode, tree) :
                    child.map(item => tree.renderNode(item, tree))
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