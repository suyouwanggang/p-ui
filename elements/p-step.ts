
import { css, customElement, html, LitElement, property, internalProperty } from 'lit-element';
import { } from './p-icon';
/**
 * 步骤条
 * @slot header 头部分发区
 * @part container  内容区
 */
type sizeType = 'small' | 'mid' | 'large';
@customElement('p-steps')
export class PSteps extends LitElement {
    /**
     * 当前步骤，默认从0 
     */
    @property({ type: Number, reflect: true }) current: number = 0;
    /**
     * 是否为竖直
     */
    @property({ type: Boolean, reflect: true }) vertical = false;
    /**
     * 起始节点显示 序号，默认为1
     */
    @property({ type: Number, reflect: true }) startIndex: number = 1;
    /**
     *  进度点 圆圈大小
     */
    @property({ type: String, reflect: true }) size: sizeType;
    static styles = css`
       :host{
            display:block;
            box-sizing:border-box;
        }
       :host([vertical]) div[part='container']{
           flex-direction:column;
           display:block;
       }
       div[part='container']{
           display:flex;
       }

    `;
    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(_changedProperties);
        const slotItem: HTMLSlotElement = this.renderRoot.querySelector('#slot');
        slotItem.addEventListener('slotchange', () => {
            this._setChildStepCss();
        });
    }
    private _setChildStepCss() {
        const childItems = this.childStep;
        const length = childItems.length;
        childItems.forEach((item: PStep, index: number) => {
            if (index === 0) {
                item.setAttribute('first', '');
            } else {
                item.removeAttribute('first');
            }
            if (index === this.current) {
                item.setAttribute('current', '');
            } else {
                item.removeAttribute('current');
            }
            if (index < this.current) {
                item.setAttribute('finished', '');
            } else {
                item.removeAttribute('finished');
            }
            item.index = this.startIndex + index;

            if (index === length - 1) {
                item.setAttribute('last', '');
            } else {
                item.removeAttribute('last');
            }
            if (this.vertical) {
                item.setAttribute('direction', 'vertical');
            } else {
                item.removeAttribute('direction');
            }
        });
    }
    updated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(_changedProperties);
        if (_changedProperties.has('vertical') || _changedProperties.has('current')) {
            this._setChildStepCss();
        };

    }
    get childStep(): Array<PStep> {
        return Array.from<PStep>(this.querySelectorAll('p-step'));
    }
    render() {
        return html`<div part='container'>
                <slot id='slot'></slot>
        </div>`;
    }
}

@customElement('p-step')
export class PStep extends LitElement {
    @property({ type: String, reflect: true }) icon: string = undefined;
    @property({ type: String, reflect: true }) description: string;
    @property({ type: String, reflect: true }) title: string;

    @property({ type: Number })
    index: number = 0;
    static styles = css`
        :host{
            position: relative;
            display: inline-block;
            flex: 1;
            overflow: hidden;
        }

        :host([finished]){
            --step-background-color: #fff;
            --step-border-color: #42b983 ;
            --step-icon-color:#42b983 ;
            --step-line-color:#42b983 ;

        }
        :host([current]){
            --step-background-color: #42b983;
            --step-border-color: #42b983;
            --step-icon-color:#FFF;
            -step-line-color:#f0f0f0;
        }

        :host([last]){
            flex: 0 0 auto;
        }
        :host([direction=vertical]){
            display: block;
        }
       div[part=step-container]{
           box-sizing:border-box;
           display: flex;
           overflow:hidden;
       }
       :host([direction=vertical])  div[part=step-container]{
           position:relative;
           display:flex;
       }
       div[part=icon-part]{
            display:inline-block;
            position: relative;
            background-color: var(--step-background-color,#fff); 
            flex:0 0 auto ;
            width: 32px;
            height: 32px;
            margin: 0 8px 0 0;
            font-size: 16px;
            line-height: 32px;
            text-align: center;
            border: 1px solid var(--step-border-color,rgba(0,0,0,.25));
            border-radius: 32px;
            transition: background-color .3s,border-color .3s;
            color:var(--step-icon-color,inherit);
       }
       
       .icon-span{
            display: inline-block;
            color: inherit;
            text-align: center;

       }
        div[part=step-content]{
            display:inline-block;
        }
        :host([direction=vertical]) .div[part=step-content]{
            min-height:48px;
        }

        div[part=step-title]{
            color: rgba(0,0,0,.85);
            font-weight: 400;
            display: inline-block;
            position: relative;
        }
       :host(:not([direction=vertical]):not([last]) )   div[part=step-title]::after{
            position: absolute;
            top: 16px;
            left: 100%;
            margin-left:10px;
            display: block;
            width: 9999px;
            height: 1px;
            background:var(--step-line-color,#f0f0f0);
            content: "";
        }
        div[part=step-description]{
            color: rgba(0,0,0,.85);
            white-space: normal;
            max-width:400px;
            box-sizing:border-box;
        }
        :host([direction=vertical]) div[part=step-description]
        {
            max-width:none;
        }
        .tail{
          display:none;
        }
        :host([direction=vertical]) .tail{
            position: absolute;
            display:block;
            left:16px;
            width:1px;
            height:100%;
          }
          :host([direction=vertical]) div[part=icon-part]{
            margin-right: 16px;
            float:left;
          }
          :host([direction=vertical]:not([last])) .tail::after{
            display: inline-block;
            width: 100%;
            height: 100%;
            background: #f0f0f0;
            border-radius: 1px;
            transition: background-color .3s;
            background-color:var(--step-border-color,rgba(0,0,0,.25));
            content:"";
          }
          :host([direction=vertical]) div[part=step-content]{
                display: block;
                min-height:46px;
          }
    `;
    isCurrentStep() {
        const steps = this.parentSteps;
        if (steps) {
            return steps.childStep.indexOf(this) === steps.current;
        }
        return false;
    }
    isFinished() {
        const steps = this.parentSteps;
        if (steps) {
            return steps.childStep.indexOf(this) < steps.current;
        }
        return false;
    }

    get parentSteps(): PSteps {
        return this.closest('p-steps');
    }
    render() {
        return html`
            <div part='step-container' >
                <div class='tail'></div>
                <div part='icon-part'>
                    <span class='icon-span'>
                        ${this.icon ? html`<p-icon name='${this.icon}'></p-icon>` : html`<span>${this.index}</span>`}
                    </span>
                </div>
                <div part='step-content'>
                    <div part='step-title'>
                        <slot name="step-title">${this.title}</slot>
                    </div>
                     <div part='step-description'><slot name='step-description'>${this.description}</slot></div>
                </div>
                <slot></slot>
        </div>`;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'p-steps': PSteps;
        'p-step': PStep;
    }
}
