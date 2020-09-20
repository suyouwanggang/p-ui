import { css, customElement, html, LitElement, property } from 'lit-element';
import '../icon';
import '../loading';

type positionType = 'topcenter' | 'topleft' | 'topright' | 'bottomcenter' | 'bottomleft' | 'bottomright';
interface MessageType {
    text?: string;
    position?: positionType;
    duration?: number;
    loading?: boolean;
    onclose?: Function;
    color?: string;
    icon?: string;
}
import styleMessageObj from './style.scss';
@customElement('p-message')
export default class PMessage extends LitElement {
    @property({ type: Boolean, reflect: true }) loading: boolean;
    @property({ type: Boolean, reflect: true }) block: boolean;
    @property({ type: Boolean, reflect: true }) show: boolean;
    @property({ type: String, reflect: true }) icon: string;
    @property({ type: String, reflect: true }) color: string;
    @property({ type: String, reflect: true, attribute: 'horizontal-agile' }) hAgile: string;
    static styles = styleMessageObj;

    constructor() {
        super();
    }
    firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(changedProperties);
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
    static postionMap = {
        topcenter: 'top:11px;left:11px;right:11px;',
        topleft: 'top:11px;left:11px;',
        topright: 'top:11px;right:11px;',
        bottomcenter: 'bottom:11px;left:11px;right:11px;',
        bottomleft: 'bottom:11px;left:11px;',
        bottomright: 'bottom:11px;right:11px;'
    }

    static _getMessagePositionDIV = (position: positionType) => {
        const divID = `PMessage___messagePositionDIV__${position}DIV`;
        let div: HTMLElement = document.getElementById(divID);
        if (div === null) {
            div = document.createElement('div');
            (div as any).style = `position:fixed;pointer-events:none;z-index:${PMessage.zIndex};${PMessage.postionMap[position]}`;
            div.id = divID;
            document.body.appendChild(div);
        }
        return div;
    }
    static _mergerConfig(defaultInfoConfig: MessageType, text?: string | MessageType, duration: number = -1, onclose?: Function) {
        let config: MessageType = null;
        if (typeof text === 'object') {
            config = Object.assign(defaultInfoConfig, text);
        } else {
            config = defaultInfoConfig;
            config.text = text;
            if (onclose) {
                config.onclose = onclose;
            }
            if (duration) {
                config.duration = duration;
            }
        }
        return PMessage.show(config);
    }
    static show = (config: MessageType) => {
        if (config.position === undefined) {
            config.position = PMessage.DEFAULTPOSTION;
        }
        const div = PMessage._getMessagePositionDIV(config.position);
        const message: PMessage = new PMessage();
        if (config.icon) {
            message.icon = config.icon;
        }
        if (config.color) {
            message.color = config.color;
        }
        if (config.loading !== undefined) {
            message.loading = config.loading;
        }
        if (config.position.indexOf('left') >= 0) {
            message.hAgile = 'left';
        } else if (config.position.indexOf('right') >= 0) {
            message.hAgile = 'right';
        } else {
            message.hAgile = 'center';
        }
        div.appendChild(message);
        message.textContent = config.text;
        message.show = true;
        let timer: number = undefined;
        if (config.duration && config.duration > 0) {
            timer = window.setTimeout(() => {
                message.show = false;
                config.onclose && config.onclose;
                message.parentElement.removeChild(message);
            }, config.duration);
        }
        return message;
    }
    static info = (text?: string | MessageType, duration: number = 3000, onclose?: Function) => {
        const defaultInfoConfig: MessageType = { position: PMessage.DEFAULTPOSTION, duration: 3000, icon: 'info-circle-fill', color: 'var(--infoColor,#1890ff)' };
        return PMessage._mergerConfig(defaultInfoConfig, text, duration, onclose);
    }
    static error = (text?: string | MessageType, duration: number = 3000, onclose?: Function) => {
        const defaultInfoConfig: MessageType = { position: PMessage.DEFAULTPOSTION, duration: 3000, icon: 'close-circle-fill', color: 'var(--errorColor,#f4615c)' };
        return PMessage._mergerConfig(defaultInfoConfig, text, duration, onclose);
    }
    static success = (text?: string | MessageType, duration: number = 3000, onclose?: Function) => {
        const defaultInfoConfig: MessageType = { position: PMessage.DEFAULTPOSTION, duration: 3000, icon: 'check-circle-fill', color: 'var(--successColor,#52c41a)' };
        return PMessage._mergerConfig(defaultInfoConfig, text, duration, onclose);
    }
    static warning = (text?: string | MessageType, duration: number = 3000, onclose?: Function) => {
        const defaultInfoConfig: MessageType = { position: PMessage.DEFAULTPOSTION, duration: 3000, icon: 'warning-circle-fill', color: 'var(--waringColor,#faad14)' };
        return PMessage._mergerConfig(defaultInfoConfig, text, duration, onclose);
    }
    static loading = (text?: string | MessageType, duration: number = -1, onclose?: Function) => {
        const defaultInfoConfig: MessageType = { position: PMessage.DEFAULTPOSTION, duration: -1, loading: true };
        return PMessage._mergerConfig(defaultInfoConfig, text, duration, onclose);
    }
}

