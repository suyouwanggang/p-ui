
import { css, customElement, html, internalProperty, LitElement, property } from 'lit-element';
import { } from './p-icon';
@customElement('p-img')
export default class PImage extends LitElement {
    static get styles() {
        return css`
          :host{
            display:inline-block;
            position:relative;
            box-sizing:border-box;
            vertical-align: top;
            font-size:14px;
            overflow:hidden;
            color:var(--img-font-color,#666);
        }
        :host([alt]:not([default]))::before{
            content:attr(alt);
            position:absolute;
            color:#fff;
            left:0;
            right:0;
            bottom:0;
            z-index:1;
            line-height:1.5;
            font-size:14px;
            padding:5px 10px;
            background:linear-gradient(to bottom,transparent,rgba(0,0,0,.5));
            transform:translateY(100%);
            transition:.3s;
        }
        :host([alt]:hover)::before,
        :host([alt][show-alt][load])::before
        {
            transform:translateY(0);
        }
        :host([ratio*="/"]){
            width:100%;
            height:auto!important;
        }
        :host([ratio*="/"]) img{
            position:absolute;
            left: 0;
            top: 0;
            width:100%;
            height: 100%;
        }
        :host([ratio*="/"]) div.placeholder{
            position: relative;
            padding-top:100%;
        }
        img {
            box-sizing: border-box;
            color:transparent;
            display: inline-block;
            width: inherit;
            height: inherit;
            vertical-align: top;
            border:0;
            opacity:0;
            background:inherit;
            transform:scale(0);
            object-fit: cover;
            transition:.3s;
        }
        :host img[src]{
            opacity:1;
            transform:scale(1);
        }
        :host([gallery]:not([default]):not([error])){
            cursor:pointer;
        }
        :host(:not([error]):not([default]):hover) img[src],:host(:focus-within) img[src]{
            transform:scale(1.1);
        }
        :host([fit="cover"]) img{
            object-fit:cover;
        }
        :host([fit="fill"]) img{
            object-fit:fill;
        }
        :host([fit="contain"]) img{
            object-fit:contain;
        }

        .placeholder{
            position:absolute;
            width:100%;
            height:100%;
            box-sizing:border-box;
            z-index:-1;
            transition:.3s;
            background:inherit;
            visibility:hidden;
        }
        :host([error]) .placeholder{
            visibility:visible;
            z-index:2;
            background: #eee;
        }
        :host([error]) img{
            padding:0 20px;
            min-width:100px;
            min-height:100px;
            transform: none;
        }
        .loading{
            position:absolute;
            left:50%;
            top:50%;
            z-index:3;
            transform:translate(-50%,-50%);
            pointer-events:none;
            opacity:1;
            transition:.3s;
        }
        img[src]+.loading,:host([error]) .loading{
            opacity:0;
            visibility:hidden;
        }
        .placeholder p-icon {
            font-size:1.15em;
            margin-right:.4em;
        }
        .placeholder-icon{
            position:absolute;
            display:flex;
            justify-content:center;
            align-items:center;
            left:0;
            right:0;
            top:50%;
            transform:translateY(-50%);
        }
        .view{
            position:absolute;
            z-index:3;
            left:50%;
            top:50%;
            transform:translate(-50%,-50%) scale(2);
            opacity:0;
            color:#fff;
            display:none;
            font-size:40px;
            transition:.3s;
            pointer-events:none;
        }
        :host([gallery]:not([error]):not([default])) .view{
            display:inline-block;
        }
        :host([gallery]:not([error]):not([default]):hover) .view,:host(:focus-within) .view{
            opacity:1;
            transform:translate(-50%,-50%) scale(1);
        }
        .animation .shape {
            border-radius: 50%;
            background:var(--themeBackground,var(--themeColor,#42b983));
        }
        .animation{
            width:2em;
            height:2em;
            display:grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap:.7em;
            transform: rotate(45deg);
            animation: rotation 1s infinite;
        }
        .shape1 {
            animation: animation4shape1 0.3s ease 0s infinite alternate;
        }
        @keyframes rotation {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
        @keyframes animation4shape1 {
            from {
                transform: translate(0, 0);
            }
            to {
                transform: translate(5px, 5px);
            }
        }
        .shape2 {
            opacity:.8;
            animation: animation4shape2 0.3s ease 0.3s infinite alternate;
        }
        @keyframes animation4shape2 {
            from {
                transform: translate(0, 0);
            }
            to {
                transform: translate(-5px, 5px);
            }
        }
        .shape3 {
            opacity:.6;
            animation: animation4shape3 0.3s ease 0.3s infinite alternate;
        }
        @keyframes animation4shape3 {
            from {
                transform: translate(0, 0);
            }
            to {
                transform: translate(5px, -5px);
            }
        }
        .shape4 {
            opacity:.4;
            animation: animation4shape4 0.3s ease 0s infinite alternate;
        }
        @keyframes animation4shape4 {
            from {
                transform: translate(0, 0);
            }
            to {
                transform: translate(-5px, -5px);
            }
        }
        `;

    }
    /**
     * 图片比例 例如'16/9'
     */
    @property({ reflect: true, type: String, attribute: 'ratio' }) ratio: string;
    /**
     * 描述
     */
    @property({ reflect: true, type: String, attribute: 'alt' }) alt: string=undefined;
    /**
     * 是否一直显示描述
     */
    @property({ reflect: true, type: Boolean, attribute: 'show-alt' }) showAlt: boolean;
    /**
     * 是否懒加载（滚动可见此时才加载）
     */
    @property({ reflect: true, type: Boolean, attribute: 'lazy' }) lazy: boolean;
    @property({ reflect: true, type: String, attribute: 'src' }) src: string;
    @property({ reflect: true, type: String, attribute: 'error-alt' }) errorAlt: string='error';
    /**
     * 自适应  同原生object-fit，可取值cover（默认）、fill、contain
     */
    @property({ reflect: true, type: String, attribute: 'fit' }) fit: string = 'cover';
    /**
     * 如果图片加载失败，则加载默认图片
     */
    @property({ reflect: true, type: String, attribute: 'defaultsrc' }) defaultsrc: string;
    /**
     * 画廊 组名称
     */
    @property({ reflect: true, type: String, attribute: 'gallery' }) gallery: string;

