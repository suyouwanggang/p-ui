import { css, customElement, html, LitElement, property } from 'lit-element';
import '../button/index';
import '../tips';
import stylePPop from './style.scss';
@customElement('p-pop')
class Ppop extends LitElement {
    static get styles() {
        return stylePPop;
    }
    @property({ type: Boolean, reflect: true }) disabled: boolean = false;
    @property({ type: String, reflect: true }) type: string = undefined;
    @property({ type: String, reflect: true }) tipContent: string = undefined;
    @property({ type: String, reflect: true }) tipTitle: string = undefined;
    @property({ type: String, reflect: true }) okText: string = undefined;
    @property({ type: String, reflect: true }) cancelText: string = undefined;
    @property({ type: String, reflect: true }) trigger: string = 'click';
    @property({ type: Boolean, reflect: true }) accomplish: boolean = false;
    render() {
        return html`<slot></slot>`;
    }
    _show(ev: MouseEvent) {
        const popContent = this.popContent;
        const event = ev as any;
        if (!this.disabled) {
            if (this.trigger === 'contextmenu') {
                const { left, top } = this.getBoundingClientRect();
                popContent!.style.setProperty('--x', ev.clientX - left + 'px');
                popContent!.style.setProperty('--y', ev.clientY - top + 'px');
                popContent!.open = true;
            } else {
                const path = event.path || (event.composedPath && ev.composedPath());
                if (!path.includes(popContent)) {
                    if (this.accomplish) {
                        popContent!.open = true;
                    } else {
                        popContent!.open = !popContent.open;
                    }
                }
            }
        }
    }
    get popContent(): PPopContent {
        let popContent: PPopContent = this.querySelector('p-pop-content');
        if (popContent === null) {
            popContent = new PPopContent();
            popContent.type = this.type;
            if (this.tipContent) {
                const div = document.createElement('div');
                div.textContent = this.tipContent;
                popContent.appendChild(div);
            }
            (popContent as any).isAutoCreate = true;
            popContent.tipTitle = this.tipTitle;
            if (this.okText ) {
                popContent.okText = this.okText;
            }
            if (this.cancelText ) {
                popContent.cancelText = this.cancelText;
            }
            this.appendChild(popContent);
        }
        return popContent;
    }
    private _bindShowHanlder = (ev: MouseEvent) => {
        if (this.trigger !== 'contextmenu') {
            this._show(ev);
        } else {
            const event = ev as any;
            ev.preventDefault();
            const path = event.path || (ev.composedPath && ev.composedPath());
            if (!path.includes(this.popContent)) {
                this._show(ev);
            }
        }
    }
    private _bindHiddenHanlder = (ev: MouseEvent) => {
        const popContent = this.popContent;
        popContent.open = false;
    }
    private _bindDocumentAutoHidde = (ev: any) => {
        const popContent = this.popContent;
        const path = ev.path || (ev.composedPath && ev.composedPath());
        if (popContent && !path.includes(popContent) && !popContent.loading && !path.includes(this.children[0]) || (this.trigger === 'contextmenu') && !path.includes(popContent) && ev.which === '1') {
             popContent.open = false;
        }
    }
    private _bindTriggerEvent(oldTirgger?: string) {
        if (oldTirgger !== undefined) {
            if (oldTirgger === 'hover') {
                this.removeEventListener('mouseenter', this._bindShowHanlder);
                this.removeEventListener('mouseleave', this._bindHiddenHanlder);
            } else {
                this.removeEventListener(oldTirgger, this._bindShowHanlder);
            }
        }
        if (this.trigger !== undefined && this.trigger !== 'hover') {
            this.addEventListener(this.trigger, this._bindShowHanlder);
        } else if ( 'hover' === this.trigger ) {
            this.addEventListener('mouseenter', this._bindShowHanlder);
            this.addEventListener('mouseleave', this._bindHiddenHanlder);
        }
    }
    private firstUpdateFlag = false;
    firstUpdated() {
        this._bindTriggerEvent();
        document.addEventListener('mousedown', this._bindDocumentAutoHidde);
        this.firstUpdateFlag = true;
    }
    update(changedProperties: Map<string | number | symbol, unknown>) {
        super.update(changedProperties);
        if (this.firstUpdateFlag) {
            const trigger = changedProperties.get('trigger') as string;
            if (trigger !== undefined) {
                this._bindTriggerEvent(trigger);
            }
            const pop = this.popContent as any;
            if (pop && pop.isAutoCreate) {
                if (changedProperties.has('tipContent')) {
                    let firstChild = pop.firstChild;
                    if (!firstChild) {
                        firstChild = document.createElement('div');
                        pop.appendChild(firstChild);
                    }
                    firstChild.textContent = this.tipContent;
                }
                if (changedProperties.has('tipTitle')) {
                    pop.tipTitle = this.tipTitle;
                }
            }

        }
    }
    disconnectedCallback() {
        document.removeEventListener('mousedown', this._bindDocumentAutoHidde);
    }
}
import PPopContentStyle from './stylePopContent.scss';
@customElement('p-pop-content')
class PPopContent extends LitElement {
    static get styles() {
        return PPopContentStyle;
    }
    @property({ type: Boolean, reflect: true }) open: boolean = false;
    @property({ type: Boolean, reflect: true }) loading: boolean = false;
    @property({ type: Boolean, reflect: true }) thinBar: boolean = false;
    @property({ type: Boolean, reflect: true }) hiddenClose: boolean = false;
    @property({ type: String, reflect: true }) type: string = undefined;
    @property({ type: String, reflect: true, attribute: 'tip-title' }) tipTitle: string = undefined;
    @property({ type: String, reflect: true, attribute: 'tip-title-icon' }) tipTitleIcon: string = undefined;
    @property({ type: String, reflect: true }) okText: string = undefined;
    @property({ type: String, reflect: true }) cancelText: string = undefined;
    render() {
        return html`
           <div  part="popTitle" id="title">
    <div class='title' part="popTitleInner"> <slot name="title"> ${this.tipTitleIcon ? html`<p-icon parent='title-icon' name='${this.tipTitleIcon}' ></p-icon>` : ''}<span part="title-span"> ${this.tipTitle}</span></slot></div>
                <slot name="title-right"> ${this.hiddenClose ? '' : html`<p-button type="flat" shape='circle' id="btn-close" part="popClose" icon="close" @click='${this._toCloseEvent}'></p-button>`}</slot>
           </div>
            <div part="popBody" >
                <slot></slot>
            </div>
            <slot name="footer">
                <div  part="popFooter">
                        ${this.type === 'confirm' ?
                    html`<p-button id="btn-cancel" @click="${this._cancleClick}">${this.cancelText === undefined ? '取消' : this.cancelText}</p-button>
                        <p-button id="btn-submit" type="primary" @click="${this._submitClick}">${this.okText === undefined ? '确定' : this.okText}</p-button>`
                    : ''}
            </div>
           </slot>
        `;
    }
    private _toCloseEvent(ev: Event) {
        this.open = false;
        this.dispatchEvent(new CustomEvent('close'));
        //  await this.updateComplete;
    }
    private _cancleClick(ev: Event) {
        this.open = false;
        this.dispatchEvent(new CustomEvent('cancel'));
        // await this.updateComplete;
    }
    private _submitClick(ev: Event) {
        this.dispatchEvent(new CustomEvent('submit'));
        if (!this.loading) {
            this.open = false;
        }
    }
    firstUpdated() {
        const btnClose = this.shadowRoot.getElementById('btn-close');
        const btnSubmit = this.shadowRoot.getElementById('btn-submit');

        this.addEventListener('transitionend', (ev) => {
            //console.log('transitionend===');
            if (ev.propertyName === 'transform' && this.open) {
                // console.log('transform===');
                if (this.type === 'confirm') {
                    if (btnSubmit) {
                        btnSubmit.focus();
                    }
                } else {
                    if (btnClose) {
                        btnClose.focus();
                    }
                }
                this.dispatchEvent(new CustomEvent('open'));
            }
            if (ev.propertyName === 'transform' && !this.open) {
                this.dispatchEvent(new CustomEvent('close'));
            }
        });

        this.addEventListener('click', (ev: Event) => {
            const el = ev.target as HTMLElement;
            if (el && el.closest('[autoclose]')) {
                this.open = false;
            }
        });
    }
}

export { Ppop, PPopContent };
