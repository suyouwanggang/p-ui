// tslint:disable-next-line: quotemark
import { LitElement, customElement, html, css, property, TemplateResult } from "lit-element";
import { } from './p-icon';
import { ifDefined } from 'lit-html/directives/if-defined';
type targetType = '_blank' | '_parent' | '_self' | '_top';
type shapeType = 'circle' | '';
type typeType = 'primary' | 'danger' | 'flat' | 'dashed';

@customElement('p-button')
export default class PButton extends LitElement {

    static get styles() {
        return css`
          :host{
            position:relative;
            display:inline-flex;
            padding: .25em .625em;
            box-sizing:border-box;
            vertical-align: middle;
            line-height: 1.8;
            overflow:hidden;
            align-items:center;
            justify-content: center;
            border:1px solid var(--borderColor,rgba(0,0,0,.2));
            font-size: 14px;
            color: var(--fontColor,#333);
            border-radius: var(--borderRadius,.25em);
            transition:background .3s,box-shadow .3s,border-color .3s,color .3s;
        }
        :host([shape="circle"]){
            border-radius:50%;
        }

 		:host(:not([disabled]):active){
            z-index:1;
            transform:translateY(.1em);
        }
        :host([disabled]),:host([loading]){
            pointer-events: none;
            opacity:.6;
        }
        :host([block]){
            display:flex;
        }
        :host([disabled]:not([type])){
            background:rgba(0,0,0,.1);
        }
        :host([disabled]) .btn,:host([loading]) .btn{
            cursor: not-allowed;
            pointer-events: all;
        }
        :host(:not([type="primary"]):not([type="danger"]):not([disabled]):hover),
        :host(:not([type="primary"]):not([type="danger"]):focus-within),
        :host([type="flat"][focus]){
            color:var(--themeColor,#42b983);
            border-color: var(--themeColor,#42b983);
        }
        :host(:not([type="primary"]):not([type="danger"])) .btn::after{
            background-image: radial-gradient(circle, var(--themeColor,#42b983) 10%, transparent 10.01%);
        }
        :host([type="primary"]){
            color: #fff;
            background:var(--themeBackground,var(--themeColor,#42b983));
        }
        :host([type="danger"]){
            color: #fff;
            background:var(--themeBackground,var(--dangerColor,#ff7875));
        }
        :host([type="dashed"]){
            border-style:dashed
        }
        :host([type="flat"]),:host([type="primary"]),:host([type="danger"]){
            border:0;
            padding: calc( .25em + 1px ) calc( .625em + 1px );
        }
        :host([type="flat"]) .btn::before{
            content:'';
            position:absolute;
            background:var(--themeColor,#42b983);
            pointer-events:none;
            left:0;
            right:0;
            top:0;
            bottom:0;
            opacity:0;
            transition:.3s;
        }
        :host([type="flat"]:not([disabled]):hover) .btn::before{
            opacity:.1
        }
        .btn{
            background:none;
            outline:0;
            border:0;
            position:  absolute;
            left:0;
            top:0;
            width:100%;
            height:100%;
            padding:0;
            user-select: none;
            cursor: unset;
        }
        p-loading{
            margin-right: 0.35em;
        }
        ::-moz-focus-inner{
            border:0;
        }
        .btn::before{
            content: "";
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            left:0;
            top:0;
            transition:.2s;
            background:#fff;
            opacity:0;
        }
        :host(:not([disabled]):active) .btn::before{
            opacity:.2;
        }

        .btn::after {
            content: "";
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            left: var(--x,0);
            top: var(--y,0);
            pointer-events: none;
            background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
            background-repeat: no-repeat;
            background-position: 50%;
            transform: translate(-50%,-50%) scale(10);
            opacity: 0;
            transition: transform .3s, opacity .8s;
        }
        .btn:not([disabled]):active::after {
            transform: translate(-50%,-50%) scale(0);
            opacity: .3;
            transition: 0s;
        }
        p-icon{
            margin-right: 0.35em;
            transition: none;
        }
        :host(:empty) p-icon{
            margin: auto;
        }
        :host(:empty){
            padding: .65em;
        }
        :host([type="flat"]:empty),:host([type="primary"]:empty){
            padding: calc( .65em + 1px );
        }
        ::slotted(p-icon){
            transition: none;
        }
        :host([href]){
            cursor:pointer;
        }
        `;

    }
    @property({ type: Boolean }) disabled: boolean;
    @property({ type: Boolean, reflect: true }) block: boolean;
    @property({ type: Boolean }) toggle: boolean;
    @property({ type: String, reflect: true }) type: typeType;
    @property({ type: String, reflect: true }) shape: shapeType;
    @property({ type: String, reflect: true }) name: string;
    @property({ type: String, reflect: true }) value: string;
    @property({ type: Boolean, reflect: true }) checked: boolean;
    @property({ type: Boolean, reflect: true }) loading: boolean = false;
    @property({ type: String, reflect: true }) href: string;
    @property({ type: String, reflect: false }) target: targetType = '_blank';
    @property({ type: String, reflect: true }) rel: string;
    @property({ type: String, reflect: true }) download: string;//下载图片名称
    @property({ type: String, reflect: true }) icon: string;

