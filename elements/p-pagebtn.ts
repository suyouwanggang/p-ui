import { LitElement, customElement, html, css, property, TemplateResult } from 'lit-element';
import { } from './p-icon';
import PButton, { } from './p-button';

@customElement('p-page-btn')
export default class PPageBtn extends LitElement {
    static get styles() {
        return css`
         :host {
            display:flex;
            font-size:14px;
        }
        p-button {
            margin: 0 .3em;
            width: 2.3em;
            height: 2.3em;
            padding: 1px;
            font-size: inherit;
            box-sizing: content-box;
        }
        .simple-page{
            width:auto;
            padding:0 .625em;
        }
        p-button[tabindex]{
            justify-content: center;
            align-items: center;
            pointer-events: none;
        }
        p-button:not([disable]){
            cursor:pointer;
        }
        .page-ellipsis p-icon{
            margin:auto;
        }
        p-button[current] {
            background: var(--themeBackground,var(--themeColor,#42b983));
            border-color: var(--themeColor,#42b983);
            color:#fff;
        }
        .page{
            display:inline-flex;
        }
        .icon{
            width:1em;
            height:1em;
            fill: currentColor;
        }
        `;

    }
    @property({ type: Number, reflect: true }) current = 1;
    @property({ type: Number, reflect: true }) pagesize = 20;
    @property({ type: Boolean, reflect: true }) simple = false;
    @property({ type: Number, reflect: true }) total: number = undefined;
    get pageCount() {
        return Math.ceil(this.total / this.pagesize);
    }

    _renderSimple() {
        return html`<p-button class="simple-page" tabindex="-1" type="flat">${this.current} / ${this.pageCount}</p-button>`;
    }
    _renderPage() {
        let place: Array<number | string>;
        const pageCount = this.pageCount;
        const current = this.current;
        if (pageCount > 9) {
            if (current <= 5) {
                place = [1, 2, 3, 4, 5, 6, 7, 'next', pageCount];
            } else if (current >= pageCount - 4) {
                place = [1, 'pre', pageCount - 6, pageCount - 5, pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
            } else {
                place = [1, 'pre', current - 2, current - 1, current, current + 1, current + 2, 'next', pageCount];
            }
        } else {
            place = Array.from({ length: pageCount - 1 }, (el, i) => i + 1);
        }
        const result: Array<TemplateResult> = [];
        place.forEach((temp, index) => {
            const isNumber = typeof temp === 'number';
            const pbutton = html`<p-button ?disabled=${!isNumber}  ?current=${isNumber && temp === this.current} pageNo=${isNumber ? temp : ''} type='flat'>${isNumber ? temp : '...'}</p-button>`;
            result.push(pbutton);
        });
        return result;
    }
    dispatchChange(){
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                current: this.current,
                pagesize: this.pagesize,
                total: this.total,
            }
        }));
    }
    firstUpdated() {
        const page = this.renderRoot.querySelector('#page');
        page.addEventListener('click', (ev: Event) => {
            const button: PButton = (ev.target as PButton).closest('p-button');
            if (button) {
                this.current = Number(button.getAttribute('pageNo'));
                this.dispatchChange();
            }
        });
        this.addEventListener('keydown', (ev) => {
            switch (ev.keyCode) {
                case 37://ArrowLeft
                    this.current--;
                    this.dispatchChange();
                    break;
                case 39://ArrowRight
                    this.current++;
                    this.dispatchChange();
                    break;
                default:
                    break;
            }
        });

        const left = this.renderRoot.querySelector('#left');
        left.addEventListener('click', (ev: any) => {
            this.current--;
            this.dispatchChange();
        });
        const right = this.renderRoot.querySelector('#right');
        right.addEventListener('click', (ev: any) => {
            this.current++;
            this.dispatchChange();
        });
    }
    updated(changedProperties: Map<string | number | symbol, unknown>) {
        if ( this.hasUpdated && this.renderRoot) {
            const currentOld = this.current;
            const current = Math.min(Math.max(1, this.current), this.pageCount);
            this.current = current;
            const selector = `#page p-button[pageNo='${this.current}'] `;
            const currentButton: PButton = this.renderRoot.querySelector(selector);
            if (currentButton !== null) {
                currentButton.focus();
            }
        }
        super.updated(changedProperties);
    }

    render() {
        return html`
         <p-button type="flat" id="left" ?disabled=${this.current === 1} >
            <svg class="icon" viewBox="0 0 1024 1024"><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8c-16.4 12.8-16.4 37.5 0 50.3l450.8 352.1c5.3 4.1 12.9 0.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path></svg>
        </p-button>
        <div class="page" id="page">
            ${this.simple ? this._renderSimple() : this._renderPage()}
        </div>
        <p-button type="flat" id="right"  ?disabled=${this.current === this.pageCount}>
            <svg class="icon" viewBox="0 0 1024 1024"><path d="M765.7 486.8L314.9 134.7c-5.3-4.1-12.9-0.4-12.9 6.3v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1c16.4-12.8 16.4-37.6 0-50.4z"></path></svg>
        </p-button>
        `;
    }
}
