import { customElement, html, LitElement, property } from 'lit-element';
import '../pop/index';
import PColorPanel from '../color-panel/index';
import ColorStyleObj from './style.scss';
@customElement('p-color')
export default class PColor extends LitElement {
    static get styles() { return ColorStyleObj; }
    @property({ type: Boolean, reflect: true }) disabled: boolean = false;
    @property({ type: Boolean, reflect: true }) block: boolean = false;
    @property({ type: String, reflect: true }) value: string = '#ff0000';
    @property({ type: String, reflect: true }) dir: string = 'bottomleft';
    render() {
        return html`<p-pop id='popover' .dir=${this.dir}>
     <p-button class='color-btn' id="color-btn" style='--themeColor:${this.value};' ?disabled=${this.disabled}>
    </p-button>
    <p-pop-content id='popcon' hiddenClose>
        <div class='pop-footer'>
            <p-button autoclose>取消</p-button>
            <p-button type='primary' id='btn-submit' autoclose>确认</p-button>
        </div>
    </p-pop-content>
</p-pop>`;
    }

    firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(changedProperties);
        const popcon: HTMLElement = this.renderRoot.querySelector('#popcon');
        const colorBtn = this.renderRoot.querySelector('#color-btn');
        const btnSubmit: HTMLElement = this.renderRoot.querySelector('#btn-submit');
        colorBtn.addEventListener('click', (event: Event) => {
            if (this.colorPane === undefined) {
                this.colorPane = new PColorPanel();
                this.colorPane.value = this.value;
                popcon.insertBefore(this.colorPane, popcon.firstElementChild);
            }
        });
        btnSubmit.addEventListener('click', (event: Event) => {
            this.value = this.colorPane.copyValue;
            this.dispatchChangeEvent();
        });
        popcon.addEventListener('close', (event: Event) => {
            if (this.colorPane) {
                this.colorPane.value = this.value;
            }
        });
    }
    updated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(_changedProperties);
        if (_changedProperties.has('value') && this.colorPane !== undefined) {
            this.colorPane.value = this.value;
        }
    }
    private colorPane: PColorPanel = undefined;

    dispatchChangeEvent() {
        this.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            detail: {
                value: this.value
            }
        }));
    }
}