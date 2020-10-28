import { customElement, html, LitElement, property, svg } from 'lit-element';
import { buttonTypeValue } from '../button/index';
import { PInput } from '../input';
import { Ppop, PPopContent } from '../pop/index';
import '../tips/index';
import GroupStyle from './group.scss';
import OptionStyle from './option.scss';
import SelectStyleObj from './select.scss';
type itemType = {
    item?: POption,
    index?: number
};
@customElement('p-option-group')
class POptionGroup extends LitElement {
    static get styles() {
        return GroupStyle;
    }
    @property({ type: String, reflect: true }) label: string;
    render() {
        return html` <div class="group">${this.label}</div>
        <slot></slot>
        `;
    }

}
@customElement('p-option')
class POption extends LitElement {
    @property({ type: String, reflect: true }) label: string;
    @property({ type: String, reflect: true }) key: string;
    @property({ type: String, reflect: true }) value: string;
    @property({ type: Boolean, reflect: true }) selected: boolean;
    @property({ type: Boolean, reflect: true }) hidden: boolean;
    @property({ type: Boolean, reflect: true }) disabled: boolean;
    static get styles() {
        return OptionStyle;
    }

    render() {
        return html`
            <p-button part="option" id="option" class="option" type="flat" ?disabled=${this.disabled}>
                ${this.label ? html`<span >${this.label}</span>` : ''}
                <slot></slot>
            </p-button>
        `;
    }
    get option(): HTMLElement {
        return this.renderRoot.querySelector('#option');
    }
    foucs() {
        return this.option.focus();
    }

}
@customElement('p-select')
class PSelect extends LitElement {
    @property({ type: String, reflect: true }) value: string = '';
    @property({ type: String, reflect: true }) name: string;
    @property({ type: String, reflect: true }) type: buttonTypeValue;
    @property({ type: String, reflect: true }) placeholder: string = '请选择';
    @property({ type: Boolean, reflect: true }) search: boolean;
    @property({ type: Boolean, reflect: true }) required: boolean;
    @property({ type: Boolean, reflect: true }) disabled: boolean;
    static get styles() {
        return SelectStyleObj;
    }
    private renderTrigger() {
        const svgHRednder = html`<svg class="arrow" viewBox="0 0 1024 1024"><path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3 0.1-12.7-6.4-12.7z"></path></svg>`;
        if (this.search) {
            return html`<p-input id="input" type='text'  @focusout=${this.focusOutHandler} @input=${this.inputHandler} .placeholder=${this.placeholder} debounce=200 readOnly ?disabled=${this.disabled}>${svgHRednder}</p-input>`;
        } else {
            return html`<p-button id="input" ?disabled=${this.disabled} .type=${this.type}><span id="value">${this.placeholder}</span>${svgHRednder}</p-button>`;
        }
    }
    render() {
        return html`
            <p-pop id="pop" >
                 <p-tips id='tip'>
                    ${this.renderTrigger()}
                 </p-tips>
                <p-pop-content id="optionCotent" part="optionCotent" hiddenClose thinBar >
                    <slot id="slot"></slot>
                </p-pop-content>
            </p-pop>
        `;
    }


    get optionCotent(): PPopContent {
        return this.renderRoot.querySelector('#optionCotent');
    }
    get pop(): Ppop {
        return this.renderRoot.querySelector('#pop');
    }
    private focusOutHandler(ev: Event) {
        this._setSelectItemValue();
    }
    private _resetInputValue() {
        const optionNodes = this.findChildOptions();
        optionNodes.forEach((item: POption, index: number) => {
            item.style.display = '';
        })
    }
    private inputHandler(ev: Event) {
        const input: PInput = ev.target as PInput;
        const value = input.value;
        const optionNodes = this.findChildOptions();
        let matchesItmes = false;
        optionNodes.forEach((item: POption, index: number) => {
            const key = item.key;
            if (value === '') {
                item.style.display = '';
                matchesItmes = true;
            } else {
                const matches = key === undefined ? item.textContent.indexOf(value) : key.indexOf(value);
                if (matches >= 0) {
                    item.style.display = '';
                    matchesItmes = true;
                } else {
                    item.style.display = 'none';
                }
            }
        })
        if (!matchesItmes) {

        }
    }
    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(_changedProperties);
        const optionNodes = this.findShowOption();
        if (this.value !== undefined) {
            const currentOption: POption = optionNodes.find((opt) => {
                return opt.value === this.value;
            });
            if (currentOption) {
                currentOption.selected = true;
            }
        }
        const optionTab = this.optionCotent;
        optionTab.addEventListener('open', (ev: CustomEvent) => {
            if (this.disabled) {
                return;
            }
            this.renderRoot.querySelector('#pop').setAttribute('open', '');
            if (this.search) {
                const input: PInput = this.renderRoot.querySelector('#input');
                input.value = '';
                input.readOnly = false;
                input.focus();
                this._resetInputValue();
            }
        });
        optionTab.addEventListener('close', (ev: CustomEvent) => {
            this.renderRoot.querySelector('#pop').removeAttribute('open');
            const input: PInput = this.renderRoot.querySelector('#input');
            input.readOnly = true;
        });
        optionTab.addEventListener('click', (ev: MouseEvent) => {
            this.focus();
            let el = ev.target as Node;
            if (el.nodeType === Node.TEXT_NODE) {//text
                el = el.parentElement;
            }
            const option: POption = (el as HTMLElement).closest('p-option');
            if (option) {
                this.value = option.value;
                this._setSelectItemValue();
                optionTab.open = false;
                this.dispatchChangeSelectEvent();
            }
        });

