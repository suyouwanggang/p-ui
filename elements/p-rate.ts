import { css, customElement, html, LitElement, property } from 'lit-element';
import './p-tips';
import './p-icon';
import PTips from './p-tips';

@customElement('p-rate')
export default class PRate extends LitElement {
    @property({ type: Boolean, reflect: true }) disabled: boolean = false;
    @property({ type: String, reflect: true }) icon: string = 'star-fill';
    @property({ type: String, reflect: true }) checkColor: string = undefined;
    @property({ type: Boolean, reflect: true }) hover: boolean = false;
    @property({ type: String, reflect: true }) color: string = undefined;
    @property({ type: Number, reflect: true }) size: number = undefined;
    @property({ type: Number, reflect: true }) number: number = 5;
    @property({ type: Number, reflect: true }) value: number = 0;
    @property({ type: Array, reflect: true }) tipString: Array<String> = undefined;// ['terrible','bad','normal','good','wonderful'];
    static get styles() {
        return css`
        :host {
            display:inline-block;
        }
        :host div{
            display:inline-flex;
            color:#eee;
            font-size:20px;
        }
        :host([disabled]) p-tips{
            cursor:default;
            opacity:0.8;
            pointer-events:none;
        }
        p-tips{
            margin:auto 4px;
        }
         p-tips.mouseSelect {
            color: var(--themeColor,#42b983);
            transition:transform 0.3 ;
        }
        p-tips p-icon{
            cursor:pointer;
        }
        :host([disabled]) p-tips,
        :host([disabled])  p-icon{
            pointer-events:none;
            cursor:default;
        }`;
    }
    firstUpdated(changeMap: Map<string | number | symbol, unknown>) {
    }
    _hoverStar(ev: MouseEvent) {
        if (!this.hover) {
            return;
        }
        // tslint:disable-next-line: no-any
        let el: any = ev.target as any;
        if (!(el instanceof PTips)) {
            el = el.closest('p-tips');
        }
        const div = this.renderRoot.querySelector('#rate');
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
    _leaveStar(ev: MouseEvent) {
        if (!this.hover) {
            return;
        }
        const div = this.renderRoot.querySelector('#rate');
        // tslint:disable-next-line: no-any
        const array: PTips[] = [...div.querySelectorAll('p-tips') as any];
        // tslint:disable-next-line: no-any
        for (let i = 0, j = array.length; i < j; i++) {
            const el = array[i] ;
            // tslint:disable-next-line: no-any
            if (this.value > (el as any).value) {
                el.classList.add('mouseSelect');
            } else {
                el.classList.remove('mouseSelect');
            }
        }
    }
    _click(ev: Event) {
        // tslint:disable-next-line: no-any
        let el: any = ev.target as any;
        if (!(el instanceof PTips)) {
            el = el.closest('p-tips');
        }
        this.value = el.value + 1;
    }
    render() {
        return html`<div id='rate'  @mouseleave=${this._leaveStar}>
            ${Array.from({ length: this.number }).map((item, index) => {
            return html`<p-tips  @click='${this._click}' dir='bottom' @mouseenter=${this._hoverStar}  .value=${index} class=${this.value > index ? 'mouseSelect' : ''}  .tips=${this.tipString && this.tipString.length > index ? this.tipString[index] : ''}>
                    <p-icon  .name=${this.icon} .size=${this.size} .color=${this.value > index ? this.checkColor : this.color}></p-icon>
                    </p-tips>`
        })}<slot></slot></div>
        `;
    }
}

