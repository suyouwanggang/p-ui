import { css, customElement, html, LitElement, property, svg } from 'lit-element';
import { cache } from 'lit-html/directives/cache';
import './p-button';
import { PInput } from './p-input';
import './p-pop';
import { Ppop, PPopContent } from './p-pop';
import './p-tips';
@customElement('p-option-group')
class POptionGroup extends LitElement {
    static get styles() {
        return css`:host{
            display: contents;
        }
        .group{
            line-height:2;
            padding:0.2em .625em;
            opacity:.6;
            font-size: .9em;
        }
        ::slotted(p-option){
            --paddingLeft:1em;
        }`;
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
    @property({ type: String, reflect: true }) value: string;
    @property({ type: Boolean, reflect: true }) selected: boolean;
    @property({ type: Boolean, reflect: true }) disabled: boolean;
    static get styles() {
        return css`
        :host{
             display: block;
        }
        .option {
            display: flex;
            justify-content: flex-start;
            border-radius:0;
            font-size: inherit;
            padding-left:var(--paddingLeft,.625em);
        }
        .option:active{
            transform:translateY(0);
        }
        :host([focusin]){
            background-color: var(--option-hover-color, #ECF8F3 );
            color:var(--themeColor,#42b983);
        }
        :host([selected]) {
            color:var(--themeColor,#42b983);
            background-color:var(--option-select-color,#D9F1E6);
        }
    `;
    }

    render() {
        return html`
            <p-button part="option" id="option" class="option" type="flat" ?disabled=${this.disabled}>
                ${this.label ? html`<span >${this.label}</span>` : ''}
                <slot></slot>
            </p-button>
        `;
    };
    get option(): HTMLElement {
        return this.renderRoot.querySelector('#option');
    }
    foucs() {
        return this.option.focus();
    }

}


@customElement('p-select')
class PSelect extends LitElement {
    @property({ type: String, reflect: true }) value: string;
    @property({ type: String, reflect: true }) name: string;
    @property({ type: String, reflect: true }) type: string;
    @property({ type: Boolean, reflect: true }) search: boolean;
    @property({ type: Boolean, reflect: true }) required: boolean;
    @property({ type: Boolean, reflect: true }) disabled: boolean;
    static get styles() {
        return css`
        :host{
             display: inline-block;
        }
        :host([block]){
             display: block;
        }
        :host([disabled]){
            pointer-events:none;
        }
        :host(:not([disabled]):not([type="primary"]):focus-within) #input,
        :host(:not([disabled]):not([type="primary"]):hover) #input{
            border-color:var(--themeColor,#42b983);
            color:var(--themeColor,#42b983);
        }

        :host([search]:focus-within:not([disabled])) #input, 
        :host([search]:not([disabled]):hover) #input{
            color: var(--themeColor,#42b983);
        }
        p-tips{
            display:block;
            width: 100%;
            height:2em;
        }
        #input:not([type="primary"]){
            display:flex;
            width:100%;
            height:100%;
            font-size: inherit;
            color: currentColor;
        }
        :host([search]) #input{
            color:currentColor;
        }
        p-tips[show=show]{
            --themeColor:var(--errorColor,#f4615c);
            --borderColor:var(--errorColor,#f4615c);
        }
        :host([invalid]) #input:not([type="primary"]){
            color:var(--errorColor,#f4615c);
        }
        #input span{
            flex:1;
            text-align:left;
        }
        #input::after{
            content:'';
            position:absolute;
            left:0;
            top:0;
            right:0;
            bottom:0;
            cursor:default;
            pointer-events:none;
        }
        #input[readonly]::after{
            pointer-events:all;
        }
        :host(:focus-within) p-pop-content,:host(:active) p-pop-conten{ 
            z-index: 2;
        }
        .option {
            display: flex;
            justify-content: flex-start;
            border-radius:0;
            font-size: inherit;
            padding-left:var(--paddingLeft,.625em);
        }
        .arrow{
            position:relative;
            font-size:.9em;
            transform:scaleY(.8);
            margin-left:.5em;
            pointer-events:none;
            width:1em;
            height:1em;
            fill:currentColor;
            transition:.3s transform cubic-bezier(.645, .045, .355, 1);
        }
        :host([search]) .arrow{
            transition:color .3s  cubic-bezier(.645, .045, .355, 1),.3s transform cubic-bezier(.645, .045, .355, 1);
        }
        p-pop{
            display:block;
            min-width:100%;
            height:inherit;
        }
        p-pop#pop[open] .arrow{
            transform:scaleY(-.8);
        }
        p-pop-content{
            min-width:100%;
            overflow:auto;
            max-height:50vh;
            scroll-behavior: smooth;
        }
        p-pop-content::part(popBody){
            min-width:100%; 
        }
        :host([search]) p-pop-content::before{
            display:none;
            box-sizing: border-box;
            width:100%;
            content:'没有匹配到任何选项';
            padding: .25em .625em;
            line-height: 1.8;
            color:var(--fontColor,#333);
            white-space:nowrap;
            opacity:.5;
        }
        /***search 结果为空  */
        :host([empty]) p-pop-content::before{
            display:block;
        }
    `;
    }
    private renderTrigger() {
        const svgHRednder = svg`<svg class="arrow" viewBox="0 0 1024 1024"><path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3 0.1-12.7-6.4-12.7z"></path></svg>`;
        if (this.search) {
            return html`<p-input id="input" type='text' debounce=200 readOnly ?disabled=${this.disabled}>${svgHRednder}</p-input>`;
        } else {
            return html`<p-button id="input" ?disabled=${this.disabled} .type=${this.type}><span id="value"></span>${svgHRednder}</p-button>`;
        }
    }
    render() {
        return html`
            <p-pop id="pop" >
                 <p-tips id='tip'>
                    ${cache(this.renderTrigger())}
                 </p-tips>
                <p-pop-content id="optionCotent" hiddenClose thinBar >
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
    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(_changedProperties);
        if (this.value !== undefined) {
            this.optionNodes = [...this.querySelectorAll('p-option:not([disabled]):not([hidden])') as any];
            const currentOption: POption = this.optionNodes.find((opt) => {
                return opt.value === this.value;
            });
            if (currentOption) {
                currentOption.selected = true;
                this.focusInOptionIndex = this.optionNodes.indexOf(currentOption);
            }
        } else {
            this.optionNodes.forEach((opt, index) => {
                if (opt.selected) {
                    this.value = opt.value;
                    this.focusInOptionIndex = index;
                }
            });
        }
        const optionTab = this.optionCotent;
        optionTab.addEventListener('open', (ev: CustomEvent) => {
            this.renderRoot.querySelector('#pop').setAttribute('open','');
            if (this.search) {
                const input: PInput = this.renderRoot.querySelector('#input');
                input.value = '';
                input.readOnly = false;
                input.focus();
            }
        });
        optionTab.addEventListener('close',(ev: CustomEvent) => {
            this.renderRoot.querySelector('#pop').removeAttribute('open');
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
                optionTab.open = false;
                this.dispatchChangeSelectEvent();
            }
        });

        const pop = this.pop;
        this.addEventListener('keydown', (ev: KeyboardEvent) => {
            if (optionTab.open) { //下级内容打开的时候
                const keycode = ev.keyCode;
                console.log('keycode=='+keycode);
                switch (keycode) {
                    case 9: //Tab
                        ev.preventDefault();
                        break;
                    case 38: //Up
                        ev.preventDefault();
                        this.move(-1);
                        break;
                    case 40: //Down
                        ev.preventDefault();
                        this.move(1);
                        break;
                    case 27: //Esc
                        optionTab.open = false;
                        ev.preventDefault();
                        break;
                    default:
                        break;
                }
            } else {
                switch (ev.keyCode) {
                    case 38: //ArrowUp
                        ev.preventDefault();
                        this.movein(-1);
                        break;
                    case 40: //ArrowDown
                        ev.preventDefault();
                        this.movein(1);
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
    update(changedProperties: Map<string | number | symbol, unknown>) {
        super.update(changedProperties);
        if (this.isConnected && changedProperties.has('value') && this.value !== undefined) {
            const value = this.value;
            const childOption: POption[] = [...this.querySelectorAll('p-option') as any];
            childOption.forEach((item: POption, index) => {
                if (item.value === value) {
                    item.selected = true;
                    item.setAttribute('focusin', '');
                    this.renderRoot.querySelector('span#value').textContent = item.textContent;
                } else {
                    item.selected = false;
                    item.removeAttribute('focusin');
                }
            });
        }
    }
    private optionNodes: POption[] = null;
    private focusInOptionIndex: number = -1;
    private selectOption: POption = undefined;
    private move(changeIndex: number) {
        if (this.optionNodes != null && this.optionNodes.length > 0) {
            let index = this.focusInOptionIndex + changeIndex;
            if (changeIndex > 0 && index > this.optionNodes.length) {
                index = this.optionNodes.length - 1;
            } else if (changeIndex < 0 && index < 0) {
                index = 0;
            }
            this.focusInOptionIndex = index;
            this.setFocuseInOption();
        }
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
    private setFocuseInOption() {
        if (this.optionNodes != null && this.optionNodes.length > 0) {
            this.optionNodes.forEach((item, index) => {
                if (index === this.focusInOptionIndex) {
                    item.setAttribute('focusin', '');
                    item.scrollIntoView({
                        block: 'nearest'
                    });
                    this.value=item.value;
                } else {
                    item.removeAttribute('focusin');
                }
                this.dispatchChangeSelectEvent();
            });
        }
    }
    // private setSelectByFocuseInOption(){
    //     if (this.optionNodes != null && this.optionNodes.length > 0) {
    //         this.value=this.optionNodes[this.focusInOptionIndex].value;
    //     }
    // }
    private setToSelectOption(selectOption: POption): void {
        this.value = selectOption.value;
    }
    private movein(changeIndex: number) {
        if (this.optionNodes != null && this.optionNodes.length > 0) {
            let index = this.focusInOptionIndex + changeIndex;
            if (changeIndex > 0 && index > this.optionNodes.length) {
                index = this.optionNodes.length - 1;
            } else if (changeIndex < 0 && index < 0) {
                index = 0;
            }
            this.focusInOptionIndex = index;
            const current: POption = this.optionNodes[index];
            if(current){
                this.setToSelectOption(current);
            }
            this.dispatchChangeSelectEvent();
        }
    }

}

