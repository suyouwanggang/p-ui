import { css, customElement, html, LitElement, property } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import  './p-button';
import  './p-tips';
@customElement('p-pop')
class Ppop extends LitElement {

    static get styles() {
        return css`
        :host {
            display:inline-block;
            position:relative;
            overflow:visible;
        }
        :host([dir="top"]) ::slotted(p-pop-content){
            bottom:100%;
            left:50%;
            transform:translate(-50%,-10px) scale(0);
            transform-origin: center bottom;
        }
        :host([dir="top"]) ::slotted(p-pop-content[open]),
        :host([dir="top"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
        :host([dir="top"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
            transform:translate(-50%,-10px) scale(1);
        }
        :host([dir="right"]) ::slotted(p-pop-content){
            left:100%;
            top:50%;
            transform:translate(10px,-50%) scale(0);
            transform-origin: left;
        }
        :host([dir="right"]) ::slotted(p-pop-content[open]),
        :host([dir="right"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
        :host([dir="right"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
            transform:translate(10px,-50%) scale(1);
        }
        :host([dir="bottom"]) ::slotted(p-pop-content){
            top:100%;
            left:50%;
            transform:translate(-50%,10px) scale(0);
            transform-origin: center top;
        }
        :host([dir="bottom"]) ::slotted(p-pop-content[open]),
        :host([dir="bottom"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
        :host([dir="bottom"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
            transform:translate(-50%,10px) scale(1);
        }
        :host([dir="left"]) ::slotted(p-pop-content){
            right:100%;
            top:50%;
            transform:translate(-10px,-50%) scale(0);
            transform-origin: right;
        }
        :host([dir="left"]) ::slotted(p-pop-content[open]),
        :host([dir="left"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
        :host([dir="left"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
            transform:translate(-10px,-50%) scale(1);
        }
        :host([dir="lefttop"]) ::slotted(p-pop-content){
            right:100%;
            top:0;
            transform:translate(-10px) scale(0);
            transform-origin: right top;
        }
        :host([dir="lefttop"]) ::slotted(p-pop-content[open]),
        :host([dir="lefttop"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
        :host([dir="lefttop"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
            transform:translate(-10px) scale(1);
        }
        :host([dir="leftbottom"]) ::slotted(p-pop-content){
            right:100%;
            bottom:0;
            transform:translate(-10px) scale(0);
            transform-origin: right bottom;
        }
        :host([dir="leftbottom"]) ::slotted(p-pop-content[open]),
        :host([dir="leftbottom"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
        :host([dir="leftbottom"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
            transform:translate(-10px) scale(1);
        }
        :host([dir="topleft"]) ::slotted(p-pop-content){
            bottom:100%;
            left:0;
            transform:translate(0,-10px) scale(0);
            transform-origin: left bottom;
        }
        :host([dir="topleft"]) ::slotted(p-pop-content[open]),
        :host([dir="topleft"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
        :host([dir="topleft"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
            transform:translate(0,-10px) scale(1);
        }
        :host([dir="topright"]) ::slotted(p-pop-content){
            bottom:100%;
            right:0;
            transform:translate(0,-10px) scale(0);
            transform-origin: right bottom;
        }
        :host([dir="topright"]) ::slotted(p-pop-content[open]),
        :host([dir="topright"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
        :host([dir="topright"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
            transform:translate(0,-10px) scale(1);
        }
        :host([dir="righttop"]) ::slotted(p-pop-content){
            left:100%;
            top:0;
            transform:translate(10px) scale(0);
            transform-origin: left top;
        }
        :host([dir="righttop"]) ::slotted(p-pop-content[open]),
        :host([dir="righttop"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
        :host([dir="righttop"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
            transform:translate(10px) scale(1);
        }
        :host([dir="rightbottom"]) ::slotted(p-pop-content){
            left:100%;
            bottom:0;
            transform:translate(10px) scale(0);
            transform-origin: left bottom;
        }
        :host([dir="rightbottom"]) ::slotted(p-pop-content[open]),
        :host([dir="rightbottom"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
        :host([dir="rightbottom"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
            transform:translate(10px) scale(1);
        }
        :host([dir="bottomleft"]) ::slotted(p-pop-content),
        :host(:not([dir])) ::slotted(p-pop-content){
            left:0;
            top:100%;
            transform:translate(0,10px) scale(0);
            transform-origin: left top;
        }
        :host(:not([dir])) ::slotted(p-pop-content[open]),
        :host(:not([dir])[trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
        :host(:not([dir])[trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content),
        :host([dir="bottomleft"]) ::slotted(p-pop-content[open]),
        :host([dir="bottomleft"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
        :host([dir="bottomleft"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
            transform:translate(0,10px) scale(1);
        }
        :host([dir="bottomright"]) ::slotted(p-pop-content){
            right:0;
            top:100%;
            transform:translate(0,10px) scale(0);
            transform-origin: right top;
        }
        :host([dir="bottomright"]) ::slotted(p-pop-content[open]),
        :host([dir="bottomright"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
        :host([dir="bottomright"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
            transform:translate(0,10px) scale(1);
        }
        :host([trigger="contextmenu"]) ::slotted(p-pop-content){
            right:auto;
            bottom:auto;
            left:var(--x,0);
            top:var(--y,100%);
            transform-origin: left top;
            transform:translate(5px,5px) scale(0);
            transition: .15s;
        }
        :host([trigger="contextmenu"]) ::slotted(p-pop-content[open]){
            transform:translate(5px,5px) scale(1);
        }
        :host ::slotted(p-pop-content[open]),
        :host([trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
        :host([trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
            opacity:1;
            visibility:visible;
        }
        `;
    }
    @property({ type: Boolean, reflect: true }) disabled: boolean = false;
    @property({ type: String, reflect: true }) type: string = undefined;
    @property({ type: String, reflect: true }) tipContent: string = undefined;
    @property({ type: String, reflect: true }) tipTitle: string = undefined;
    @property({ type: String, reflect: true }) okText: string = '确定';
    @property({ type: String, reflect: true }) cancelText: string = '取消';
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
            (popContent as any).isAutoCreate=true;
            popContent.tipTitle = this.tipTitle;
            popContent.okText = this.okText;
            popContent.cancelText = this.cancelText;
            this.appendChild(popContent);
        }
        return popContent;
    }
    firstUpdated() {
        const showHandler = (ev: MouseEvent) => {
            if (this.trigger !== 'contextmenu') {
                this._show(ev);
            } else {
                const event = ev as any;
                event.preventDefault();
                const path = event.path || (ev.composedPath && ev.composedPath());
                if (!path.includes(this.popContent)) {
                    this._show(ev);
                }
            }

        }
        this.addEventListener(this.trigger, showHandler);
        (this as any)._showHandler = showHandler;
        const hander = (ev: any) => {
            const popContent = this.popContent;
            const path = ev.path || (ev.composedPath && ev.composedPath());
            if (popContent && !path.includes(popContent) && !popContent.loading && !path.includes(this.children[0]) || (this.trigger === 'contextmenu') && !path.includes(popContent) && ev.which === '1') {
                popContent.open = false;
            }
        };
        document.addEventListener('mousedown', hander);
        (this as any)._mouseDown = hander;
    }
    update(changedProperties: Map<string | number | symbol, unknown>) {
        super.update(changedProperties);
        if (this.isConnected && (this as any)._showHandler) {
            const trigger = changedProperties.get('trigger');
            if (trigger !== undefined) {
                this.removeEventListener(trigger as string, (this as any)._showHandler);
                this.addEventListener(this.trigger, (this as any)._showHandler);
            }
            const pop =this.popContent as any;
            if(pop && pop.isAutoCreate){
                if( changedProperties.has('tipContent')){
                    let firstChild=pop.firstChild;
                    if(!firstChild){
                        firstChild=document.createElement('div');
                        pop.appendChild(firstChild);
                    }
                    firstChild.textContent=this.tipContent;
                }
                if( changedProperties.has('tipTitle')){
                    pop.tipTitle=this.tipTitle;
                }
            }

        }
    }
    disconnectedCallback() {
        if ((this as any)._mouseDown) {
            document.removeEventListener('mousedown', (this as any)._mouseDown);
        }
    }
}

