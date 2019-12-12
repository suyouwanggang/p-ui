import { css, customElement, html, LitElement, property } from 'lit-element';
import './p-icon';
import './p-loading';


@customElement('p-message')
export class PMessage extends LitElement {
    @property({ type: Boolean, reflect: true }) loading: boolean;
    @property({ type: Boolean, reflect: true }) block: boolean;
    @property({ type: Boolean, reflect: true }) show: boolean;
    @property({ type: Boolean, reflect: true }) removeAble: boolean;
    @property({ type: String, reflect: true }) icon: string;
    @property({ type: String, reflect: true }) color: string;
    static styles = css`
        :host{
            display:none;
            visibility:hidden;
            opacity:0;
            transition:.3s;
            z-index:10;
            transition:.3s display cubic-bezier(.645, .045, .355, 1) ;
        }
        :host([show]){
            display:flex;
            opacity:1;
            visibility:visible;
        }
        :host([block][show]){
            display:block;
        }
        .message{
            margin:auto;
            display:flex;
            padding:10px 15px;
            margin-top:10px;
            align-items:center;
            font-size: 14px;
            color: #666;
            background: #fff;
            border-radius: 3px;
            transform: translateY(-100%);
            transition:.3s transform cubic-bezier(.645, .045, .355, 1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            pointer-events:all;
        }
        :host([show]) .message{
            transform: translateY(0);
        }

        .message>*{
            margin-right:5px;
        }

        p-loading{
            display:none;
        }

        :host([show][loading]) p-loading{
            display:block;
        }
        :host p-icon{
            color:var(--themeColor,#42b983);
        }
    `;

    constructor() {
        super();
    }
    firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
        this.addEventListener('transitionend', (ev: TransitionEvent) => {
            if (ev.propertyName === 'display' && !this.show) {
                if (this.removeAble) {
                    this.parentElement.removeChild(this);
                }
                this.dispatchEvent(new CustomEvent('close'));
            }
        })
    }
    render() {
        return html`<div class="message">
        ${this.icon ? html`<p-icon id="message-type" class="message-type" name=${this.icon} color=${this.color} size="16"></p-icon>` : ''}
        <p-loading></p-loading>
        <slot></slot>
        </div>`;
    }
    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
    }
    static zIndex = 1000;
    static DEFAULTPOSTION: positionType = 'topcenter';
    static postionMap= {
        topcenter: 'top:11px;left:11px;right:11px;',
        topleft: 'top:11px;left:11px;',
        topright: 'top:11px;right:11px;',
        bottomcenter: 'bottom:11px;right:11px;',
        bottomleft: 'bottom:11px;left:11px;',
        bottomright: 'bottom:11px;right:11px;'
    }
}
type positionType = 'topcenter' | 'topleft' | 'topright' | 'bottomcenter' | 'bottomleft' | 'bottomright';
interface MessageType {
    text?: string;
    position?: positionType;
    duration?: number;
    loading?: boolean;
    onclose?: Function;
    color?: string;
    icon?: string;
};
const messageObj = {
    _getMessagePositionDIV: (position: positionType) => {
        const divID = `PMessage___messagePositionDIV__${position}DIV`;
        let div: HTMLElement = document.getElementById(divID);
        if (div === null) {
            div = document.createElement('div');
            (div as any).style = `position:fixed;pointer-events:none;z-index:${PMessage.zIndex};${PMessage.postionMap[position]}`;
            div.id = divID;
            document.body.appendChild(div);
        }
        return div;
    },
    show: (config: MessageType) => {
        if (config.position === undefined) {
            config.position = PMessage.DEFAULTPOSTION;
        }
        const div = messageObj._getMessagePositionDIV(config.position);
        const message: PMessage = new PMessage();
        message.removeAble = true;
        if (config.icon) {
            message.icon = config.icon;
        }
        if (config.color) {
            message.color = config.color;
        }
        if (config.loading !== undefined) {
            message.loading = config.loading;
        }
        div.appendChild(message);
        message.show = true;
        message.textContent = config.text;
        let timer: number = undefined;
        if (config.duration && config.duration > 0) {
            timer = window.setTimeout(() => {
                message.show = false;
                config.onclose && config.onclose;
            }, config.duration);
        }
        message.addEventListener('close', (ev: Event) => {
            timer && window.clearTimeout(timer);
            config.onclose && config.onclose();
        });
        return message;
    },
    info: (arg0?: string | MessageType, duration: number = 3000, onclose?: Function) => {
        const defaultInfoConfig: MessageType = { position: PMessage.DEFAULTPOSTION, duration: 3000, icon: 'info-circle-fill', color: 'var(--infoColor,#1890ff)' };
        let config: MessageType = null;
        if (typeof arg0 === 'object') {
            config = Object.assign(defaultInfoConfig, arg0);
        } else {
            config = defaultInfoConfig;
            config.text = arg0;
            if (onclose) {
                config.onclose = onclose;
            }
            if (duration) {
                config.duration = duration;
            }
        }
        return messageObj.show(config);
    },
    error: (arg0?: string | MessageType, duration: number = 3000, onclose?: Function) => {
        const defaultInfoConfig: MessageType = { position: PMessage.DEFAULTPOSTION, duration: 3000, icon: 'close-circle-fill', color: 'var(--errorColor,#f4615c)' };
        let config: MessageType = null;
        if (typeof arg0 === 'object') {
            config = Object.assign(defaultInfoConfig, arg0);
        } else {
            config = defaultInfoConfig;
            config.text = arg0;
            if (onclose) {
                config.onclose = onclose;
            }
            if (duration) {
                config.duration = duration;
            }
        }
        return messageObj.show(config);

    },
    success: (arg0?: string | MessageType, duration: number = 3000, onclose?: Function) => {
        const defaultInfoConfig: MessageType = { position: PMessage.DEFAULTPOSTION, duration: 3000, icon: 'check-circle-fill', color: 'var(--successColor,#52c41a)' };
        let config: MessageType = null;
        if (typeof arg0 === 'object') {
            config = Object.assign(defaultInfoConfig, arg0);
        } else {
            config = defaultInfoConfig;
            config.text = arg0;
            if (onclose) {
                config.onclose = onclose;
            }
            if (duration) {
                config.duration = duration;
            }
        }
        return messageObj.show(config);
    },
    warnging: (arg0?: string | MessageType, duration: number = 3000, onclose?: Function) => {
        const defaultInfoConfig: MessageType = { position: PMessage.DEFAULTPOSTION, duration: 3000, icon: 'warning-circle-fill', color: 'var(--waringColor,#faad14)' };
        let config: MessageType = null;
        if (typeof arg0 === 'object') {
            config = Object.assign(defaultInfoConfig, arg0);
        } else {
            config = defaultInfoConfig;
            config.text = arg0;
            if (onclose) {
                config.onclose = onclose;
            }
            if (duration) {
                config.duration = duration;
            }
        }
        return messageObj.show(config);
    },
    loading: (arg0?: string | MessageType, duration: number = -1, onclose?: Function) => {
        const defaultInfoConfig: MessageType = { position: PMessage.DEFAULTPOSTION, duration: -1, loading: true };
        let config: MessageType = null;
        if (typeof arg0 === 'object') {
            config = Object.assign(defaultInfoConfig, arg0);
        } else {
            config = defaultInfoConfig;
            config.text = arg0;
            if (onclose) {
                config.onclose = onclose;
            }
            if (duration) {
                config.duration = duration;
            }
        }
        return messageObj.show(config);
    },
}
Object.assign(PMessage,messageObj);
export default PMessage;
