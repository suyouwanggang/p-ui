import { css, customElement, html, LitElement, property, PropertyValues, TemplateResult } from 'lit-element';
import PButton from '../button/index';
import '../icon/index';
import styleObj from './index.scss';

@customElement('p-page-btn')
export default class PPageBtn extends LitElement {
    static get styles() {
        return styleObj;
    }
    @property({ type: Number, reflect: true }) value = 1;
    @property({ type: Number, reflect: true }) pagesize = 20;
    @property({ type: Boolean, reflect: true }) simple = false;
    @property({ type: Number, reflect: true }) total: number = undefined;
    get pageCount() {
        return Math.ceil(this.total / this.pagesize);
    }

    _renderSimple() {
        return html`<p-button class="simple-page" tabindex="-1" type="flat">${this.value} / ${this.pageCount}</p-button>`;
    }
    _renderPage() {
        let place: Array<number | string>;
        const pageCount = this.pageCount;
        const current = this.value;
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
            const pbutton = html`<p-button ?disabled=${!isNumber} @click=${this._pageBtnHander} data-current=${isNumber && temp === this.value} data-pageNo=${isNumber ? temp : ''} type='flat'>${isNumber ? temp : '...'}</p-button>`;
            result.push(pbutton);
        });
        return result;
    }
    dispatchChange() {
        this.dispatchEvent(new CustomEvent('page-change', {
            bubbles: true,
            detail: {
                current: this.value,
                pagesize: this.pagesize,
                total: this.total
            }
        }));
    }
    _pageBtnHander(ev: Event) {
        const button: PButton = (ev.target as PButton);
        if (button) {
            const pageNo = Number(button.dataset['pageno']);
            if (!isNaN(pageNo)) {
                const change=pageNo-this.value;
                this.changePageNum(change);
            }
        }
    }
    
    changePageNum(addOrDel: number) {
        const toValue = this.value + addOrDel;
        if (toValue <= 0 || toValue > this.pageCount) {
            return ;
        }
        if (this.dispatchEvent(new CustomEvent('before-page-change', {
            cancelable: true,
            bubbles: true,
            detail: {
                current: this.value,
                toPage: toValue,
                pagesize: this.pagesize,
                total: this.total
            }
        }))) {
            this.value = toValue;
            this.dispatchChange();
            this.updateComplete.then(()=>{
                const selector = `#page p-button[data-pageNo='${this.value}'] `;
                const currentButton: PButton = this.renderRoot.querySelector(selector);
                if (currentButton) {
                    currentButton.focus();
                }
            })
        }

    }
    firstUpdated() {
        this.addEventListener('keydown', (ev) => {
            switch (ev.keyCode) {
                case 37: //ArrowLeft
                    this.changePageNum(-1);
                    break;
                case 39: //ArrowRight
                    this.changePageNum(1);
                    break;
                default:
                    break;
            }
        });
    }
    _pagePreHanlder() {
        this.changePageNum(-1);
    }
    _pageNextHanlder() {
        this.changePageNum(1);
    }
    render() {
        return html`
         <p-button type="flat" id="left" ?disabled=${this.value <= 1} @click=${this._pagePreHanlder}  >
            <svg class="icon" viewBox="0 0 1024 1024"><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8c-16.4 12.8-16.4 37.5 0 50.3l450.8 352.1c5.3 4.1 12.9 0.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path></svg>
        </p-button>
        <div class="page" id="page">
            ${this.simple ? this._renderSimple() : this._renderPage()}
        </div>
        <p-button type="flat" id="right"  ?disabled=${this.value >= this.pageCount} @click=${this._pageNextHanlder}>
            <svg class="icon" viewBox="0 0 1024 1024"><path d="M765.7 486.8L314.9 134.7c-5.3-4.1-12.9-0.4-12.9 6.3v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1c16.4-12.8 16.4-37.6 0-50.4z"></path></svg>
        </p-button>
        `;
    }
}
