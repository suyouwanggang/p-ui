
import { css, customElement, html, internalProperty, LitElement, property, TemplateResult } from 'lit-element';

@customElement('p-lazy')
export default class PLazy extends LitElement {
    static get styles() {
        return css`
        :host{
            display:block;
            min-height:30px;
        }
        `;
    }
    private _observer: IntersectionObserver = null;
    @internalProperty() loaded = false;
    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(_changedProperties);
        this._observer = new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            const result = entries.some((ioe) => {
                const intersectionRatio = ioe.intersectionRatio;
                if (intersectionRatio > 0) {
                    return true;
                }
                return false;
            });
            if (result && !this.loaded) {
                this.loaded = true;
                this.updateComplete.then(() => {
                    this._observer.unobserve(this);
                    this._observer.disconnect();
                });
            }
        });
        this._observer.observe(this);
    }
    render() {
        if (!this.loaded) {
            return html``;
        }
        return html`<slot></slot>`;
    }
    public static wrapLazy = (template: TemplateResult) => {
        return html`<p-lazy>${template}</p-lazy>`;
    };

    updated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(_changedProperties);
    }
    disconnectedCallback() {
        this._observer.unobserve(this);
        this._observer.disconnect();
    }

}


