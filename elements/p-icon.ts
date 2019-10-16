
import { LitElement, svg, html, customElement, property, css } from 'lit-element'
@customElement('p-icon')
export class PICon extends LitElement {
    @property({ type: Number, reflect: false }) view: number = 1024;
    @property({ type: String, reflect: true }) name: string = '';
    @property({ type: String, reflect: false }) iconPath: string = './iconfont/icon.svg';
    @property({ type: String, reflect: false }) path: string = '';
    @property({ type: Number, reflect: false }) size: number = -1;
    @property({ type: String, reflect: false }) color: string = '';
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
            /*transition:inherit;*/
        }
    `;

    constructor() {
        super();
    }

    render() {
        // let usePath= svg`${this.path? svg`<path d=${this.path} id="path"></path>` : svg`<use id="use" ></use>`}
        
        let styleValue="";
        if(this.size>= 0){
            styleValue+="font-size:"+this.size+"px;";
        }
        if(this.color){
            styleValue += `color=${this.color}`;
        }
         return svg`
             <svg xmlns="http://www.w3.org/2000/svg" class="svgclass" style='${styleValue}'   aria-hidden="true" viewBox="0 0 ${this.view} ${this.view}">
                ${this.path? svg`<path d=${this.path} id="path"></path>` :svg`<use id="use" ></use>`}
            </svg>
        `;
    }

    updated(changedProperty: any) {
        super.updated(changedProperty);
        const svg = this.shadowRoot.querySelector('svg');
        const use = svg.querySelector("#use");
        if (use) {
            use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `${this.iconPath}#icon-${this.name}`);
        }
    }
}