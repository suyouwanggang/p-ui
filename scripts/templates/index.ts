import {  property,  html,  customElement,  CSSResult,  css,  TemplateResult,  LitElement} from 'lit-element';
import styleObj from './%%%.scss';

@customElement('p-%%%')
export class P%%% extends LitElement {

  static styles: CSSResult = styleObj;

  @property({ type: Boolean })
  active = true;

  render() {

    return html`      
      <section ?active=${this.active}>
        <slot></slot>
      </section>
    `;
  }
}