    private get ratioImg() {
        const ratio = this.ratio;
        if (ratio && ratio.includes('/')) {
            const r = ratio.split('/');
            return (parseFloat(r[1]) / parseFloat(r[0]) * 100) + '%';
        }
        return 0;
    }
    private _isFirstUpdate = false;
    private _observer: IntersectionObserver = null;
    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(_changedProperties);
        if (this.lazy) {
            this._observer = new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
                entries.forEach((ioe) => {
                    const el = ioe.target;
                    const intersectionRatio = ioe.intersectionRatio;
                    if (intersectionRatio > 0 && intersectionRatio <= 1) {
                        this.load(this.src);
                        this._observer.unobserve(el);
                    }
                });
            });
        } else {
            this.load(this.src);
        }
        this._isFirstUpdate = true;
    }
    updated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(_changedProperties);
        if (this._isFirstUpdate) {
            if (_changedProperties.has('src')) {
                this.load(this.src, false);
            }
        }
    }
    set error(value: boolean) {
        if (value) {
            this.setAttribute('error', '');
        } else {
            this.removeAttribute('error');
        }
        this.requestUpdate();
    }
    @internalProperty()
    get error() {
        return this.getAttribute('error') !== null;
    }

     load(src: string, hasload: boolean = false) {
        const img = new Image();
        img.src = src;
        this.error = false;
        img.onload = () => {
            if(this.alt){
                this.img.alt = this.alt;
            }
            this.setAttribute('load','');
            this.img.src = src;
            this.error = false;
        };
        img.onerror = () => {
            this.error = true;
            this.img.removeAttribute('tabindex');
            if (this.defaultsrc && !hasload) {
                this.setAttribute('default', '');
                this.load(this.defaultsrc, true);
            }
        };
    }
    render() {
        return html`
        <div class="placeholder" id="placeholder" style=${this.ratioImg ? 'padding-top:' + this.ratioImg : ''} >
            <div class="placeholder-icon">
                <p-icon
                    path="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32z m-40 632H136v-39.9l138.5-164.3 150.1 178L658.1 489 888 761.6V792z m0-129.8L664.2 396.8c-3.2-3.8-9-3.8-12.2 0L424.6 666.4l-144-170.7c-3.2-3.8-9-3.8-12.2 0L136 652.7V232h752v430.2z">
                </p-icon>${this.error ? this.errorAlt : this.alt}
            </div>
        </div>
        <p-icon class="view" name='View'></p-icon>
        <img id="img" />
        <div class="loading">
            <div class="animation">
                <div class="shape shape1"></div>
                <div class="shape shape2"></div>
                <div class="shape shape3"></div>
                <div class="shape shape4"></div>
            </div>
        </div>
       `;
    }
    get img(): HTMLImageElement {
        return this.renderRoot.querySelector('#img');
    }
    private get placeholder() {
        return this.renderRoot.querySelector('div.placeholder');
    }

    focus() {
        this.img.focus();
    }

}


declare global {
    interface HTMLElementTagNameMap {
        'p-img': PImage;
    }
}




