import { css, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import PColorPanel from './p-color-panel';
@customElement('p-color')
export default class PColor extends LitElement {
    static get styles() {
        return css`
        :host{
            display:inline-block;
            width:30px;
            height:30px;
            font-size:14px;
        }
        :host([block]){
            display:block;
        }

        :host([disabled]){
            pointer-events:none;
        }
        
        :host(:focus-within) p-pop,:host(:hover) p-pop{ 
            z-index: 2;
        }
        p-pop{
            display:block;
            width:100%;
            height:100%;
        }
        .color-btn{
            width:100%;
            height:100%;
            padding:5px;
            background-clip: content-box;
            background-color:var(--themeColor,#42b983);
        }
        .color-btn:hover{
            z-index: auto;
        }
        p-pop-content{
            min-width:100%;
        }
        .pop-footer{
            display:flex;
            justify-content:flex-end;
            padding:0 .8em .8em;
        }
        .pop-footer p-button{
            font-size: inherit;
            margin-left: .8em;
        }
        .color-btn::before{
            content:'';
            position:absolute;
            left:5px;
            top:5px;
            right:5px;
            bottom:5px;
            z-index:-1;
            background:linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 ),linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 );
            background-position:0 0,5px 5px;
            background-size:10px 10px;
        `;
    };
    @property({ type: Boolean, reflect: true}) disabled=false;
    @property({ type: String, reflect: true }) value = '#ff0000';
    @property({ type: String, reflect: true }) dir = 'bottomleft';
    render():TemplateResult {
        return  html`<p-pop id='popover' .dir=${this.dir} >
            <p-button class='color-btn' id="color-btn"  style='--themeColor:${this.value};' ?disabled=${this.disabled} ></p-button>
            <p-pop-content id='popcon'>
                <div class='pop-footer'>
                    <p-button autoclose>取消</p-button>
                    <p-button type='primary' id='btn-submit' autoclose>确认</p-button>
                </div>
            </p-pop-content>
        </p-pop>`;
    };
    dispatchChangeEvent(){
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                value: this.value
            }
        }));
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
        })
        btnSubmit.addEventListener('click', (event:Event) => {
            this.value = this.colorPane.copyValue;
            this.dispatchChangeEvent();
        })
        popcon.addEventListener('close', (event:Event) => {
            this.colorPane.value = this.value;
        })
    }
    colorPane: PColorPanel = undefined;

}