

import { LitElement, customElement, html, css, property, TemplateResult } from 'lit-element';
import { } from '../icon/index';
import '../loading/index';
import styleButton from './style.scss';
import styleButtoGroup from './styleButtonGroup.scss';
import { ifDefined } from 'lit-html/directives/if-defined';
type targetType = '_blank' | '_parent' | '_self' | '_top';
type shapeType = 'circle' | '';
export type buttonTypeValue = 'primary' | 'danger' | 'flat' | 'dashed';

@customElement('p-button')
export default class PButton extends LitElement {

    static get styles() {
        return styleButton;
    }
    @property({ type: Boolean,reflect:true}) disabled: boolean;
    @property({ type: Boolean, reflect: true }) block: boolean;
    @property({ type: Boolean,reflect:true }) toggle: boolean;
    @property({ type: String, reflect: true }) type: buttonTypeValue;
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
            switch (ev.key) {
                case 'Enter'://Enter
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
            html`<a id='btn' class='btn' disabled=${ifDefined(this.disabled)} download=${ifDefined(this.download)} href='${ifDefined(this.href)}' target=${ifDefined(this.target)}></a>` :
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
        return styleButtoGroup;
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



