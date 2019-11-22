import { css, customElement, html, LitElement, property, query } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import './p-button';
import { rgbToHsv, hslToHsv, parseToHSVA } from './utils/color';
import { HSVaColor } from './utils/hsvacolor';
const Material_colors = ['#f44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B', 'rgba(0,0,0,.65)', 'transparent']
@customElement('p-color-panel')
export default class PColorPanel extends LitElement {
    @property({ type: String, reflect: true }) value: string = '#ff0000';
    @property({ type: Number, reflect: true }) typeindex: number = 0;
    static COLOR_TYPE: string[] = ['HEXA', 'RGBA', 'HSLA'];
    static get styles() {
        return css`
            :host{
                display: block;
                width:300px;
            }
            .color-pane{
                padding:.8em;
            }
            .color-palette{
                position:relative;
                height:150px;
                background:linear-gradient(to top, hsla(0,0%,0%,calc(var(--a))), transparent), linear-gradient(to left, hsla(calc(var(--h)),100%,50%,calc(var(--a))),hsla(0,0%,100%,calc(var(--a)))),linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 ),linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 );
                background-position:0 0, 0 0,0 0,5px 5px;
                background-size:100% 100%, 100% 100%, 10px 10px, 10px 10px;
                user-select: none;
                cursor: crosshair;
                opacity:1;
                transition:opacity .1s;
            }
            .color-palette:active{
                opacity:.99;
            }
            .color-palette::after{
                pointer-events:none;
                position:absolute;
                content:'';
                box-sizing:border-box;
                width:10px;
                height:10px;
                border-radius:50%;
                border:2px solid #fff;
                left:calc(var(--s) * 1%);
                top:calc((100 - var(--v)) * 1%);
                transform:translate(-50%,-50%);
            }
            .color-chooser{
                display:flex;
                padding:10px 0;
            }
            .color-show{
                display:flex;
                position: relative;
                width:32px;
                height:32px;
                background:var(--c);
                transition:none;
                border-radius:50%;
                overflow:hidden;
                cursor:pointer;
            }
            .color-show .icon-file{
                width:1em;
                height:1em;
                margin: auto;
                fill: hsl(0, 0%, calc( ((2 - var(--s) / 100) * var(--v) / 200 * var(--a) - 0.6 ) * -999999%  ));
                opacity: 0;
                transition: .3s;
            }
            .color-show:hover .icon-file{
                opacity:1;
            }
            .color-show input{
                position:absolute;
                clip:rect(0,0,0,0);
            }
            .color-show::after{
                content:'';
                position:absolute;
                width:32px;
                height:32px;
                background:linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 ),linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 );
                background-position:0 0,5px 5px;
                background-size:10px 10px;
                z-index:-1;
            }
            .color-range{
                flex:1;
                margin-left:10px;
            }
            input[type="range"]{
                display: block;
                pointer-events:all;
                width:100%;
                -webkit-appearance: none;
                outline : 0;
                height: 10px;
                border-radius:5px;
                margin:0;
            }
            input[type="range"]::-webkit-slider-runnable-track{
                display: flex;
                align-items: center;
                position: relative;
            }
            input[type="range"]::-webkit-slider-thumb{
                -webkit-appearance: none;
                position: relative;
                width:10px;
                height:10px;
                transform:scale(1.2);
                border-radius: 50%;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                background:#fff;
                transition:.2s cubic-bezier(.12, .4, .29, 1.46);
            }
            input[type="range"]::-moz-range-thumb{
                box-sizing:border-box;
                pointer-events:none;
                position: relative;
                width:10px;
                height:10px;
                transform:scale(1.2);
                border-radius: 50%;
                border:0;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                background:#fff;
                transition:.2s cubic-bezier(.12, .4, .29, 1.46);
            }
            input[type="range"]::-webkit-slider-thumb:active,
            input[type="range"]:focus::-webkit-slider-thumb{
                transform:scale(1.5);
            }
            input[type="range"]::-moz-range-thumb:active,
            input[type="range"]:focus::-moz-range-thumb{
                transform:scale(1.5);
            }
            input[type="range"]+input[type="range"]{
                margin-top:10px;
            }
            .color-hue{
                background:linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)
            }
            .color-opacity{
                background:linear-gradient(to right, hsla(calc(var(--h)),100%,50%,0), hsla(calc(var(--h)),100%,50%,1)),linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 ),linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 );
                background-position:0 0,0 0,5px 5px;
                background-size:100% 100%,10px 10px,10px 10px;
            }
            .color-label{
                position:absolute;
                display:flex;
                visibility:hidden;
                opacity:0;
                left:0;
                right:0;
                top:0;
                bottom:0;
                transition: .3s;
            }
            .color-label input{
                flex:1;
                margin-right:.8em;
                outline:0;
                min-width:0;
                width: 0;
                border-radius:var(--borderRadius,.25em);
                border:1px solid #ddd;
                padding:0 5px;
                line-height:28px;
                text-align:center;
                -moz-appearance: textfield;
                transition:.3s;
            }
            input[type="number"]::-webkit-inner-spin-button{
                display:none;
            }
            ::-moz-focus-inner,::-moz-focus-outer{
                border:0;
                outline : 0;
            }
            .color-label input:focus{
                border-color:var(--themeColor,#42b983);
            }
            .color-footer{
                display:flex
            }
            .btn-switch{
                position:relative;
                border-radius:var(--borderRadius,.25em);
                background:none;
                border:0;
                outline:0;
                line-height:30px;
                width: 60px;
                padding: 0;
                color:var(--themeColor,#42b983);
                overflow:hidden;
            }
            .btn-switch::before{
                content:'';
                position:absolute;
                left:0;
                top:0;
                right:0;
                bottom:0;
                background:var(--themeBackground,var(--themeColor,#42b983));
                opacity:.2;
                transition:.3s;
            }
            .btn-switch:hover::before,.btn-switch:focus::before{
                opacity:.3;
            }
            .color-input{
                position:relative;
                flex:1;
                height:30px;
                overflow:hidden;
            }
            .color-footer[data-type="HEXA"] .color-label:nth-child(1),
            .color-footer[data-type="RGBA"] .color-label:nth-child(2),
            .color-footer[data-type="HSLA"] .color-label:nth-child(3){
                opacity:1;
                visibility:inherit;
                z-index:2;
            }
            .color-sign{
                padding-top:10px;
                display:grid;
                grid-template-columns: repeat(auto-fit, minmax(15px, 1fr));
                grid-gap: 10px;
            }
            .color-sign>button{
                position:relative;
                cursor:pointer;
                width:100%;
                padding-bottom:0;
                padding-top:100%;
                border-radius:4px;
                border:0;
                outline:0;
            }
            .color-sign>button::before{
                content:'';
                position:absolute;
                left:0;
                top:0;
                width:100%;
                height:100%;
                z-index:-1;
                background:linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 ),linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 );
                background-position:0 0,5px 5px;
                background-size:10px 10px;
                border-radius: 4px;
            }
            .color-sign>button::after{
                content:'';
                position:absolute;
                opacity:.5;
                z-index:-2;
                left:0;
                top:0;
                width:100%;
                height:100%;
                background:inherit;
                border-radius:4px;
                transition:.3s;
            }
            .color-sign>button:hover::after,.color-sign>button:focus::after{
                transform:translate(2px,2px)
            }

        `;
    }

