import { css, customElement, html, LitElement, property } from 'lit-element';
type showType = 'true' | 'false' | '';
type typeType = 'success' | 'warning' | 'error';
type dirType = 'top' | 'topleft' | 'topright' | 'left' | 'lefttop' | 'leftbottom' | 'bottom' | 'bottomleft' | 'bottomright' | 'right' | 'righttop' | 'rightbottom' | 'auto';
@customElement('p-tips')
export default class PTips extends LitElement {
    @property({ type: String, reflect: true }) show: showType = null;
    @property({ type: String, reflect: true }) tips: string = null;
    @property({ type: String, reflect: true }) color: string = null;
    @property({ type: String, reflect: true }) type: typeType = null;
    @property({ type: String, reflect: true,}) dir: dirType = 'auto';

    static get styles() {
        return css`
        :host {
            display:inline-block;
            position: relative;
            overflow: visible;
        }
        :host::before,
        :host::after {
            content: '';
            display: block;
            position: absolute;
            z-index: 1;
            transform: translate(-50%,  -20px);
            opacity: 0;
            transition:all .15s .15s,left 0s, top 0s;
            color: var(--color,rgba(0,0,0,0.75));
            visibility: hidden;
            pointer-events: none;
        }
        :host::before {
            content: attr(tips) ;
            border-radius: 3px;
            padding: 6px 10px;
            line-height: 18px;
            text-align: left;
            white-space:pre-line;
            background-color: var(--color,rgba(0,0,0,0.75));
            color: #fff;
            font-size: 12px;
            font-style: normal;
            width: max-content;
            max-width: var(--tips-max-width,200px);
        }
        :host::after {
            width: 0;
            height: 0;
            overflow: hidden;
            border: 6px solid transparent;
        }
        :host([tips]:not([tips='']):hover:not([show=false]))::before,
        :host([tips]:not([tips=''])[show=true])::before,
        :host([tips]:not([tips='']):focus-within:not([show=false]))::before,
        :host([tips]:not([tips='']):hover:not([show=false]))::after,
        :host([tips]:not([tips=''])[show=true])::after,
        :host([tips]:not([tips='']):focus-within:not([show=false]))::after {
            visibility: visible;
            opacity: 1;
        }
        :host([dir="top"])::before,
        :host(:not([dir]))::before,
        :host(:not([dir]))::after,
        :host([dir="top"])::after {
            left: calc( var(--percent,.5) * 100% );
            bottom: 100%;
            transform: translate(-50%,-20px);
        }
        :host([dir="top"]):after,
        :host(:not([dir])):after {
            margin-bottom: -12px;
            border-top-color: currentColor;
        }
        :host(:not([dir]):hover:not([show=false]))::before,
        :host(:not([dir])[show=true])::before,
        :host(:not([dir]):focus-within:not([show=false]))::before,
        :host(:not([dir]):hover:not([show=false]))::after,
        :host(:not([dir])[show=true])::after,
        :host(:not([dir]):focus-within:not([show=false]))::after,
        :host([dir="top"]:hover:not([show=false]))::before,
        :host([dir="top"][show=true])::before,
        :host([dir="top"]:focus-within:not([show=false]))::before,
        :host([dir="top"]:hover:not([show=false]))::after,
        :host([dir="top"][show=true])::after,
        :host([dir="top"]:focus-within:not([show=false]))::after {
            transform: translate(-50%, -10px);
        }
        :host([dir="right"])::before,
        :host([dir="right"])::after{
            left: 100%;
            top: 50%;
            transform: translate(20px, -50%);
        }
        :host([dir="right"]):after {
            margin-left: -12px;
            border-right-color: currentColor;
        }
        :host([dir="right"]:hover:not([show=false]))::before,
        :host([dir="right"][show=true])::before,
        :host([dir="right"]:focus-within:not([show=false]))::before,
        :host([dir="right"]:hover:not([show=false]))::after,
        :host([dir="right"][show=true])::after,
        :host([dir="right"]:focus-within:not([show=false]))::after {
            transform: translate(10px, -50%);
        }
        /* bottom */
        :host([dir="bottom"])::before,
        :host([dir="bottom"])::after{
            left: calc( var(--percent,.5) * 100% );
            top: 100%;
            transform: translate(-50%, 20px);
        }
        :host([dir="bottom"])::after {
            margin-top: -12px;
            border-bottom-color: currentColor;
        }
        :host([dir="bottom"]:hover:not([show=false]))::before,
        :host([dir="bottom"][show=true])::before,
        :host([dir="bottom"]:focus-within:not([show=false]))::before,
        :host([dir="bottom"]:hover:not([show=false]))::after,
        :host([dir="bottom"][show=true])::after,
        :host([dir="bottom"]:focus-within:not([show=false]))::after {
            transform: translate(-50%, 10px);
        }

        :host([dir="left"])::before,
        :host([dir="left"])::after{
            right: 100%;
            top: 50%;
            transform: translate(-20px, -50%);
        }
        :host([dir="left"])::after{
            margin-right: -12px;
            border-left-color: currentColor;
        }
        :host([dir="left"]:hover:not([show=false]))::before,
        :host([dir="left"][show=true])::before,
        :host([dir="left"]:focus-within:not([show=false]))::before,
        :host([dir="left"]:hover:not([show=false]))::after,
        :host([dir="left"][show=true])::after,
        :host([dir="left"]:focus-within:not([show=false]))::after {
            transform: translate(-10px, -50%);
        }

        
        :host([dir="topleft"])::before,
        :host([dir="topleft"])::after {
            left: 0;
            bottom: 100%;
            transform: translate(0, -20px);
        }
        :host([dir="topleft"]):after{
            left:10px;
            margin-bottom: -12px;
            border-top-color: currentColor;
        }
        :host([dir="topleft"]:hover:not([show=false]))::before,
        :host([dir="topleft"][show=true])::before,
        :host([dir="topleft"]:focus-within:not([show=false]))::before,
        :host([dir="topleft"]:hover:not([show=false]))::after,
        :host([dir="topleft"][show=true])::after,
        :host([dir="topleft"]:focus-within:not([show=false]))::after {
            transform: translate(0, -10px);
        }
       
        :host([dir="topright"])::before,
        :host([dir="topright"])::after {
            right: 0;
            bottom: 100%;
            transform: translate(0, -20px);
        }
        :host([dir="topright"]):after{
            right:10px;
            margin-bottom: -12px;
            border-top-color: currentColor;
        }
        :host([dir="topright"]:hover:not([show=false]))::before,
        :host([dir="topright"][show=true])::before,
        :host([dir="topright"]:focus-within:not([show=false]))::before,
        :host([dir="topright"]:hover:not([show=false]))::after,
        :host([dir="topright"][show=true])::after,
        :host([dir="topright"]:focus-within:not([show=false]))::after {
            transform: translate(0, -10px);
        }
        
        :host([dir="righttop"])::before,
        :host([dir="righttop"])::after{
            left: 100%;
            top: 0;
            transform: translate(20px, 0);
        }
        :host([dir="righttop"]):after {
            top: 10px;
            margin-left: -12px;
            border-right-color: currentColor;
        }
        :host([dir="righttop"]:hover:not([show=false]))::before,
        :host([dir="righttop"][show=true])::before,
        :host([dir="righttop"]:focus-within:not([show=false]))::before,
        :host([dir="righttop"]:hover:not([show=false]))::after,
        :host([dir="righttop"][show=true])::after,
        :host([dir="righttop"]:focus-within:not([show=false]))::after {
            transform: translate(10px, 0);
        }

        :host([dir="rightbottom"])::before,
        :host([dir="rightbottom"])::after{
            left: 100%;
            bottom: 0;
            transform: translate(20px, 0);
        }
        :host([dir="rightbottom"]):after {
            bottom: 10px;
            margin-left: -12px;
            border-right-color: currentColor;
        }
        :host([dir="rightbottom"]:hover:not([show=false]))::before,
        :host([dir="rightbottom"][show=true])::before,
        :host([dir="rightbottom"]:focus-within:not([show=false]))::before,
        :host([dir="rightbottom"]:hover:not([show=false]))::after,
        :host([dir="rightbottom"][show=true])::after,
        :host([dir="rightbottom"]:focus-within:not([show=false]))::after {
            transform: translate(10px, 0);
        }
        :host([dir="bottomleft"])::before,
        :host([dir="bottomleft"])::after{
            left: 0;
            top: 100%;
            transform: translate(0, 20px);
        }
        :host([dir="bottomleft"])::after {
            left: 10px;
            margin-top: -12px;
            border-bottom-color: currentColor;
        }
        :host([dir="bottomleft"]:hover:not([show=false]))::before,
        :host([dir="bottomleft"][show=true])::before,
        :host([dir="bottomleft"]:focus-within:not([show=false]))::before,
        :host([dir="bottomleft"]:hover:not([show=false]))::after,
        :host([dir="bottomleft"][show=true])::after,
        :host([dir="bottomleft"]:focus-within:not([show=false]))::after {
            transform: translate(0, 10px);
        }
       
        :host([dir="bottomright"])::before,
        :host([dir="bottomright"])::after{
            right: 0;
            top: 100%;
            transform: translate(0, 20px);
        }
        :host([dir="bottomright"])::after {
            right: 10px;
            margin-top: -12px;
            border-bottom-color: currentColor;
        }
        :host([dir="bottomright"]:hover:not([show=false]))::before,
        :host([dir="bottomright"][show=true])::before,
        :host([dir="bottomright"]:focus-within:not([show=false]))::before,
        :host([dir="bottomright"]:hover:not([show=false]))::after,
        :host([dir="bottomright"][show=true])::after,
        :host([dir="bottomright"]:focus-within:not([show=false]))::after {
            transform: translate(0, 10px);
        }
        
        :host([dir="lefttop"])::before,
        :host([dir="lefttop"])::after{
            right: 100%;
            top: 0;
            transform: translate(-20px, 0);
        }
        :host([dir="lefttop"]):after {
            top: 10px;
            margin-right: -12px;
            border-left-color: currentColor;
        }
        :host([dir="lefttop"]:hover:not([show=false]))::before,
        :host([dir="lefttop"][show=true])::before,
        :host([dir="lefttop"]:focus-within:not([show=false]))::before,
        :host([dir="lefttop"]:hover:not([show=false]))::after,
        :host([dir="lefttop"][show=true])::after,
        :host([dir="lefttop"]:focus-within:not([show=false]))::after {
            transform: translate(-10px, 0);
        }
       
        :host([dir="leftbottom"])::before,
        :host([dir="leftbottom"])::after{
            right: 100%;
            bottom: 0;
            transform: translate(-20px, 0);
        }
        :host([dir="leftbottom"]):after {
            bottom: 10px;
            margin-right: -12px;
            border-left-color: currentColor;
        }
        :host([dir="leftbottom"]:hover:not([show=false]))::before,
        :host([dir="leftbottom"][show=true])::before,
        :host([dir="leftbottom"]:focus-within:not([show=false]))::before,
        :host([dir="leftbottom"]:hover:not([show=false]))::after,
        :host([dir="leftbottom"][show=true])::after,
        :host([dir="leftbottom"]:focus-within:not([show=false]))::after {
            transform: translate(-10px, 0);
        }
        /* success */
        :host([type="success"]){
            --color:var(--successColor,#52c41a);
        }
        /* error */
        :host([type="error"]){
            --color:var(--errorColor,#f4615c);
        }
        /* warning */
        :host([type="warning"]){
            --color:var(--waringColor,#faad14);
        }
        `;
    }
    private _isAutoDir = false;
    private _autoHander: EventListenerOrEventListenerObject ;
    firstUpdated(changeMap: Map<string | number | symbol, unknown>) {
        const tipObject = this;
        if (this.dir === 'auto') {
            tipObject._isAutoDir = true;
            const hander = ( ) => {
                if ( tipObject._isAutoDir) {
                    tipObject._caculateAutoDir();
                }
            }
            this.addEventListener('mouseenter', hander);
            this._autoHander = hander;
        }
    }
    disconnectedCallback(){
        super.disconnectedCallback();
        this.removeEventListener('mouseoenter', this._autoHander);
    }
    private _caculateAutoDir() {
        const w = document.documentElement.clientWidth;
        const h = document.documentElement.clientHeight;
        if (this.dir === 'auto' || this._isAutoDir) {
            this._isAutoDir = true;
            const rect = this.getBoundingClientRect();
            const x = rect.left;
            const top = rect.top;
            const y = w - rect.right;
            const leftDistance = w * 0.62;
            const topDistance = h * .62;
            if (top >= topDistance) {
                this.dir = 'top';
            } else {
                this.dir = 'bottom';
            }
            if (x > leftDistance) {
                this.dir += 'right';
            } else if(y > leftDistance) {
                this.dir += 'left';
            }
        }
    }
    render() {
        return html`<slot></slot>`;
    }

    update(changeMap: Map<string | number | symbol, unknown>) {
        super.update(changeMap);
        if (changeMap.has('color')) {
            if (this.color) {
                this.style.setProperty('--color', this.color);
            } else {
                this.style.removeProperty('--color');
            }
        }
    }
}



@customElement('p-router-slot')
export class RouterSlot extends LitElement {
    static get styles() {
        return css`
        :host {
            display:contents;
        }
        `;
    }
    @property({ type: String }) route: string;
    render(){
        return html`<slot  .name=${this.route} id='slot'></slot>`;
    }
    get slotElement(){
        return this.shadowRoot.getElementById('slot');
    }
  }