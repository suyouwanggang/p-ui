import { css, customElement, html, LitElement, property } from 'lit-element';
import { PInput } from '../input/index';
import PButton from '../button';
type DialogType = 'dialog' | 'Alert' | 'success' | 'info' | 'error' | 'warning' | 'confirm' | 'prompt';
import PDialogStyle from './style.scss';
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
        return PDialogStyle;
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


