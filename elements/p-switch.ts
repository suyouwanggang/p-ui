import { LitElement, html, customElement, property, css } from 'lit-element'
@customElement('p-switch')
export class PSwitch extends LitElement {
    @property({ type: Boolean }) disabled: boolean = false;
    @property({ type: String }) value: string = '';
    @property({ type: Boolean }) checked: boolean = false;
    @property({ type: String }) name: string = '';
    static get formAssociated() {
        return true;
    }
    static styles = css`
        :host{
            display:inline-block;
        }
        label{
            background-color:#eee;
            display:inline-block;
            width:2.4em;
            height:1.2em;
            padding:.125em;
            vertical-align: middle;
            border-radius:1.2em;
            transition:.3s width,.3s height,.3s background-color,0.3s box-shadow;
            text-align:left;
            cursor:pointer;
        }
        label[disabled]{
            pointer-events: all;
            cursor:not-allowed;
            opacity:0.4;
        }
        label[checked]{
            background-color:var(--themeBackground,var(--themeColor,#42b983));
            text-align:right;
        }
        label:after{
            content:'';
            display:inline-block;
            width:.4em;
            height:.4em;
            border-radius:1.2em;
            border:.4em solid #fff;
            background:#fff;
            transition:.3s background-color,.3s padding,.3s width,.3s height,.3s border-radius,.3s border;
            box-shadow: 0 2px 4px 0 rgba(0,35,11,0.2);
        }
        
        label:active{
            box-shadow: #eee 0 0 1px 2px;
        }
    `;

    constructor() {
        super();

    }
    changeCheck() {
        if (this.disabled) {
            return;
        } else {
            // this.renderRoot.querySelector('label')!.classList.add('clickIng');
            this.checked = !this.checked;
            this.dispatchEvent(new CustomEvent('change', {
                detail: {
                    checked: this.checked
                }
            }));
        }

    }
    onTransitionend() {
        const label = this.renderRoot.querySelector('label');
        if (label != null && label.classList.contains('clickIng')) {
            // label.classList.remove('clickIng');
        }

    }
    render() {
        return html`<label ?disabled=${this.disabled} value=${this.value} ?checked=${this.checked} name=${this.name} @transitionend="${this.onTransitionend}" @click="${this.changeCheck}"></label>`;
    }


}