    get color() {
        return HSVaColor(...this.$value);
    }
    get rgbColor() {
        return this.color.toRGBA().toString();
    }
    dispatchChangeEvent() {
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                value: this.value,
                color: this.color
            }
        }));
    }
    @query("#color-palette")
    palette: HTMLElement;
    private _colorSelectStart = false;
    private _moveColorPanel(ev: MouseEvent) {
        const { left: x, top: y, width: w, height: h } = this.palette.getBoundingClientRect();
        const value = [...this.$value];
        const _x = Math.min(Math.max(0, (ev.clientX - x) / w * 100), 100);
        const _y = Math.min(Math.max(0, (ev.clientY - y) / h * 100), 100);
        value[1] = _x;
        value[2] = 100 - _y;
        this.value = `hsva(${value[0]}, ${value[1]}%, ${value[2]}%, ${value[3]})`;
    }
    private _colorChoose(ev: MouseEvent) {
        if (ev.type === 'mousedown') {
            this._colorSelectStart = true;
            this._moveColorPanel(ev);
        }
        if (this._colorSelectStart && ev.type === 'mousemove') {
            this._moveColorPanel(ev);
        }
        if (ev.type === 'mouseup') {
            this._moveColorPanel(ev);
            this._colorSelectStart = false;
            this.dispatchChangeEvent();
        }

    }

    render() {
        return html`
        <div class="color-pane" id="color-pane" >
        <div class="color-palette" id="color-palette" @mousedown=${this._colorChoose} @mousemove=${this._colorChoose}  @mouseup=${this._colorChoose}  ></div> 
        <div class="color-chooser">
            <a class="color-show" id="copy-btn">
                <svg class="icon-file" viewBox="0 0 1024 1024">
                  <path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32z"></path>
                  <path d="M704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"></path>
                </svg><input type="text" id="copyOnInfo">
            </a>
            <div class="color-range">
                <input class="color-hue" value="0" min="0" max="360" type="range" id="range-hue" @input=${this._range_hueHander}>
                <input class="color-opacity" value="1" min="0" max="1" step="0.01" type="range" id="range-opacity" @input=${this._rangeOpacityHander} >
            </div>
        </div>
       
        <div class="color-footer" data-type="${PColorPanel.COLOR_TYPE[this.typeindex]}">
            <div class="color-input">
                <div class="color-label" id="color-hexa">
                    <input spellcheck="false"  @change=${this._hexaChangeHander}  @mouseleave=${this._hexaChangeHander} id='color_hexa_input' /> 
                </div>
                <div class="color-label" id="color-rgba" @change=${this._rgbaChangeHander} >
                    <input type="number" min="0" max="255"  spellcheck="false" />
                    <input type="number" min="0" max="255" spellcheck="false" />
                    <input type="number" min="0" max="255" spellcheck="false" />
                    <input type="number" min="0" max="1" step="0.01" spellcheck="false" />
                </div>
                <div class="color-label" id="color-hlsa" @change=${this._hlsaChangeHander} >
                    <input type="number" min="0" max="360" maxlength='3' spellcheck="false" />
                    <input type="number" min="0" max="100" maxlength=3 spellcheck="false" />
                    <input type="number" min="0" max="100" maxlength=3 spellcheck="false" />
                    <input type="number" min="0" max="1" step="0.01" spellcheck="false" />
                </div>
            </div>
            <p-button class="btn-switch" id="btn-switch" @click=${this._switch_Hander} type="flat">${PColorPanel.COLOR_TYPE[this.typeindex]}</p-button>
        </div>
        <div class="color-sign" id="colors"  @click=${this._colorsPick}>
            ${Material_colors.map((el: string) => html`<button style="background-color:${el};"  data-color='${el}' ></button>`)}
        </div>
    </div>`;
    }
    private _rangeOpacityHander(ev: InputEvent) {
        const rangeOpcity: HTMLInputElement = ev.target as HTMLInputElement;
        const value = [...this.$value];
        value[3] = Number(rangeOpcity.value);
        this.value = `hsva(${value[0]}, ${value[1]}%, ${value[2]}%, ${value[3]})`;
    }
    private _range_hueHander(ev: InputEvent) {
        const rangeHue: HTMLInputElement = ev.target as HTMLInputElement;
        const value = [...this.$value];
        value[0] = Number(rangeHue.value);
        this.value = `hsva(${value[0]}, ${value[1]}%, ${value[2]}%, ${value[3]})`;
    }
    private _switch_Hander(ev: Event) {
        this.typeindex++;
        this.typeindex %= 3;
    }
    get copyValue() {
        const color = this.color;
        if (this.typeindex == 0) {
            return color.toHEXA().toString();
        } else if (this.typeindex == 1) {
            return color.toRGBA().toString();
        } else {
            return color.toHSLA().toString();
        }
    }
    private _hexaChangeHander(event: Event) {
        const el: HTMLInputElement = event.target as HTMLInputElement;
        this.value = el.value;
        this.dispatchChangeEvent();
    }
    private _rgbaChangeHander(event: Event) {
        const rgbaDIV = this.renderRoot.querySelector('#color-rgba');
        const input = event.target as HTMLInputElement;
        const index = [...rgbaDIV.children as any].indexOf(input);
        const value = HSVaColor(...this.$value).toRGBA();
        value[index] = Number(input.value);
        this.value = `rgba(${value[0]}, ${value[1]}, ${value[2]}, ${value[3]})`;

    }
    private _hlsaChangeHander(event: Event) {
        const hlsaDIV = this.renderRoot.querySelector('#color-hlsa');
        const input = event.target as HTMLInputElement;
        const index = [...hlsaDIV.children as any].indexOf(input);
        const value = HSVaColor(...this.$value).toHSLA();
        value[index] = Number(input.value);
        this.value = `hsla(${value[0]}, ${value[1]}%, ${value[2]}%, ${value[3]})`;
    }
    private _colorsPick(ev: Event) {
        let item = ev.target as HTMLElement;
        item = item.closest('button');
        if (item) {
            this.value = item.getAttribute('data-color');
        }
    }
    get rgbaInputs(): HTMLInputElement[] {
        return [...this.renderRoot.querySelectorAll("#color-rgba input") as any];
    }
    get hlsaInputs(): HTMLInputElement[] {
        return [...this.renderRoot.querySelectorAll("#color-hlsa input") as any];
    }
    @query("#range-hue")
    private rangeHueEL: HTMLInputElement;
    @query("#range-opacity")
    private rangeOpcity: HTMLInputElement;
    @query("#copyOnInfo")
    private copyInfoInput: HTMLInputElement;
    @query("#color_hexa_input")
    private color_hexa_input: HTMLInputElement;
    private $value: any[];
    private _setValueAsyn() {
        this.$value = parseToHSVA(this.value).values;
        const [h, s, v, a = 1] = this.$value;
        const pane = this.shadowRoot!.getElementById('color-pane');
        if (pane) {
            pane.style.setProperty('--h', String(h));
            pane.style.setProperty('--s', String(s));
            pane.style.setProperty('--v', String(v));
            pane.style.setProperty('--a', String(a));
            pane.style.setProperty('--c', this.copyValue);
            this.rangeHueEL.value = String(h);
            this.rangeOpcity.value = a.toFixed(2);
            this.copyInfoInput.value = this.copyValue;
            const rgbaInputs = this.rgbaInputs;
            const color = HSVaColor(...this.$value);
            this.color_hexa_input.value = color.toHEXA().toString();
            const rgba = color.toRGBA();
            rgbaInputs[0].value = rgba[0].toFixed(0);
            rgbaInputs[1].value = rgba[1].toFixed(0);
            rgbaInputs[2].value = rgba[2].toFixed(0);
            rgbaInputs[3].value = rgba[3].toFixed(2);


            const hlsaInputs = this.hlsaInputs;
            const hlsa = color.toHSLA();
            hlsaInputs[0].value = hlsa[0].toFixed(0);
            hlsaInputs[1].value = hlsa[1].toFixed(0);
            hlsaInputs[2].value = hlsa[2].toFixed(0);
            hlsaInputs[3].value = hlsa[3].toFixed(2);
        }
    }

    update(_changedProperties: Map<string | number | symbol, unknown>) {
        super.update(_changedProperties);
        if (_changedProperties.has('value') && this.isConnected) {
            const result = parseToHSVA(this.value);
            if (result.values == null) {
                this.value = _changedProperties.get('value') as string;
            } else {
                this._setValueAsyn();
            }
        }
    }
    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(_changedProperties);
    }
}