        const pop = this.pop;
        this.addEventListener('keydown', (ev: KeyboardEvent) => {
            if (optionTab.open && !this.disabled) { //下级内容打开的时候
                const keycode = ev.keyCode;
                // console.log('keycode=='+keycode);
                switch (keycode) {
                    case 9: //Tab
                        ev.preventDefault();
                        break;
                    case 38: //Up
                        ev.preventDefault();
                        this.move(false);
                        break;
                    case 40: //Down
                        ev.preventDefault();
                        this.move(true);
                        break;
                    case 13: //Enter
                    case 27: //Esc
                        optionTab.open = false;
                        ev.preventDefault();
                        this._resetInputValue();
                        break;
                    default:
                        break;
                }
            } else if(!this.disabled) {
                switch (ev.keyCode) {
                    case 38: //ArrowUp
                        ev.preventDefault();
                        this.movein(false);
                        break;
                    case 40: //ArrowDown
                        ev.preventDefault();
                        this.movein(true);
                        break;
                    default:
                        break;
                }
            }
        });
    }

    focus() {
        const input: HTMLElement = this.renderRoot.querySelector('#input');
        input.focus();
    }
    private _setSelectItemValue() {
        const value = this.value;
        const childOption: POption[] = [...this.querySelectorAll('p-option') as any];
        childOption.forEach((item: POption, index) => {
            if (item.value === value) {
                item.selected = true;
                item.setAttribute('focusin', '');
                const input = this.renderRoot.querySelector('#input');
                let text = item.getAttribute('text');
                if (text === null) {
                    text = item.textContent;
                }
                // tslint:disable-next-line: no-any
                (input as any).value = text;
                (input as any).placeholder = text;
                // tslint:disable-next-line: no-any
                (input as any).readOnly = true;
                const span = this.renderRoot.querySelector('span#value');
                if (span != null && span !== undefined) {
                    span.textContent = item.textContent;
                }
            } else {
                item.selected = false;
                item.removeAttribute('focusin');
            }
        });
    }
    update(changedProperties: Map<string | number | symbol, unknown>) {
        super.update(changedProperties);
        if (this.isConnected && changedProperties.has('value') && this.value !== undefined) {
            this._setSelectItemValue();
        }
    }
    private move(down: Boolean) {
        const childOption: POption[] = this.findShowOption();
        const result = this.findSelectedOption();
        const length = childOption.length;
        if (down) {
            if (result.item == null || result.item === undefined) {
                result.item = childOption[0];
                result.index = 0;
            }
            if (result.index === length - 1) {
                result.index = 0;
            } else if (result.index + 1 < length) {
                result.index = result.index + 1;
            }
        } else {
            if (result.item == null || result.item === undefined) {
                result.index = 0;
            } else if (result.index === 0) {
                result.index = length - 1;
            } else if (result.index - 1 >= 0) {
                result.index = result.index - 1;
            }
        }
        const option = childOption[result.index];
        this.value = option.value;
    }
    private findChildOptions(){
        return [...this.querySelectorAll('p-option:not([hidden])') as any];
    }
    private findShowOption() {
        const childOption: POption[] = this.findChildOptions().filter((item: POption) => {
            return item.style.display !== 'none';
        });
        return childOption;
    }
    private findSelectedOption() {
        const result = {} as itemType;
        const childOption = this.findShowOption();
        childOption.forEach((item: POption, index: number) => {
            if (item.value === this.value) {
                result.item = item;
                result.index = index;
            }
        })
        return result;
    }
    private dispatchChangeSelectEvent() {
        const changeEvent = new CustomEvent('change', {
            detail: {
                value: this.value
            }
        });
        this.dispatchEvent(changeEvent);
        const selectEvent = new CustomEvent('select', {
            detail: {
                value: this.value
            }
        });
        this.dispatchEvent(selectEvent);
    }
    private movein(down: Boolean) {
        this.move(down);
        if (this.value !== undefined) {
            this.dispatchChangeSelectEvent();
        }
    }

}

export default PSelect;
export { POption, POptionGroup };