@customElement('p-pop-content')
class PPopContent extends LitElement {
    static get styles() {
        return css`
        :host{
            position:absolute;
            display:flex;
            box-shadow: 2px 2px 15px rgba(0,0,0,0.15);
            box-sizing: border-box;
            transform:scale(0);
            opacity:0.5;
            border-radius: 3px;
            z-index:10;
            transition:.3s cubic-bezier(.645, .045, .355, 1);
            transform-origin:inherit;
            background:#fff;
            visibility:hidden;
        }
        div[part='popContent']{
            box-sizing: border-box;
            display:flex;
            width: max-content;
            margin:0.8em 2.5em 1em 1em;
            flex:1;
            flex-direction:column;
        }
       div[part=popTitle]  {
            line-height: 30px;
            font-size: 1.2em;
            color: #4c5161;
            user-select: none;
            cursor: default;
        }
        div[part=popBody] {
            flex: 1;
        }
        div[part=popTitle]:not(:empty) ~ div[part]{ //选择E元素后面的所有兄弟元素F，元素E与F必须同属一个父级
            margin-right:-1em;
        }
        div[part=popFooter]{
            margin-top:8px;
            padding: 3px 0 5px 0;
            text-align: right;
            white-space: nowrap;
        }
        p-button[part="popClose"] {
            position:absolute;
            cursor:pointer;
            right:5px;
            top:5px;
            border:0;
        }
        div[part=popFooter] >p-button {
            margin-left: 1em;
            cursor:pointer;
        }
        p-icon[part=popIcon]{
            display:flex;
            font-size:1.2em;
            color:var(--waringColor,#faad14);
            margin: 1em 0px 0px 0.8em;
            align-self:flex-start;
        }
        :host([type="confirm"]){
            min-width:250px;
        }
        :host(:not([type])) div[part=popContent],:host(:not([type])) div[part=popBody]{
            padding: 0;
        }`;
    }

