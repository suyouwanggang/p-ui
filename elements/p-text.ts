
import { LitElement, svg, html, customElement, property, css } from 'lit-element';
import ResizeObserver from 'resize-observer-polyfill';
type typeString=''|'warning'|'error'|'success'|'code'|'mark';
@customElement('p-text')
export class PText extends LitElement {
    @property({ type: Number, reflect: true }) rows: number = undefined;
    @property({ type: Boolean, reflect: true }) draggable: false;
    @property({ type: Boolean, reflect: true }) mark: false;
    @property({ type: Boolean, reflect: true }) code: false;
    @property({ type: String, reflect: true }) type: typeString;

    private _truncated: boolean = false;
    static styles = css`
       :host{
            font-size:inherit;
            display:inline-block;
            transition:.3s;
        }
        :host([type="warning"]){
            color:var(--waringColor,#faad14);
        }
        :host([type="error"]){
            color:var(--errorColor,#f4615c);
        }
        :host([type="success"]){
            color:var(--successColor,#52c41a);
        }
        :host([mark]){
            background:var(--waringColor,#faad14);
        }
        :host([code]){
            font-family: 'SFMono-Regular',Consolas,'Liberation Mono',Menlo,Courier,monospace;
            margin: 0 .2em;
            padding: .2em .3em;
            font-size: 85%;
            border-radius: .2em;
            background-color: #f8f8f8;
            color: #e96900;
        }
        :host([rows]){
            display:block;
        }
        :host([draggable]){
            cursor:default;
        }
        :host([rows]) span{
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: var(--rows,1);
            overflow: hidden;
        }
    `;
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
        const text = this.shadowRoot.getElementById('text');
        super.disconnectedCallback();
        // this._resizeObserver.unobserve(text);
        // this._resizeObserver = null;
    }
    render() {
        return html`<span id="text" style='${this.rows ? '--rows:' + this.rows : ''}'><slot></slot></span>`;
    }

}