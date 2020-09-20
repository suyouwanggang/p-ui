
import { css, customElement, html, LitElement, property } from 'lit-element';
import "../tips";
import styleSliderCss from "./style.scss";
import ResizeObserver from 'resize-observer-polyfill';
type lineSize = '' | 'mid' | 'large';
@customElement('p-slider')
class PSlider extends LitElement {
    public get input(): HTMLInputElement | unknown {
        return this;
    }
    @property({ type: String, reflect: true }) name: string;
    @property({ type: Number, reflect: true }) value: number = 0;
    @property({ type: Boolean, reflect: true }) vertical: boolean = false;
    @property({ type: Boolean, reflect: true }) alwaysTip: boolean = false;
    @property({ type: Boolean, reflect: true }) showtips: boolean = true;
    @property({ type: Boolean, reflect: true }) required: boolean = false;
    @property({ type: Boolean, reflect: true }) disabled: boolean = false;
    @property({ type: String, reflect: true }) suffix: string = undefined;
    @property({ type: String, reflect: true }) prefix: string = undefined;
    @property({ type: String, reflect: true }) lineSize: lineSize = undefined;
    @property({ type: String, reflect: true }) lineColor: string = undefined;
    @property({ type: Number, reflect: true }) min: number = 0;
    @property({ type: Number, reflect: true }) max: number = undefined;
    @property({ type: Number, reflect: true }) step: number = 1;
    static get styles() {
        return styleSliderCss;
    }

    get slider(): HTMLInputElement {
        return this.renderRoot.querySelector('#slider');
    }

    focus() {
        this.slider!.focus();
    }
    reset() {
        this.value = 0;
    }
    get form(): HTMLFormElement {
        return this.closest('form,p-form');
    }
    private _resizeObserver: ResizeObserver = null;
    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(_changedProperties);
        const sliderCon: HTMLElement = this.renderRoot.querySelector('#slider-con');
        this.addEventListener('wheel', (ev: WheelEvent) => {
            if (this.disabled) {
                return;
            }
            ev.preventDefault();
            if (ev.deltaY < 0 && !this.vertical || ev.deltaY > 0 && this.vertical) {
                const newValue = this.value - this.step * 5;
                this.value = Math.max(this.min, newValue);
            } else {
                const newValue = this.value + this.step * 5;
                this.value = Math.min(this.max, newValue);
            }
            this.dispatchEvent(new CustomEvent('change', {
                detail: {
                    value: this.value
                }
            }));
        }, true);
        this._initResizeObserver();
    }
    _initResizeObserver() {
        if (this.vertical) {
            if (!this._resizeObserver) {
                const sliderCon: HTMLElement = this.renderRoot.querySelector('#slider-con');
                this._resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
                    for (const entry of entries) {
                        const { height } = entry.contentRect;
                        // this.height = height + 'px';
                        this.style.setProperty('--h', height + 'px');
                    }
                });
                this._resizeObserver.observe(this);
            }
        } else {
            if (this._resizeObserver) {
                this._resizeObserver.unobserve(this);
                this._resizeObserver = null;
            }
        }
    }
    get tipContent() {
        let tip = this.prefix !== undefined ? this.prefix : '';
        tip += this.value;
        tip += this.suffix !== undefined ? this.suffix : '';
        return tip;
    }
    get percent() {
        return (this.value - this.min) / (this.max - this.min);
    }
    render() {
        return html`<p-tips id='slider-con'    dir=${this.vertical ? 'right' : 'top'}       style="--percent: ${this.percent}; "  .show=${this.alwaysTip ? 'true' : ''}
          .tips=${this.alwaysTip || (this.showtips && !this.disabled) ? this.tipContent : ''}
         >
          <input  type='range' id='slider' .value=${String(this.value)}  @input=${this.inputHander} @change=${this.changeHander}
           min=${this.min} max=${this.max} step=${this.step} ?disabled=${this.disabled} /> </p-tips>
        `;

    }

    inputHander(event: InputEvent) {
        this.value = Number(this.slider.value);
        event.stopPropagation();
        this.dispatchEvent(new CustomEvent('input', {
            detail: {
                value: this.value
            }
        }));
    }
    changeHander(event: InputEvent) {
        this.value = Number(this.slider.value);
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                value: this.value
            }
        }));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._resizeObserver != null) {
            this._resizeObserver.unobserve(this);
            this._resizeObserver = null;
        }
    }

    update(_changedProperties: Map<string | number | symbol, unknown>) {
        super.update(_changedProperties);
        if (_changedProperties.has('value') &&this.max!=undefined&& this.value > this.max) {
            this.value = this.max;
        }
        if (_changedProperties.has('value') && this.value < this.min) {
            this.value = this.min;
        }
        if (_changedProperties.has('max')) {
            if (this.value > this.max) {
                this.value = this.max;
            }
        }
        if (_changedProperties.has('min')) {
            if (this.min < 0) {
                this.min = 0;
            }
            if (this.value < this.min) {
                this.value = this.min;
            }
        }
        if (_changedProperties.has('vertical')) {
            this._initResizeObserver();
        }
        if (_changedProperties.has('lineColor')) {
            if (this.lineColor) {
                this.style.setProperty('--themeColor', this.lineColor);
            } else {
                this.style.removeProperty('--themeColor');
            }
        }
    }
}
