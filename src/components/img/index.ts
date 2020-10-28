
import { css, customElement, html, internalProperty, LitElement, property } from 'lit-element';
import { } from '../icon';
import style1 from './style.scss';
@customElement('p-img')
export default class PImage extends LitElement {
    static get styles() {
        return [style1];
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
            this._observer.observe(this);
        } else {
            this.load(this.src);
        }
    }
    updated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(_changedProperties);
        if (_changedProperties.has('src')&&this.src!=undefined&&this.isLoader){
            this.load(this.src);
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

    connectedCallback(){
        super.connectedCallback();
        this._observer.disconnect();
    }
    private isLoader= false;

     load(src: string, hasload: boolean = false) {
         this.isLoader=true;
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


