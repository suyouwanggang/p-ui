
import { LitElement, svg,  customElement, property } from 'lit-element';
import styleOne from './style.scss';
@customElement('p-icon')
export default class PICon extends LitElement {
    @property({ type: Number, reflect: false }) view = 1024;
    @property({ type: String, reflect: true }) name: string =undefined;
    @property({ type: String, reflect: false }) iconPath = '/iconfont/icon.svg';
    @property({ type: String, reflect: false }) path: string = undefined;
    @property({ type: Number, reflect: false }) size = -1;
    @property({ type: String, reflect: false }) color: string = undefined;
    @property({ type: Boolean, reflect: false }) spin = false; //旋转
    static styles = styleOne;

    constructor() {
        super();
    }

    render() {
        let styleValue = '';
        if (this.size >= 0) {
            styleValue += `font-size:${this.size}px;`;
        }
        if (this.color) {
            styleValue += `color:${this.color}`;
        }
        const icon = `${this.iconPath}#icon-${this.name}`;
        return svg`
             <svg xmlns="http://www.w3.org/2000/svg" class="svgclass" style='${styleValue}'   aria-hidden="true" viewBox="0 0 ${this.view} ${this.view}">
                ${this.path ? svg`<path d=${this.path} id="path"></path>` : svg`<use id="use" xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"  href="${icon}" ></use>`}
            </svg>
        `;
    }
}