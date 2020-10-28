
import { LitElement,  html, customElement, property, css } from 'lit-element';
import PanelStyleObj from './style.scss';
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
    static styles =PanelStyleObj;

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
                <div class='panel-header' id="header" part="panel-header"  >
                    <slot id="slot-header" name="header"><div @click=${this._clickHeader} part="panel-title">${this.header}</div></slot>
                    <slot id="header-right" name="header-right"></slot>
                </div>
                <div class='panel-content' id="content" part="panel-content" style="${this.collapsed ? 'display:none' : ''}">
                    <slot></slot>
                </div>
        </div>`;
    }
}

