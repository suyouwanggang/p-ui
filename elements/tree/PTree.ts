import { customElement, LitElement, property, css, html, TemplateResult } from 'lit-element';
import { PICon } from '../p-icon';
import { TreeNodeData, testNode } from './treeNode';


@customElement('p-tree-node')
export class PTreeNode extends LitElement {
    @property({ type: String }) name: string = null;
    @property({ type: String }) icon: string = null;
    @property({ type: Boolean, reflect: true }) closed: boolean = false;

    static get styles() {
        return css`
            :host{
                display:block;
            }
            .node_empty, .trigger_status{
                display:inline-block;
                margin-right:4px;
                width:0.8em;
                height:0.8em;
                margin-left:3px;
                margin-top:2px;
                font-size:8px;
                vertical-align:text-top;
            }
            .node_div:hover{
                background:#e6f7ff;
            }
            .trigger_status{
                cursor:pointer;
            }
            .node_container{
                line-height:1.8em;
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
         const children=this.querySelectorAll('p-tree-node');
         children.forEach((item) => {
             const node = (<PTreeNode>item);
             const span: HTMLElement = node.renderRoot.querySelector("#nodeDistance_span");
             span.style.marginLeft = node.nodeDistance + "px";
         });
        this.requestUpdate();
    }
    firstUpdated() {
        const node = this;
        this._observer = new MutationObserver(mutationList => {
            node.updateNodeDistance();
        });
        this._observer.observe(this, {
            childList: true
        });

        const slots: HTMLSlotElement = <HTMLSlotElement>this.shadowRoot.getElementById('slots');
        slots.addEventListener('slotchange', (event) => {
            node.updateNodeDistance();
        });
    }
    get subNodeSize(){
        if(this.hasUpdated){
            return this.querySelectorAll("p-tree-node").length;
        }
        return 0;
    }
    get nodeDistance() {
        let width = 0;
        if (this.hasUpdated) {
            let p: HTMLElement = this;
            while (p.parentElement instanceof PTreeNode) {
                width += 16;
                p = p.parentElement;
            }
        }
        return width;
    }
    toogleNode(event: Event) {
        this.closed = !this.closed;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._observer.disconnect();
    }
    render() {
        return html`
            <div class='node_container' ?closed=${this.closed} >
                <div class='node_div'><span  class='node_empty' style=${this.subNodeSize ? 'display:none;' : ''}></span>
                    <span id="nodeDistance_span" style='margin-left:${this.nodeDistance}px;'></span>
                    <p-icon class='trigger_status'  @click="${this.toogleNode}" style=${this.subNodeSize ? '' : 'display:none'} name=${!this.closed ? 'caret-down' : 'caret-right'} ></p-icon>
                    ${this.icon ? html`<p-icon class='node_icon' name=${this.icon}></p-icon>` : html``}
                    <slot name="node_name"> <span class='node_span'>${this.name}</span></slot>
                </div>
               <div class='node_child'><slot id="slots" ></slot></div>
            </div>
        `;
    };
}


@customElement('p-tree')
export class PTree extends LitElement {
    @property({ type: Object }) data: TreeNodeData = testNode;
    @property({ type: Boolean, reflect: true }) closed: boolean = false;
    static get styles() {
        return css`
            :host{
                display:block;
            }
        `
    };



}