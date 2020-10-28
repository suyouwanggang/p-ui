

import { css, customElement, html, LitElement, property, internalProperty } from 'lit-element';
import { } from '../icon';
import stylePSteps from './style.scss';
import style2Object from './style2.scss';
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
    static styles = stylePSteps;
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
        }

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
    static styles =style2Object;
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
