import { css, customElement, html, LitElement, property, query } from 'lit-element';
import './p-button';
import './p-pop';
import './p-tips';
import { PInput } from './p-input';
import { ifDefined } from 'lit-html/directives/if-defined';
import { Ppop, PPopContent } from './p-pop';
@customElement('p-option-group')
class POptionGroup extends LitElement {
    static get styles() {
        return css`:host{
            display: contents;
        }
        .group{
            line-height:2;
            padding:0 .625em;
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
        <slot></slot>`;
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
        :host([selected]) .option{
            color:var(--themeColor,#42b983)
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
    @property({ type: String, reflect: true }) selectDir: string;
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
        :host([selected]) .option{
            color:var(--themeColor,#42b983)
        }
    `;
    }

    render() {
        return html`
            <p-pop id="pop" dir=${ifDefined(this.selectDir)} >
                 <p-tips id='tip'>
                    ${this.search ? html`<p-input id="input" type='text' debounce=200 readonly ?disabled=${this.disabled}></p-input>`
                : html`<p-button ?disabled=${this.disabled}><span id="value"></span></p-button>`}
                 </p-tips>
                <p-pop-content id="optionCotent">
                    <slot id="slot"></slot>
                </p-pop-content>
            </p-pop>
        `;
    };


    get optionCotent(): PPopContent {
        return this.renderRoot.querySelector('#optionCotent');
    }
    get pop(): Ppop {
        return this.renderRoot.querySelector('#pop');
    }
    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(_changedProperties);
        if (this.value !== undefined) {
            const currentOption: POption = this.optionNodes.find((opt) => {
                return opt.value === this.value;
            });
            if (currentOption) {
                currentOption.selected = true;
                this.focusIndex = this.optionNodes.indexOf(currentOption);
            }
        } else {
            this.optionNodes.forEach((opt, index) => {
                if (opt.selected) {
                    this.value = opt.value;
                    this.focusIndex = index;
                }
            });
        }
        const optionTab = this.optionCotent;
        optionTab.addEventListener('open', (ev: CustomEvent) => {
            if (this.search) {
                const input: PInput = this.renderRoot.querySelector('#input');
                input.value = '';
                input.readOnly = false;
            }
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
            }
        });

        const pop = this.pop;
        this.addEventListener('keydown', (ev: KeyboardEvent) => {
            if (optionTab.open) {
                const keycode = ev.keyCode;
                switch (keycode) {
                    case 9: //Tab
                        ev.preventDefault();
                        break;
                    case 38: //Up
                        ev.preventDefault();
                        break;
                    case 40: //Down
                        ev.preventDefault();
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
                    case 38://ArrowUp
                        ev.preventDefault();
                        this.movein(-1);
                        break;
                    case 40://ArrowDown
                        ev.preventDefault();
                        this.movein(1);
                        break;
                    default:
                        break;
                }
            }
        });
    }
    update(changedProperties: Map<string | number | symbol, unknown>) {
        super.update(changedProperties);
        if (this.isConnected && changedProperties.has('value') && this.value !== undefined) {
            const value = this.value;
            const childOption: POption[] = [...this.querySelectorAll('p-option') as any];
            childOption.forEach((item, index) => {
                if (item.value === value) {
                    item.selected = false;
                } else {
                    item.selected = false;
                }
            });
        }
    }
    private get optionNodes(): POption[] {
        return [...this.querySelectorAll('p-option:not([disabled])') as any];
    }
    private focusIndex: number = -1;
    move(dir: number) {
        const pre = this.optionNodes[this.focusIndex];
        const focusIndex = dir + this.focusIndex;
        const current = this.optionNodes[focusIndex];
        if (current) {
            if (pre) {

            }

            this.focusIndex = focusIndex;
        }
    }

    movein(dir) {
        this.focusIndex = dir + this.focusIndex;
        if (this.focusIndex < 0) {
            this.focusIndex = this.nodes.length - 1;
        }
        if (this.focusIndex === this.nodes.length) {
            this.focusIndex = 0;
        }
        this.nativeclick = true;
        this.value = this.nodes[this.focusIndex].value;
    }

}

