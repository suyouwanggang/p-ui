import { css, customElement, html, LitElement, property,internalProperty, TemplateResult, query } from 'lit-element';
import PButton from '../button/index';
type selectDateType = 'date' | 'month' | 'year' | 'week';
type selectMode = 'date' | 'month' | 'year';
const toDateObj = (d: string | number | undefined | null) => {
    const date = d === undefined ? undefined : new Date(d);
    return date;
};
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
import StyleDatePanel from './style.scss';
@customElement('p-date-panel')
export default class PDatePanel extends LitElement {
    static get styles() {
        return StyleDatePanel;
    }
    @property({ type: String, reflect: true }) type: string;
    @property({ type: String, reflect: true }) value: string = '';
    @property({ type: Boolean, reflect: true }) range: boolean;
    @property({ type: String, reflect: true }) min: string;
    @property({ type: String, reflect: true }) max: string;
    @property({ type: String, reflect: true }) mode: selectMode = 'date'; //是选择时间 还是选择年月 还是选择年
    private _initalDated = false;

    get renderHeaderStr() {
        const date = this.defaultDateValue;
        if (this._dateType === 'date') {
            return date.getFullYear() + '年' + String(date.getMonth() + 1).padStart(2, '0') + '月';
        } if (this._dateType === 'month') {
            return date.getFullYear() + '年';
        } else {
            const nv = date.getFullYear();
            const n = parseInt(String(nv / 20));
            const year = n * 20;
            return year.toString().padStart(4, '0') + '年到' + (year + 20).toString().padStart(4, '0') + '年';
        }
    }

