import { css, customElement, html, LitElement, property } from 'lit-element';
import ResizeObserver from 'resize-observer-polyfill';
import PTips from './p-tips';
@customElement('p-slider')
class PSlider extends LitElement {
    public get input(): HTMLInputElement | unknown {
        return this;
    }
    @property({ type: String, reflect: true }) name: string;
    @property({ type: Number, reflect: true }) value: number;
    @property({ type: Boolean, reflect: true }) vertical: boolean = false;
    @property({ type: Boolean, reflect: true }) showtips: boolean = false;
    @property({ type: Boolean, reflect: true }) invalid: boolean = false;
    @property({ type: Boolean, reflect: true }) novalidate: boolean = false;
    @property({ type: Boolean, reflect: true }) required: boolean = false;
    @property({ type: Boolean, reflect: true }) disabled: boolean = false;
    @property({ type: String, reflect: true }) errorMessage: string = undefined;
    @property({ type: String, reflect: true }) suffix: string = undefined;
    @property({ type: String, reflect: true }) prefix: string = undefined;
    @property({ type: Number, reflect: true }) min: number = undefined;
    @property({ type: Number, reflect: true }) max: number = undefined;
    @property({ type: Number, reflect: true }) step: number = 1;
    static get styles() {
        return css`
        :host{
            box-sizing:border-box; 
            display:flex; 
            padding:0 5px;
        }
        :host([vertical]){
           height:300px;
        }
        :host([disabled]){
            opacity:var(--disabled-opaticity,0.8);
            cursor:not-allowed;
        }
        :host([disabled]){ 
            opacity:.8; 
            --themeColor:#999; 
            cursor:not-allowed; 
        }
        :host([disabled]) input[type="range"]{ 
            pointer-events:none; 
        }
        #slider-con{ 
            display:flex; 
            padding:5px 0; 
            width:100%;
            margin: auto;
        }
        ::-moz-focus-inner,::-moz-focus-outer{
            border:0;
            outline : 0;
        }
        :host([showtips]){
            pointer-events:all;
        }
        input[type="range"]{
            pointer-events:all;
            margin:0 -5px;
            width: calc( 100% + 10px );
            -webkit-appearance: none;
            outline : 0;
            /*
            background: rgba(0,0,0,.1);
            */
            height: 12px;
            background:none;
            border-radius:2px;
        }
        input[type="range"]::-webkit-slider-runnable-track{
            display: flex;
            align-items: center;
            position: relative;
            height: 2px;
            border-radius:2px;
            background:linear-gradient(to right, var(--themeColor,#42b983) calc(100% * var(--percent)), rgba(0,0,0,.1) 0% )
        }
        input[type="range"]::-moz-range-progress {
            display: flex;
            align-items: center;
            position: relative;
            height: 2px;
            border-radius:2px;
            outline : 0;
            background:var(--themeColor,#42b983)
        }
        input[type="range"]::-moz-range-track{
            height: 2px;
            background: rgba(0,0,0,.1);
        }
        input[type="range"]::-webkit-slider-thumb{
            -webkit-appearance: none;
            border:2px solid var(--themeColor,#42b983);
            position: relative;
            width:10px;
            height:10px;
            border-radius: 50%;
            background:var(--themeColor,#42b983);
            transition:.2s cubic-bezier(.12, .4, .29, 1.46);
        }
        input[type="range"]::-moz-range-thumb{
            box-sizing:border-box;
            pointer-events:none;
            border:2px solid var(--themeColor,#42b983);
            position: relative;
            width:10px;
            height:10px;
            border-radius: 50%;
            background:var(--themeColor,#42b983);
            transition:.2s cubic-bezier(.12, .4, .29, 1.46);
        }
        input[type="range"]:focus{
            z-index:2;
        }
        input[type="range"]::-webkit-slider-thumb:active,
        input[type="range"]:focus::-webkit-slider-thumb{
            transform:scale(1.2);
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            background: #fff;
        }
        input[type="range"]::-moz-range-thumb:active,
        input[type="range"]:focus::-moz-range-thumb{
            transform:scale(1.2);
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            background: #fff;
        }
        :host([vertical]) #slider-con{
            position: absolute;
            top: 50%;
            left: 50%;
            transform:translate(-50%, -50%) rotate(-90deg);
            width:calc( var(--h,300px) - 10px)
        }
        :host([vertical]) #slider-con::before{
            writing-mode: vertical-lr;
            padding: 10px 6px;
        }
        :host([vertical]){
            display:inline-flex;
            position:relative;
            width:20px;
        }
        :host([vertical]) p-tips::before,:host([vertical]) p-tips::after{
            left: calc( var(--percent,.5) * 100% + 5px );
        }
        :host(:focus-within) #slider-con,:host(:hover) #slider-con{
            z-index:10
        }
    `;
    }

    get slider(): HTMLInputElement {
        return this.renderRoot.querySelector('#slider');
    }

    focus() {
        this.slider!.focus();
    }
    reset() {
        this.value = 0;
        this.slider!.value = '0';
        this.invalid = false;
    }
    get form(): HTMLFormElement {
        return this.closest('form,p-form');
    }
    private _resizeObserver: ResizeObserver = null;
    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(_changedProperties);
        const sliderCon: HTMLElement = this.renderRoot.querySelector('#sliderCon');
        this._resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                const { height } = entry.contentRect;
                sliderCon.style.setProperty('--h', height + 'px');
            }
        });
        this._resizeObserver.observe(this);
    }
    get tipContent() {
        let tip = this.prefix != undefined ? this.prefix : '';
        tip += this.value;
        tip += this.suffix != undefined ? this.suffix : '';
        return tip;
    }
    render() {
        return html` <p-tips id='slider-con'
         dir=${this.vertical ? 'right' : 'top'} 
         style='--percent:${(this.value - this.min) / (this.max - this.min)}'
          tips=${this.showtips && !this.disabled ? this.tipContent : ''}
         >
          <input id='slider' value=${this.value} @wheel=${this.wheelHander} @input=${this.inputHander} @change=${this.changeHander} min=${this.min} max=${this.max} step=${this.step} ?disabled=${this.disabled} type='range'></p-tips>
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
        this._resizeObserver.unobserve(this);
        this._resizeObserver = null;
    }
    wheelHander(ev: WheelEvent) {
        if (ev.deltaY < 0 && !this.vertical || ev.deltaY > 0 && this.vertical) {
            this.value -= this.step * 5;
        } else {
            this.value += this.step * 5;
        }
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                value: this.value
            }
        }));
    }
    update(_changedProperties: Map<string | number | symbol, unknown>) {
        super.update(_changedProperties);
        if(_changedProperties.has('value')&&this.value>this.max){
            this.value=this.max;
        }
        if(_changedProperties.has('value')&&this.value>this.min){
            this.value=this.min;
        }
        if (_changedProperties.has('max')) {
            if (this.value > this.max) {
                this.value = this.max;
            }
        }
        if (_changedProperties.has('min')) {
            if(this.min<0){
                this.min=0;
            }
            if (this.value < this.max) {
                this.value = this.max;
            }
        }
    }
}
