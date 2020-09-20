
import { LitElement,  html, customElement, property, css } from 'lit-element';
import {}  from '../icon/index';
import StyleFieldSet  from './style.scss';
/**
 * panel 容器
 * @property {boolean} collapsed 是否关闭内容区
 * @property {boolean} toogleable 点击header 取是否能关闭内容区,默认能关闭
 * @event  before-fieldset-collpase 如果能关闭，点击header 触发
 * @event  fieldset-collpase 内容关闭、开启后触发
 * @slot header header 分发区
 * @part fieldset  容器
 * @part header  header legend
 * @part title   span title 
 * @part content  内容区
 */
@customElement('p-fieldset')
export class PFieldSet extends LitElement {
    @property({ type: Boolean, reflect: true }) toogleable: boolean=true;
    @property({ type: Boolean, reflect: true }) collapsed: boolean;
    @property({ type: String, reflect: true }) header: string;
    static styles = StyleFieldSet;

    private _clickHeader(e: Event) {
        if (this.toogleable) {
            if(this.dispatchEvent(new CustomEvent('before-fieldset-collpase', {
                bubbles: true,
                cancelable:true,
                detail: {
                    collapse: this.collapsed
                }
            }))){
                this.collapsed = !this.collapsed;
                this.dispatchEvent(new CustomEvent('fieldset-collpase', {
                    bubbles: true,
                    detail: {
                        collapse: this.collapsed
                    }
                }))
            };
        }
    }
    render() {
        return html`<fieldset part="fieldset" class='p-fieldset'>
            <legend part='legend' class='fieldset-legend' @click=${this._clickHeader}>
                <slot name='header'>
                    ${this.toogleable? html`<p-icon part='icon-toogle' class='icon-toogle' .name=${!this.collapsed?'minus':'plus'} ></p-icon>`:''} 
                    <span class='panel-title' part='title'>${this.header}</span>
                </slot>
            </legend>
        <div class='fieldset-content' part="content" style="${this.collapsed?'display:none':''}"><slot></slot></div>
        </fieldset>
                `;
    }
}