    render() {
        if (this._initalDated === false) {
            this.__resetDateValue();
            this._initalDated = true;
        }
        return html`
        <div class='date-pane' id='date-pane'>
            <div class='date-head'>
                <p-button type="flat" class="prev" @click=${this.prevClick} id="prevButton">
                        <svg class="icon" viewBox="0 0 1024 1024"><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8c-16.4 12.8-16.4 37.5 0 50.3l450.8 352.1c5.3 4.1 12.9 0.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path></svg>
                </p-button>
                <p-button type="flat" class="date-switch" @click=${this.dateSwitchClick}>${this.renderHeaderStr}</p-button>
                <p-button type="flat" class="next" @click=${this.nextClick} id="nextButton">
                        <svg class="icon" viewBox="0 0 1024 1024"><path d="M765.7 486.8L314.9 134.7c-5.3-4.1-12.9-0.4-12.9 6.3v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1c16.4-12.8 16.4-37.6 0-50.4z"></path></svg>
                </p-button>
            </div>
            <div class='date-con' data-type='date' >
                <div class="date-mode date-date ${this._dateType === 'date' ? 'show' : ''} "  >
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
                            ${this.renderDateBody()}
                        </div>
                    </div>
                ${this.mode === 'date' || this.mode === 'month' ?
                html`
                    <div class='date-mode date-month ${this._dateType === 'month' ? 'show' : ''} '   >
                        ${this.renderMonthBody()}
                    </div>` : ''
            }
                <div class='date-mode date-year  ${this._dateType === 'year' ? 'show' : ''} '  >
                    ${this.renderYearBody()}
                </div>
            </div>
        </div>`;
    }
    @internalProperty()
    private _dateType: selectDateType = undefined;
    @internalProperty()
    private _dateYear: number = undefined;
    @internalProperty()
    private _dateMonth: number = undefined;
    getMonths() {
        return ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    }
    private renderDateBody(): TemplateResult[] {
        const current = this.defaultDateValue;
        const [currentYear, currentMonth, currentDate] = toDate(current);
        const year = this._dateYear;
        const month = this._dateMonth;
        const result = [];
        let minDate = this.minDate;
        const maxDate = this.maxDate;
        const days = PDatePanel.getDays(year, month);
        for (let i = 0, j = days.length; i < j; i++) {
            const [_year, _month, _day] = days[i].split('-');
            const tempDate = toDateObj(days[i]);
            minDate = this.minDate;
            const disabled = (minDate != null && tempDate < minDate) || (maxDate != null && tempDate > maxDate);
            //console.log(`tempDate=${tempDate.toLocaleDateString()} minDate=${minDate?.toLocaleDateString()} maxDate=${maxDate?.toLocaleDateString()} disabled=${disabled}`)
            result.push(html`<button class="date-button date-day-item" ?other=${parseInt(_year) !== year || parseInt(_month) !== month} ?current=${parseInt(_year) === currentYear && parseInt(_month) === currentMonth && parseInt(_day) === currentDate}
            data-date="${days[i]}"
            ?disabled=${disabled}
            @click=${this.selectDateClick} >${tempDate.getDate()}</button>`);
        }
        return result;
    }
    private dateSwitchClick(ev: Event) {
        if (this._dateType === 'date') {
            this._dateType = 'month';
        } else if (this._dateType === 'month') {
            this._dateType = 'year';
        }
    }
    private  selectDateClick(ev: Event) {
        const button = ev.target as HTMLElement;
        const day = button.dataset.date;
        const date = new Date(day);
        this.setDateValue(date);
    }
    private selectMonthClick(ev: Event) {
        const button = ev.target as HTMLElement;
        const month = parseInt(button.dataset.month);
        let date = this.defaultDateValue;
        const year = date.getFullYear();
        date.setMonth(month);
        if (date.getMonth() > month) {
            const lastDate = new Date(year, date.getMonth(), 0); //月最后一天
            date = lastDate;
        }
        this.setDateValue(date);
        // this.updateComplete.then(() => {
        //     this._dateType = this.mode === 'date' ? 'date' : 'month';
        // });
    }
    private selectYearClick(ev: Event) {
        const button = ev.target as HTMLElement;
        const year = parseInt(button.dataset.year);
        const date = this.defaultDateValue;
        date.setFullYear(year);
        this.setDateValue(date);
        this.updateComplete.then(() => {
            this._dateType = this.mode === 'year' ? 'year' : 'month';
        });
    }
    /**
     * 获取当前 年 月 看板
     * @param year
     * @param month
     */
    static getDays(year: number, month: number = 1) {
        const date = new Date(year, month - 1, 1);
        const week = date.getDay();
        date.setDate(date.getDate() - week);
        const array: string[] = [];
        let i = 0;
        while (i < 42) {
            array.push(parseDate(date));
            date.setDate(date.getDate() + 1);
            i++;
        }
       // console.log(`${array}`);
        return array;
    }
    private setDateValue(d: Date) {
        const minDate = this.minDate;
        const maxDate = this.maxDate;
        if (maxDate != null && d > maxDate) {
            d = maxDate;
        }
        if (minDate != null && d < minDate) {
            d = minDate;
        }
        this.value = parseDate(d, this.mode);
        this.updateComplete.then(() => {
            this.dispatchChangeEvent();
        });
    }
    dispatchChangeEvent() {
        const event = new CustomEvent('change', {
            detail: {
                value: this.value,
                date: this.dateValue
            }
        });
        this.dispatchEvent(event);
    }
    private renderMonthBody(): TemplateResult[] {
        const current = this.defaultDateValue;
        const year = current.getFullYear();
        const minDate = this.minDate;
        const maxDate = this.maxDate;
        const currentMonth = current.getMonth();
        return this.getMonths().map((value: string, index: number) => {
            let disabled = minDate != null && (year < minDate.getFullYear() || (minDate.getFullYear() === year && index < minDate.getMonth()));
            if (!disabled) {
                disabled = maxDate != null && (year > maxDate.getFullYear() || (maxDate.getFullYear() === year && index > maxDate.getMonth()));
            }
            return html`<button class="date-button date-month-item"  ?current=${index === currentMonth} data-month="${index}" @click='${this.selectMonthClick}' ?disabled=${disabled} >${value}</button>`;
        });
    }
    private renderYearBody(): TemplateResult[] {
        const current = this.defaultDateValue;
        const nv = current.getFullYear();
        const n = parseInt(String(nv / 20));
        const year = n * 20;
        const result = [];
        const minDate = this.minDate;
        const maxDate = this.maxDate;
        for (let i = year, j = year + 20; i < j; i++) {
            let disabled = minDate != null && (i < minDate.getFullYear());
            if (!disabled) {
                disabled = maxDate != null && (i > maxDate.getFullYear());
            }
            result.push(html`<button class="date-button date-year-item" ?current=${i === nv} data-year="${i}"  @click=${this.selectYearClick} ?disabled=${disabled} >${i}</button>`);
        }
        return result;
    }
    /**
     * 处理设置 年，月，日，当日超过月最大天数， 则设置为最大天数
     * @param year
     * @param month 自然月
     * @param day
     */
    private static _fixedDay(year: number, month: number, day: number) {
        const len = new Date(year, month + 1, 0).getDate();
        day = day > len ? len : day;
        return new Date(year, month, day);
    }
    private prevClick(ev: Event) {
        const dateType = this._dateType;
        let date = this.defaultDateValue;
        const [year, month, day] = toDate(this.defaultDateValue);
        switch (dateType) {
            case 'date':
                date = PDatePanel._fixedDay(year, month - 2, day);
                break;
            case 'month':
                date = PDatePanel._fixedDay(year - 1, month - 1, day);
                break;
            case 'year':
                date = PDatePanel._fixedDay(year - 20, month - 1, day);
                break;
            default:
                break;
        }
        this.setDateValue(date);
        this.updateComplete.then(() => {
            this._dateType = dateType;
            //this._fixedPrexAndNextButton();
        });
    }
    private nextClick(ev: Event) {
        const dateType = this._dateType;
        let date = this.defaultDateValue;
        const [year, month, day] = toDate(this.defaultDateValue);
        switch (dateType) {
            case 'date':
                date = PDatePanel._fixedDay(year, month, day);
                break;
            case 'month':
                date = PDatePanel._fixedDay(year + 1, month - 1, day);
                break;
            case 'year':
                date = PDatePanel._fixedDay(year + 20, month - 1, day);
                break;
            default:
                break;
        }
        this.setDateValue(date);
        this.updateComplete.then(() => {
            this._dateType = dateType;
            //this._fixedPrexAndNextButton();
        });
    }
    @query('#prevButton')
    private _prevButton: PButton;
    @query('#nextButton')
    private _nextButton: PButton;
    private _fixedPrexAndNextButton() {
        const date = this.defaultDateValue;
        const dataType = this._dateType;
        const minDate = this.minDate;
        const maxDate = this.maxDate;
        if (minDate != null) {
            if (dataType === 'date') {
                this._prevButton.disabled = parseDate(minDate, 'month') >= parseDate(date, 'month');
            } else {
                this._prevButton.disabled = minDate.getFullYear() >= date.getFullYear();
            }
        }
        if (maxDate != null) {
            if (dataType === 'date') {
                this._nextButton.disabled = parseDate(maxDate, 'month') <= parseDate(date, 'month');
            } else {
                this._nextButton.disabled = maxDate.getFullYear() <= date.getFullYear();
            }

        }
    }
    get dateValue() {
        if (this.value === '') {
            return null;
        } else {
            return toDateObj(this.value);
        }
    }
    get defaultDateValue() {
        let d = this.dateValue;
        if (d == null || d.toString() === 'Invalid Date') {
            d = new Date(parseDate(new Date(), 'date'));
        }
        return d;
    }
    private __resetDateValue() {
        const d = this.defaultDateValue;
        this._dateMonth = d.getMonth() + 1;
        this._dateYear = d.getFullYear();
        this._dateType = this.mode;
        return d;
    }
    get maxDate() {
        return this.max !== undefined ? toDateObj(this.max) : null;
    }
    get minDate() {
        return this.min !== undefined ? toDateObj(this.min) : null;
    }
    firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(changedProperties);
    }
    update(changedProperties: Map<string | number | symbol, unknown>) {
        super.update(changedProperties);
        if (this.isConnected && (changedProperties.has('value') || changedProperties.has('mode'))) {
            this.__resetDateValue();
            if (this.dateValue != null) {
                this.value = parseDate(this.dateValue, this.mode);
            }
            this.updateComplete.then(() => {
                this.requestUpdate();
                this._fixedPrexAndNextButton();
            });
        }
    }
}