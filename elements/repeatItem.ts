
import { LitElement, html, customElement, css, property } from 'lit-element';

@customElement('repeat-item')
export class RepeatITem extends LitElement {

  constructor() {
    super();
    

  }
  @property({ type: Number }) repateTimes: number = 10;
  @property({ type: String }) templateID: string = '';


  static styles = css`
  :host {
    display: block;
  }
  `;

  render() {
    return html`<slot><div>${this.templateID} --hello world--${this.repateTimes}</div></slot>`;

  }

}