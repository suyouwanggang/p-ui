import { css, customElement, html, LitElement, property } from 'lit-element';
@customElement('p-router-slot')
 export default class RouterSlot extends LitElement {
    static get styles() {
        return css`
        :host {
            display:contents;
        }
        `;
    }
    @property({ type: String }) route: string;
    render(){
        return html`<slot  .name=${this.route} id='slot'></slot>`;
    }
    get slotElement(){
        return this.shadowRoot.getElementById('slot');
    }
  }