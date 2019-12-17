import { css, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { cache } from 'lit-html/directives/cache';
type selectDateType = 'date' | 'month' | 'year' | 'week';
type selectMode = 'date' | 'month' | 'year';
const toDateObj = (d: string | number | undefined | null) => {
    const date = d === undefined ? undefined : new Date(d);
    return date;
}
const toDate = (d: string | Date | number | undefined) => {
    const date = d instanceof Date ? d : new Date(d !== undefined ? d : +new Date());
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return [year, month, day];
};

const parseDate = (dateString: string | Date, type: selectDateType = 'date') => {

    const [year, month, day] = toDate(dateString);
    let value = '';
    switch (type) {
        case 'date':
            value = year + '-' + (month + '').padStart(2, '0') + '-' + (day + '').padStart(2, '0');
            break;
        case 'month':
            value = year + '-' + (month + '').padStart(2, '0');
            break;
        default:
            value = year + '';
            break;
    }
    return value;
};

@customElement('p-date-panel')
export default class PDatePanel extends LitElement {
    static get styles() {
        return css`
            :host{
                display:flex;
            }
            .date-pane{
                padding:.8em;
            }
            .date-head,.date-week{
                display:flex;
            }
            .date-switch{
                flex:1;
                margin: 0 .3em;
            }
            .date-switch[disabled]{
                opacity:1;
            }
            p-button {
                padding: 1px;
                font-size: inherit;
                box-sizing: content-box;
            }
            .icon{
                width:1em;
                height:1em;
                fill: currentColor; 
            }
            .prev,.next{
                width: 2.3em;
                height: 2.3em;
                transition:.3s;
            }
            .prev[hidden],.next[hidden]{
                visibility: hidden;
                opacity:0;
            }

            .date-week-item{
                flex:1;
                line-height: 2.4;
                text-align:center;
            }

            .date-body{
                display:grid;
                grid-template-columns: repeat(7, 1fr);
                grid-gap:.5em;
            }

            .date-button{
                position:relative;
                background:none;
                border: 0;
                padding: 0;
                color: var(--fontColor,#333);
                border-radius: var(--borderRadius,.25em);
                transition:background .3s,color .3s,opacity .3s,border-color .3s,border-radius .3s;
                display:inline-flex;
                align-items:center;
                justify-content: center;
                font-size: inherit;
                outline:0;
            }
            .date-button::before{
                content:'';
                position:absolute; 
                background:var(--themeColor,#42b983);
                pointer-events:none; 
                left:0; 
                right:0; 
                top:0; 
                bottom:0; 
                opacity:0; 
                transition:.3s;
                border: 1px solid transparent;
                z-index:-1;
                border-radius:inherit;
            }
            .date-button:not([disabled]):not([current]):not([select]):not([selectstart]):not([selectend]):hover,.date-button:not([disabled]):not([current]):not([select]):not([selectstart]):not([selectend]):focus{
                color:var(--themeColor,#42b983);
            }
            .date-button:not([disabled]):hover::before{
                opacity:.1 
            }
            .date-button:not([disabled]):focus::before{
                opacity:.2
            }

            .date-day-item{
                box-sizing:content-box;
                min-width: 2.3em;
                height: 2.3em;
                justify-self: center;
            }
            .date-button[other]{
                opacity:.6;
            }
            .date-button[disabled]{
                cursor: not-allowed;
                opacity:.6;
                background: rgba(0,0,0,.1);
                /*color:var(--errorColor,#f4615c);*/
            }
            .date-button[now]{
                color:var(--themeColor,#42b983);
            }
            .date-button[current]{
                background: var(--themeBackground,var(--themeColor,#42b983));
                color:#fff;
            }
            .date-button[select]:not([other]){
                color:#fff;
                background: var(--themeBackground,var(--themeColor,#42b983));
            }
            .date-button[selectstart]:not([other]),.date-button[selectend]:not([other]){
                color: #fff;
                border-color: var(--themeColor,#42b983);
                background: var(--themeBackground,var(--themeColor,#42b983));
            }
            .date-button[selectstart]:not([other])::after,.date-button[selectend]:not([other])::after{
                content:'';
                position: absolute;
                width: 0;
                height: 0;
                top: 50%;
                overflow: hidden;
                border: .3em solid transparent;
                transform: translate(0, -50%);
            }
            .date-button[selectstart]:not([other])::after{
                border-left-color: var(--themeColor,#42b983);
                right: 100%;
            }
            .date-button[selectend]:not([other])::after{
                border-right-color: var(--themeColor,#42b983);
                left: 100%;
            }
            .date-button[selectstart][selectend]:not([other])::after{
                opacity:0;
            }



            .date-con{
                position:relative;
            }
            .date-month,.date-year{
                position:absolute;
                display:grid;
                left:0;
                top:.8em;
                right:0;
                bottom:0;
                grid-gap:.5em;
            }
            .date-month{
                grid-template-columns: repeat(3, 1fr);
                grid-template-rows: repeat(4, 1fr);
            }
            .date-year{
                grid-template-columns: repeat(4, 1fr);
                grid-template-rows: repeat(5, 1fr);
            }
           

            .date-month-item,
            .date-year-item{
                display:flex;
                margin:auto;
                width: 100%;
                height: 100%;
            }
            .date-mode{
                opacity:0;
                visibility:hidden;
                z-index:-1;
                transition:.3s opacity,.3s visibility;
            }
            .date-mode.show{
                opacity:1;
                visibility:visible;
            }
            :host([range]) .date-button[current]{
                background: transparent;
                color:var(--themeColor,#42b983);
                border-color:var(--themeColor,#42b983);
            }
            
        `;
    }
    @property({ type: String, reflect: true }) type: string;
    @property({ type: String, reflect: true }) value: string = '';
    @property({ type: Boolean, reflect: true }) range: boolean;
    @property({ type: String, reflect: true }) min: string;
    @property({ type: String, reflect: true }) max: string;
    @property({ type: String, reflect: true }) mode: selectDateType='date'; //是选择时间 还是选择年月 还是选择年
    private _initalDated = false;
    render() {
        if (this._initalDated === false) {
            this.__firstDateValue();
            this._initalDated = true;
        }

        const dateStr = parseDate(this.defaultDateVale, 'month');
        return html`<div class='date-pane' id='date-pane'>
            <div class='date-head'>
                <p-button type="flat" class="prev" @click=${this.prevClick}>
                        <svg class="icon" viewBox="0 0 1024 1024"><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8c-16.4 12.8-16.4 37.5 0 50.3l450.8 352.1c5.3 4.1 12.9 0.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path></svg>
                </p-button>
                <p-button type="flat" class="date-switch">${dateStr}</p-button>
                <p-button type="flat" class="next" @click=${this.nextClick}>
                        <svg class="icon" viewBox="0 0 1024 1024"><path d="M765.7 486.8L314.9 134.7c-5.3-4.1-12.9-0.4-12.9 6.3v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1c16.4-12.8 16.4-37.6 0-50.4z"></path></svg>
                </p-button>
             </div>
            <div class='date-con' data-type='date'>
                <div class="date-mode date-date ${this._dateType === 'date'?'show':''} "  >
                    <div class="date-week">
                            <span class="date-week-item">日</span>
                            <span class="date-week-item">一</span>
                            <span class="date-week-item">二</span>
                            <span class="date-week-item">三</span>
                            <span class="date-week-item">四</span>
                            <span class="date-week-item">五</span>
                            <span class="date-week-item">六</span>
                     </div>
                 
                    <div class='date-body'>
                        <!--日期 6*7 -->
                        ${cache(this.renderDateBody())}
                    </div>
              </div>
              ${this.mode === 'date' || this.mode === 'month' ?
                html`
                <div class='date-mode date-month ${this._dateType === 'month'?'show':''} '   >
                     ${cache(this.renderMonthBody())}
                 </div>` : ''
             }
            <div class='date-mode date-year  ${this._dateType === 'year'?'show':''} '  >
                 ${cache(this.renderYearBody())}
            </div>
        </div>`;
    }
    private _dateType: string = undefined;
    private _dateYear: number = undefined;
    private _dateMonth: number = undefined;
    getMonths() {
        return ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    }
    private renderDateBody(): TemplateResult[] {
        const year = this._dateYear;
        const month = this._dateMonth;
        const result = [];
        const days = PDatePanel.getDays(year, month);
        for (let i = 0, j = days.length; i < j; i++) {
            const [_year,_month,_day] = days[i].split('-');
            result.push(html`<button class="date-button date-day-item" date-day="${days[i]}" @click=${this.selectDateClick} >${_day}</button>`);
        }
        return result;
    }
    private selectDateClick(ev: Event) {

    }
    private selectMonthClick(ev: Event) {

    }
    /**
     * 获取当前 年 月 看板
     * @param year 
     * @param month 
     */
    static getDays(year: number, month: number = 1) {
        const lastdays = new Date(year, month - 1, 0).getDate();
        const days = new Date(year, month, 0).getDate();
        const week = new Date(year, month - 1, 1).getDay();
        const prev = Array.from({ length: week }, (el, i) => (month === 1 ? year - 1 : year) + '-' + (month === 1 ? 12 : month - 1) + '-' + (lastdays + i - week + 1));
        const current = Array.from({ length: days }, (el, i) => year + '-' + month + '-' + (i + 1));
        const next = Array.from({ length: 42 - days - week }, (el, i) => (month === 12 ? year + 1 : year) + '-' + (month === 12 ? 1 : month + 1) + '-' + (i + 1));
        return [...prev, ...current, ...next];
    }

    private renderMonthBody(): TemplateResult[] {
        return this.getMonths().map((value: string, index: number) => {
            return html`<button class="date-button date-month-item"  data-month="${index}" @click='${this.selectMonthClick}' >${value}</button>`;
        });
    }
    private selectYearClick(ev: Event) {

    }
    private renderYearBody(): TemplateResult[] {
        const nv = this.defaultDateVale.getFullYear();
        const n = parseInt(String(nv/20));
        const year = n * 20;
        const result = [];
        for (let i = year,j=year+20;i<j; i++) {
            result.push(html`<button class="date-button date-year-item" data-year="${i}" @click=${this.selectYearClick} >${i}</button>`);
        }
        return result;
    }
    private prevClick(ev: Event) {

    }
    private nextClick(ev: Event) {
    }
    get dateValue() {
        if (this.value === '') {
            return null;
        } else {
            return toDateObj(this.value);
        }
    }
    get defaultDateVale() {
        let d = this.dateValue;
        if (d == null) {
            d = new Date();
        }
        return d;
    }
    private __firstDateValue() {
        let d = this.dateValue;
        if (d == null) {
            d = new Date();
        }
        this._dateMonth = d.getMonth() + 1;
        this._dateYear = d.getFullYear();
        this._dateType=this.mode;
        return d;
    }
    get maxDate() {
        return toDateObj(this.max);
    }
    get minDate() {
        return toDateObj(this.min);
    }
    firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(changedProperties);
    }

    dispatchChangeEvent() {

    }
}