    @property({ type: Boolean, reflect: true }) open: boolean = false;
    @property({ type: Boolean, reflect: true }) loading: boolean = false;
    @property({ type: Boolean, reflect: true }) hiddenClose: boolean = false;
    @property({ type: String, reflect: true }) type: string = undefined;
    @property({ type: String, reflect: true }) tipTitle: string = undefined;
    @property({ type: String, reflect: true }) okText: string = undefined;
    @property({ type: String, reflect: true }) cancelText: string = undefined;
    render() {
        return html`
            ${this.type === 'confirm' ? html`<p-icon id="popcon-type" name="question-circle" part="popIcon" ></p-icon>` : ''}
            ${this.hiddenClose ? '' : html`<p-button type="flat" shape='circle' id="btn-close" part="popClose" icon="close" @click='${this._toCloseEvent}'></p-button>`}
            <div  part="popContent">
               <div  part="popTitle" id="title">${this.tipTitle}</div>
                <div part="popBody">
                    <slot></slot>
                </div>
                ${this.type === 'confirm' ?
                html`<div  part="popFooter"><p-button id="btn-cancel" @click="${this._cancleClick}">${this.cancelText === undefined ? '取消' : this.cancelText}</p-button>
                     <p-button id="btn-submit" type="primary" @click="${this._submitClick}">${this.okText === undefined ? '确定' : this.okText}</p-button></div>`
                : ''}
            </div>
        `;
    }
    private   _toCloseEvent(ev: Event) {
        this.open = false;
        this.dispatchEvent(new CustomEvent('close'));
        //  await this.updateComplete;
    }
    private  _cancleClick(ev: Event) {
        this.open = false;
        this.dispatchEvent(new CustomEvent('cancel'));
        // await this.updateComplete;
    }
    private  _submitClick(ev: Event) {
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
                    btnSubmit!.focus();
                } else {
                    btnClose!.focus();
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

export {
    Ppop, PPopContent
};