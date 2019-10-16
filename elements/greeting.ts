import { LitElement, html, property, customElement, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
@customElement('simple-greeting')
export class SimpleGreeting extends LitElement {
  @property() name = '中国 ';
  @property({ type: Number }) size: number = 14;
  @property({ type: Number }) itemSize: number = 10;
  static get styles() {
    return css`
        :host{
          display:block;
          color:red;
          font-size:14px;
        }
      `;

  }

  render() {
    const array: number[] = [];
    for (let i = 0, j = this.itemSize; i < j; i++) {

      array.push(i + 1);

    }
    // const result = [];
    // for (let i = 0, j = this.itemSize; i < j; i++) {
    //   result.push(html`<span>${i}  ${this.name}</span>`);
    // }
    return html`<style>:host div{font-size:${this.size + 'px'}}</style>
      <div id="test">${this.name}</div>
      ${repeat(array,
      (item) => item,
      (item, index) => html
        `<div>${item}  index=${index}</div>`)}
    `;
  }
}