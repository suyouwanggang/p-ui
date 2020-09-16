
import { LitElement, svg, html, customElement, property, css } from 'lit-element'
@customElement('p-icon')
export class PICon extends LitElement {
    @property({ type: Number, reflect: false }) view: number = 1024;
    @property({ type: String, reflect: true }) name: string = '';
    @property({ type: String, reflect: false }) iconPath: string = './iconfont/icon.svg';
    @property({ type: String, reflect: false }) path: string = '';
    @property({ type: Number, reflect: false }) size: number = -1;
    @property({ type: String, reflect: false }) color: string = '';
    @property({ type: Boolean, reflect: false }) spin: boolean = false;//旋转
    static styles = css`
       :host{
            font-size:inherit;
            display:inline-block;
            transition:.3s;
        }
        .svgclass {
            display:block;
            width: 1em;
            height: 1em;
            margin: auto;
            fill: currentColor;
            overflow: hidden;
            vertical-align: -0.15em;
            /*transition:inherit;*/
        }
        :host([spin]){
            animation: rotate 1.4s linear infinite;
        }
        @keyframes rotate{
            to{
                transform: rotate(360deg);
            }
        }
    `;

    constructor() {
        super();
    }

    render() {
        // let usePath= svg`${this.path? svg`<path d=${this.path} id="path"></path>` : svg`<use id="use" ></use>`}
        let styleValue = '';
        if (this.size >= 0) {
            styleValue += `font-size:${this.size}px;`;
        }
        if (this.color) {
            styleValue += `color:${this.color}`;
        }
        const icon=`${this.iconPath}#icon-${this.name}`;
        return svg`
             <svg xmlns="http://www.w3.org/2000/svg" class="svgclass" style='${styleValue}'   aria-hidden="true" viewBox="0 0 ${this.view} ${this.view}">
                ${this.path ? svg`<path d=${this.path} id="path"></path>` : svg`<use id="use" xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"  href="${icon}" ></use>`}
            </svg>
        `;
    }
    
}