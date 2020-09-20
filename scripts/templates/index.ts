import {
  property,
  html,
  customElement,
  CSSResult,
  unsafeCSS,
  TemplateResult,
  LitElement
} from 'lit-element';


import styles from './style.scss';

@customElement('p-%%%')
export class P%%% extends LitElement {

  static styles: CSSResult = unsafeCSS(styles);

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