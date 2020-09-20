import { css, customElement, html, LitElement, property } from 'lit-element';
import style1 from './style.scss';
type showType = 'true' | 'false' | '';
type typeType = 'success' | 'warning' | 'error';
type dirType = 'top' | 'topleft' | 'topright' | 'left' | 'lefttop' | 'leftbottom' | 'bottom' | 'bottomleft' | 'bottomright' | 'right' | 'righttop' | 'rightbottom' | 'auto';
@customElement('p-tips')
 export default class PTips extends LitElement {
   
    static get styles(){
      return [style1];
    }
    @property({ type: String, reflect: true }) show: showType = null;
    @property({ type: String, reflect: true }) tips: string = null;
    @property({ type: String, reflect: true }) color: string = null;
    @property({ type: String, reflect: true }) type: typeType = null;
    @property({ type: String, reflect: true,}) dir: dirType = 'auto';

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
