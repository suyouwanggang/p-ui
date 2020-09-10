
import { LitElement,  html, customElement, property, css } from 'lit-element';
/**
 * panel 容器
 * @property {boolean} collapsed 是否关闭内容区
 * @property {boolean} toogleable 点击header 取是否能关闭内容区
 * @event  before-panel-collpase 如果能关闭，点击header 触发
 * @event  panel-collpase 内容关闭、开启后触发
 * @slot header 头部分发区
 * @part panel-header  header DIV
 * @part panel-title  title span
 * @part panel-content  内容区
 */
@customElement('p-panel')
export class PPanel extends LitElement {
    @property({ type: Boolean, reflect: true }) toogleable: boolean=true;
    @property({ type: Boolean, reflect: true }) collapsed: boolean;
    @property({ type: String, reflect: true }) header: string;
    static styles = css`
       :host{
            font-size:inherit;
            display:block;
            box-sizing:border-box;
        }
        :host([toogleable]) .panel-header{
            cursor:pointer;
        }
        .panel-header{
            border: 1px solid var(--panel-header-color,#dee2e6);
            padding: 0.5rem 1rem;
            background: #f8f9fa;
            color: var(--panel-header-color,#495057);
            border-top-right-radius: 3px;
            border-top-left-radius: 3px;
        }
         .panel-header .panel-title {
                font-weight: 600;
        }

        .panel-content{
            padding: 1rem;
            border: 1px solid var(--panel-header-color,#dee2e6);
            background: #ffffff;
            color: #495057;
            border-bottom-right-radius: 3px;
            border-bottom-left-radius: 3px;
            border-top: 0 none;
            transition: all 0.5s cubic-bezier(0,1,0.5,1);
        }
    `;

    private _clickHeader(e: Event) {
        if (this.toogleable) {
            if(this.dispatchEvent(new CustomEvent('before-panel-collpase', {
                bubbles: true,
                cancelable:true,
                detail: {
                    collapse: this.collapsed
                }
            }))){
                this.collapsed = !this.collapsed;
                this.dispatchEvent(new CustomEvent('panel-collpase', {
                    bubbles: true,
                    detail: {
                        collapse: this.collapsed
                    }
                }))
            };

            
        }
    }
    render() {
        return html`<div >
                <div class='panel-header' id="header" part="panel-header" @click=${this._clickHeader} >
                    <slot name="header"><span class='panel-title' part="panel-title">${this.header}</span></slot>
                </div>
                <div class='panel-content' id="content" part="panel-content" style="${this.collapsed ? 'display:none' : ''}">
                    <slot></slot>
                </div>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'p-panel': PPanel;
    }
}
