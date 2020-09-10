import { css, customElement, html, LitElement, property } from 'lit-element';
import './p-button';
import './p-input';
import { PInput } from './p-input';
import PButton from './p-button';
type DialogType = 'dialog' | 'Alert' | 'success' | 'info' | 'error' | 'warning' | 'confirm' | 'prompt';
@customElement('p-dialog')
export default class PDialog extends LitElement {
    @property({ type: Boolean, reflect: true }) open: boolean = false;
    @property({ type: Boolean, reflect: true }) removeAble: boolean = false;
    @property({ type: Boolean, reflect: true }) autoclose: boolean = true;
    @property({ type: Boolean, reflect: true }) loading: boolean = false;
    @property({ type: String, reflect: true, attribute: 'p-title' }) title: string = undefined;
    @property({ type: String, reflect: true }) type: DialogType;
    @property({ type: String, reflect: true }) okText: string = undefined;
    @property({ type: Boolean, reflect: true }) showCancelBtn: boolean = false;
    @property({ type: String, reflect: true }) cancelText: string = undefined;
    static get styles() {
        return css`
        :host{
            position:fixed;
            display:flex;
            left:0;
            top:0;
            right:0;
            bottom:0;
            z-index:-1;
            background:rgba(0,0,0,.3);
            visibility:hidden;
            opacity:0;
            backdrop-filter: blur(3px);
            transition:.3s;
        }
        :host([open]){
            opacity:1;
            z-index:10;
            visibility:visible;
        }
        .dialog {
            display:flex;
            position:relative;
            min-width: 360px;
            margin:auto;
            box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12);
            box-sizing: border-box;
            max-width: calc(100vw - 20px);
            max-height: calc(100vh - 20px);
            border-radius: 3px;
            background-color: #fff;
            opacity:0;
            transform:scale(0.5);
            transition:.3s cubic-bezier(.645, .045, .355, 1);
        }
        .dialog-content{
            box-sizing: border-box;
            display:flex;
            width: 100%;
            padding:0 20px;
            flex:1;
            flex-direction:column;
        }
        :host([open]) .dialog{
            opacity:1;
            transform:scale(1);
        }
        .dialog-title {
            line-height: 30px;
            padding: 15px 30px 0 0;
            font-weight: 700;
            font-size: 14px;
            color: #4c5161;
            user-select: none;
            cursor: default;
        }
        .dialog-body {
            flex: 1;
            min-height: 50px;
            padding: 10px 0;
        }
        .dialog-footer {
            padding: 3px 0 20px 0;
            text-align: right;
        }
        .btn-close{
            position:absolute;
            right:10px;
            top:10px;
            border:0;
        }
        .dialog-footer p-button {
            margin-left:10px;
        }
        .dialog-type{
            display:flex;
            margin: 15px -10px 0 20px;
            width:30px;
            height:30px;
            font-size:24px;
        }
        #btn-cancel{
            visibility:hidden;
        }
        :host(:not([type])) .dialog-type,
        :host([type="prompt"]) .dialog-type{
            display:none;
        }
        p-input.prompt{
            box-sizing:border-box;
            margin-top:5px;
            margin-bottom:5px;
            width:100%;
        }
        :host(:empty) .dialog-body{
            min-height:0;
        }
        `;
    }