    firstUpdated() {
        // this.btn.addEventListener('mousedown', (ev:MouseEvent) =>{
        //     // const { left, top } = this.getBoundingClientRect();
        //     // this.style.setProperty('--x',(ev.clientX - left)+'px');
        //     // this.style.setProperty('--y',(ev.clientY - top)+'px');
        // });
        this.addEventListener('click', (ev: MouseEvent) => {
            if (this.disabled) {
                ev.preventDefault();
            }
            const { left, top } = this.getBoundingClientRect();
            this.style.setProperty('--x', (ev.clientX - left) + 'px');
            this.style.setProperty('--y', (ev.clientY - top) + 'px');
            if (this.toggle) {
                this.checked = !this.checked;
            }
        })
        this.btn.addEventListener('keydown', (ev: KeyboardEvent) => {
            switch (ev.keyCode) {
                case 13://Enter
                    ev.stopPropagation();
                    break;
                default:
                    break;
            }
        });
    }
    render() {
        let renderIcon: TemplateResult;
        if (this.icon && this.icon != null) {
            renderIcon = html`<p-icon id='icon' .name='${this.icon}'> </p-icon>`;
        }
        return html`${this.href ?
            html`<a id='btn' class='btn' ?disabled=${this.disabled} download=${ifDefined(this.download)} href='${ifDefined(this.href)}' target=${ifDefined(this.target)}></a>` :
            html`<button id='btn'   class='btn' ?disabled=${this.disabled}></button>`}
                ${this.loading ? html`<p-loading id='loadingIcon'> </p-loading>` : ''}
             ${renderIcon} <slot></slot>`;
    }
    get iconEl() {
        return this.renderRoot.querySelector('#icon');
    }
    get btn() {
        return this.renderRoot.querySelector('#btn');
    }
}


@customElement('p-button-group')
export class PButtonGroup extends LitElement {

    static get styles() {
        return css`
    :host {
        display:inline-flex;
    }
    ::slotted(p-button:not(:first-of-type):not(:last-of-type)){
        border-radius:0;
    }
    ::slotted(p-button){
        margin:0!important;
    }
    ::slotted(p-button:not(:first-of-type)){
        margin-left:-1px!important;
    }
    ::slotted(p-button[type]:not([type="dashed"]):not(:first-of-type)){
        margin-left:1px!important;
    }
    ::slotted(p-button:first-of-type){
        border-top-right-radius: 0;
        border-bottom-right-radius: 0px;
    }
    ::slotted(p-button:last-of-type){
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    `;
    }

    get elements(): NodeListOf<PButton> {
        return this.querySelectorAll('p-button');
    }
    firstUpdated() {
        const slot = this.renderRoot.querySelector('#slot');
        const child = this.elements;
        const group = this;
        slot.addEventListener('slotchange', () => {
            const handler = (ev: Event) => {
                const button: PButton = ev.target as PButton;
                group.value = button.value;
                const e = new CustomEvent('change', {
                    detail: {
                        value: button.value
                    }
                })
                group.dispatchEvent(e);
            }
            child.forEach((el: PButton) => {
                el.addEventListener('click', handler);
            });
        });
    }
    @property({ type: String }) value: string;
    @property({ type: String, reflect: true }) name: string;
    render() {
        return html`
        <slot id='slot'></slot>
    `;
    }
}



