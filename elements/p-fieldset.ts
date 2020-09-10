
import { LitElement,  html, customElement, property, css } from 'lit-element';
import {}  from './p-icon';
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
    static styles = css`
        :host{
            display:block;
            box-sizing:border-box;
        }
       .p-fieldset{
            display:block;
            box-sizing:border-box;
            border-radius: 3px;
            border: 1px solid #c8c8c8;
            background-color: #fff;
            color: #333;
            padding: .571em 1em;
        }
        :host([toogleable])  .fieldset-legend{
            cursor:pointer;
        }
        .fieldset-legend{
            border: 1px solid var(--legend-border-color,#dee2e6);
            background-color: var(--legend-background-color,#f4f4f4);
            color: #333;
            padding: .571em 1em .571em 1em;
            font-weight: 600;
        }
        .icon-toogle{
            padding:auto 0.7em;
        }
        .fieldset-content{
            transition: all 0.5s cubic-bezier(0,1,0.5,1);
        }
    `;

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

declare global {
    interface HTMLElementTagNameMap {
        'p-fieldset': PFieldSet;
    }
}