    typeMap(type: string) {
        let name = '';
        let color = '';
        switch (type) {
            case 'info':
                name = 'info-circle';
                color = 'var(--infoColor,#1890ff)';
                break;
            case 'success':
                name = 'check-circle';
                color = 'var(--successColor,#52c41a)';
                break;
            case 'error':
                name = 'close-circle';
                color = 'var(--errorColor,#f4615c)';
                break;
            case 'warning':
                name = 'warning-circle';
                color = 'var(--waringColor,#faad14)';
                break;
            case 'confirm':
                name = 'question-circle';
                color = 'var(--waringColor,#faad14)';
                break;
            default:
                break;
        }
        return {
            name: name,
            color: color
        };
    }
    render() {
        const dialogTypeData = this.typeMap(this.type);
        return html`
            <div class="dialog">
            <p-icon id="dialog-type" class="dialog-type" name=${dialogTypeData.name} color=${dialogTypeData.color}></p-icon>
            <div class="dialog-content">
                <div class="dialog-title" id="title">${this.title} <slot name='title'></slot></div>
                ${this.autoclose ? '' : html`<p-button class="btn-close" id="btn-close" icon="close" @click=${this.closeBtnHandler} ></p-button>`}
                <div class="dialog-body">
                    <slot></slot>
                    ${this.type === 'prompt' ? html`<p-input class='prompt' id='promptInput'></p-input>` : ''}
                </div>
                <div class="dialog-footer">
                    <slot name='footer'>
                        <p-button id="btn-cancel" @click=${this.cancelBtnHandler}>${this.cancelText}</p-button>
                        <p-button id="btn-submit" .loading=${this.loading} type="primary" @click=${this.submitBtnHandler}>${this.okText}</p-button>
                    </slot>
                </div>
            </div>
        </div>
        `;
    }
    private cancelBtn: PButton = null;
    private submitBtn: PButton = null;
    private btnActive: HTMLElement = null;
    submitBtnHandler() {
        this.dispatchEvent(new CustomEvent('submit'));
        if (!this.loading && this.autoclose) {
            this.open = false;
        }
    }
    closeBtnHandler() {
        this.open = false;
    }
    cancelBtnHandler() {
        this.dispatchEvent(new CustomEvent('cancel'));
        this.open = false;
    }
    firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(changedProperties);
        const _input: PInput = this.renderRoot.querySelector('p-input');
        const _btnSubmit: PButton = this.renderRoot.querySelector('#btn-submit');
        this. cancelBtn = this.renderRoot.querySelector('#btn-cancel');
        this.submitBtn = _btnSubmit;
        this.shadowRoot.addEventListener('transitionend', (ev: TransitionEvent) => {
            if (ev.propertyName === 'transform' && this.open) {
                if (_input) {
                    _input.focus();
                } else {
                   if (_btnSubmit) {_btnSubmit.focus(); } 
                }
            }
            if (ev.propertyName === 'transform' && !this.open) {
                if (this.removeAble) {
                    this.parentElement.removeChild(this);
                }
                this.dispatchEvent(new CustomEvent('close'));
                this.btnActive && this.btnActive.focus();
            }
        });
        this.addEventListener('wheel', (ev: WheelEvent) => {
            ev.preventDefault();
        });
    }
    update(changedProperties: Map<string | number | symbol, unknown>) {
        super.update(changedProperties);
    }
    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('open') && this.isConnected) {
            if (document.activeElement && (document.activeElement instanceof HTMLElement)) {
                this.btnActive = document.activeElement;
            }
        }
    }



    static alert = function (obj: any) {
        const dialog = new PDialog();
        document.body.appendChild(dialog);
        dialog.removeAble = true;
        if (typeof arguments[0] === 'object') {
            const { title, okText, content, ok } = arguments[0];
            dialog.title = title || 'Alert';
            dialog.okText = okText || '确 定';
            dialog.onsubmit = ok || null;
            dialog.innerHTML = content || '';
        } else {
            dialog.title = 'Alert';
            dialog.okText = '确 定';
            dialog.innerHTML = arguments[0] || '';
            dialog.onsubmit = arguments[1] || null;
        }
        dialog.open = true;
        return dialog;
    };
    static info = function () {
        const dialog = new PDialog();
        document.body.appendChild(dialog);
        dialog.type = 'info';
        dialog.removeAble = true;
        if (typeof arguments[0] === 'object') {
            const { title, oktext, content, ok } = arguments[0];
            dialog.title = title || 'Info';
            dialog.okText = oktext || '知道了';
            dialog.onsubmit = ok || null;
            dialog.innerHTML = content || '';
        } else {
            dialog.title = 'Info';
            dialog.okText = '知道了';
            dialog.innerHTML = arguments[0] || '';
            dialog.onsubmit = arguments[1] || null;
        }
        dialog.open = true;
        return dialog;
    };

    static success = function () {
        const dialog = new PDialog();
        document.body.appendChild(dialog);
        dialog.type = 'success';
        dialog.removeAble = true;
        if (typeof arguments[0] === 'object') {
            const { title, oktext, content, ok } = arguments[0];
            dialog.title = title || 'Success';
            dialog.okText = oktext || '知道了';
            dialog.onsubmit = ok || null;
            dialog.innerHTML = content || '';
        } else {
            dialog.title = 'Success';
            dialog.okText = '知道了';
            dialog.innerHTML = arguments[0] || '';
            dialog.onsubmit = arguments[1] || null;
        }
        dialog.open = true;
        return dialog;
    };
    static error = function () {
        const dialog = new PDialog();
        document.body.appendChild(dialog);
        dialog.type = 'error';
        dialog.removeAble = true;
        if (typeof arguments[0] === 'object') {
            const { title, oktext, content, ok } = arguments[0];
            dialog.title = title || 'Error';
            dialog.okText = oktext || '知道了';
            dialog.onsubmit = ok || null;
            dialog.innerHTML = content || '';
        } else {
            dialog.title = 'Error';
            dialog.okText = '知道了';
            dialog.innerHTML = arguments[0] || '';
            dialog.onsubmit = arguments[1] || null;
        }
        dialog.open = true;
        return dialog;
    };

    static warning = function () {
        const dialog = new PDialog();
        document.body.appendChild(dialog);
        dialog.type = 'warning';
        dialog.removeAble = true;
        if (typeof arguments[0] === 'object') {
            const { title, oktext, content, ok } = arguments[0];
            dialog.title = title || 'Warning';
            dialog.okText = oktext || '知道了';
            dialog.onsubmit = ok || null;
            dialog.innerHTML = content || '';
        } else {
            dialog.title = 'Warning';
            dialog.okText = '知道了';
            dialog.innerHTML = arguments[0] || '';
            dialog.onsubmit = arguments[1] || null;
        }
        dialog.open = true;
        return dialog;
    };

    static confirm =  function () {
        const dialog = new PDialog();
        document.body.appendChild(dialog);
        dialog.updateComplete.then(() =>{
            const cancelBtn: PButton = dialog.cancelBtn;
            cancelBtn!.style.visibility = 'visible';
        });
        dialog.removeAble = true;
        if (typeof arguments[0] === 'object') {
            const { title, oktext, canceltext, type, content, ok } = arguments[0];
            dialog.type = type || 'confirm';
            dialog.title = title || 'confirm';
            dialog.okText = oktext || '知道了';
            dialog.cancelText = canceltext || '取消';
            dialog.onsubmit = ok || null;
            dialog.innerHTML = content || '';
        } else {
            dialog.type = 'confirm';
            dialog.title = 'confirm';
            dialog.okText = '确 定';
            dialog.cancelText = '取 消';
            dialog.innerHTML = arguments[0] || '';
            dialog.onsubmit = arguments[1] || null;
        }
        dialog.open = true;
        return dialog;
    };

    static prompt =  function () {
        const dialog = new PDialog();
        dialog.type = 'prompt';
        document.body.appendChild(dialog);
        dialog.updateComplete.then(() =>{
            const cancelBtn: PButton = dialog.cancelBtn;
            cancelBtn!.style.visibility = 'visible';
        });
       
        dialog.removeAble = true;
        dialog.autoclose = false;
        if (typeof arguments[0] === 'object') {
            const { title, content, oktext, canceltext, ok, cancel } = arguments[0];
            dialog.title = title || 'Prompt';
            dialog.okText = oktext || '确 定';
            dialog.cancelText = canceltext || '取 消';
            dialog.innerHTML = content || '';
            const input: PInput = dialog.renderRoot.querySelector('p-input');
            input.onsubmit = dialog.onsubmit = () => {
                const value = input.value;
                if (value) {
                    ok && ok(value);
                    dialog.open = false;
                } else {
                    // XyMessage.error('内容不能为空');
                    input.focus();
                }
            };
            dialog.oncancel = cancel || null;
        } else {
            dialog.title = 'Prompt';
            dialog.okText = '确 定';
            dialog.cancelText = '取 消';
            dialog.innerHTML = arguments[0] || '';
            const input: PInput = dialog.renderRoot.querySelector('p-input');
            input.onsubmit = dialog.onsubmit = () => {
                const value = input.value;
                if (value) {
                    arguments[1] && arguments[1](value);
                    dialog.open = false;
                } else {
                    //XyMessage.error('内容不能为空');
                    input.focus();
                }
            };
            dialog.oncancel = arguments[2] || null;
        }
        dialog.open = true;
        return dialog;
    };
}


