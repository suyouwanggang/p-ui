import { css, customElement, html, LitElement, property } from 'lit-element';
import '../icon/index';
import PTips from '../tips/index';
import RateStyleObj from './style.scss';
/**
 * @event change 
 */
@customElement('p-rate')
export default class PRate extends LitElement {
    @property({ type: Boolean, reflect: true }) disabled: boolean = false;
    @property({ type: String, reflect: true }) icon: string = 'star-fill';
    @property({ type: String, reflect: true }) onColor: string = undefined;
    @property({ type: String, reflect: true }) offColor: string = undefined;
    @property({ type: Boolean, reflect: true }) hoverable: boolean = false;
    @property({ type: Number, reflect: true }) size: number = undefined;
    @property({ type: Number, reflect: true }) number: number = 5;
    @property({ type: String, reflect: true }) name: string = undefined;
    @property({ type: Number, reflect: true }) value: number = 0;
    @property({ type: Array, reflect: true }) tipStrings: string[] = undefined;// ['terrible','bad','normal','good','wonderful'];
    static get styles() {return RateStyleObj;    }
    _hoverRate(ev: MouseEvent) {
        if (!this.hoverable || this.disabled) {
            return;
        }
        // tslint:disable-next-line: no-any
        let el: any = ev.target as any;
        const div = this.renderRoot.querySelector('#rate');
        // tslint:disable-next-line: no-any
        const array: PTips[] = [...div.querySelectorAll('p-tips') as any];
        const index = array.indexOf(el);
        for (let i = 0, j = array.length; i < j; i++) {
            if (i <= index) {
                array[i].classList.add('mouseSelect');
            } else {
                array[i].classList.remove('mouseSelect');
            }
        }
    }
    _leaveRate(ev: MouseEvent) {
        if (!this.hoverable || this.disabled) {
            return;
        }
        const div = this.renderRoot.querySelector('#rate');
        // tslint:disable-next-line: no-any
        const array: PTips[] = [...div.querySelectorAll('p-tips') as any];
        // tslint:disable-next-line: no-any
        for (let i = 0, j = array.length; i < j; i++) {
            const el = array[i];
            // tslint:disable-next-line: no-any
            
            if (this.value > (Number(el.dataset['value']))) {
                el.classList.add('mouseSelect');
            } else {
                el.classList.remove('mouseSelect');
            }
        }
    }
    _click(ev: Event) {
        // tslint:disable-next-line: no-any
        let el = ev.target as HTMLElement;
        if (!(el instanceof PTips)) {
            el = el.closest('p-tips');
        }
        const old =Number(el.dataset['value']);
        this.value = old + 1;
        this.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            detail: {
                old: old,
                value: this.value
            }
        }));
    }
    render() {
        return html`<div id='rate'  @mouseleave=${this._leaveRate}>
            ${Array.from({ length: this.number }).map((item, index) => {
            return html`<p-tips  @click='${this._click}' dir='bottom' @mouseenter=${this._hoverRate}  data-value=${index} class=${this.value > index ? 'mouseSelect' : ''}  .tips=${this.tipStrings && this.tipStrings.length > index ? this.tipStrings[index] : ''}>
                    <p-icon  .name=${this.icon} .size=${this.size} ></p-icon>
                    </p-tips>`
        })}<slot></slot></div>
        `;
    }
    update(changedProperties: Map<string | number | symbol, unknown>) {
        super.update(changedProperties);
        if (changedProperties.has('offColor')) {
            if (this.offColor) {
                this.style.setProperty('--rate-off-color', this.offColor);
            } else {
                this.style.removeProperty('--rate-off-color');
            }
        }
        if (changedProperties.has('onColor')) {
            if (this.onColor) {
                this.style.setProperty('--rate-on-color', this.onColor);
            } else {
                this.style.removeProperty('--rate-on-color');
            }
        }

    }

}

