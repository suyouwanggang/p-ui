
import { LitElement, svg, html, customElement, property, css } from 'lit-element';
import ResizeObserver from 'resize-observer-polyfill';
import styleTextObj from './style.scss';
type typeString=''|'warning'|'error'|'success'|'code'|'mark';
@customElement('p-text')
export class PText extends LitElement {
    @property({ type: Number, reflect: true }) rows: number = undefined;
    @property({ type: Boolean, reflect: true }) draggable: false;
    @property({ type: Boolean, reflect: true }) mark: false;
    @property({ type: Boolean, reflect: true }) code: false;
    @property({ type: String, reflect: true }) type: typeString;
    private _truncated: boolean = false;
    static styles = styleTextObj;
    get truncated() {
        return this._truncated;
    }
    private _resizeObserver: ResizeObserver = null;
    firstUpdated() {
        const text = this.shadowRoot.getElementById('text');
        // this._resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        //     for (const entry of entries) {
        //         const { height } = entry.contentRect;
        //         this._truncated = text.scrollHeight > height;
        //     }
        // });
        this.draggable = this.draggable;
        if (this.draggable) {
            this.addEventListener('dragstart', (ev) => {
                ev.dataTransfer.setData('text', this.textContent);
            })
        }
        // this._resizeObserver.observe(text);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        // this._resizeObserver.unobserve(text);
        // this._resizeObserver = null;
    }
    render() {
        return html`<span id="text" style='${this.rows ? '--rows:' + this.rows : ''}'><slot></slot></span>`;
    }
}