import { css, customElement, html, LitElement, property } from 'lit-element';
@customElement('p-row')
class PRow extends LitElement {
    @property({ type: Number, reflect: true }) grap: number = 0;
    @property({ type: Number, reflect: true }) column: number = 24;
    static styles = css`
        :host{
            display:grid;
            grid-template-columns:repeat(var(--column),1fr);
            grid-gap:var(--grap,0);
        }
    `;
    render() {
        return html`<slot></slot>`;
    }
    update(changedProperties: Map<string | number | symbol, unknown>) {
        super.update(changedProperties);
        this.style.setProperty('--column', `${this.column}`);
        this.style.setProperty('--grap', `${this.grap}px`);
    }
}

@customElement('p-col')
class PCol extends LitElement {
    @property({ type: Number, reflect: true }) span: number = 1;
    static get styles() {
        return css`
        :host{
            grid-column: span var(--span,1);
        }
    `;
    }
    render() {
        return html`<slot></slot>`;
    }
    update(changedProperties: Map<string | number | symbol, unknown>) {
        super.update(changedProperties);
        if (this.span !== undefined) {
            this.style.setProperty('--span', `${this.span}`);
        }
    }
}
type layAgileType = 'start' | 'end' | 'center';
@customElement('p-layout')
class PLayOut extends LitElement {
    @property({ type: Boolean, reflect: true }) row: boolean;
    @property({ type: Boolean, reflect: true }) expand: boolean;
    @property({ type: Boolean, reflect: true }) center: boolean;
    @property({ type: String, reflect: true }) mainAgile: layAgileType;
    @property({ type: String, reflect: true }) crossAgile: layAgileType;
    static get styles() {
        return css`
        :host{
            display:flex;
            flex-direction:column;
        }
        :host([expand]){
            flex:1;
        }
        :host([row]){
            flex-direction:row;
        }
        :host([mainAgile=start]){
            justify-content:flex-start;
        }
        :host([mainAgile=end]){
            justify-content:flex-end;
        }
        :host([mainAgile=center]){
            justify-content:center;
        }
        :host([crossAgile=start]){
            align-items:flex-start;
        }
        :host([crossAgile=end]){
            align-items:flex-end;
        }
        :host([crossAgile=center]){
            align-items:center;
        }

        :host([center]){
            justify-content:center;
            align-items:center;
        }
    `;
    }
    render() {
        return html`<slot></slot>`;
    }
    update(changedProperties: Map<string | number | symbol, unknown>) {
        super.update(changedProperties);
        if (changedProperties.has('center')) {
            this.mainAgile = 'center';
            this.crossAgile = 'center';
        }
    }
}
export {PLayOut,PRow,PCol};

