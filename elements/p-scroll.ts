import { css, customElement, html, property, LitElement, eventOptions } from 'lit-element';
import ResizeObserver from 'resize-observer-polyfill';
const getStyleProperty = function (oE: HTMLElement, sPr: string) {
  sPr = sPr.replace(/([A-Z])/g, '-$1').toLowerCase();
  let d = document.defaultView.getComputedStyle(oE);
  return d.getPropertyValue(sPr);
}

@customElement('p-scroll')
export class PScroll extends LitElement {
  @property({ type: Boolean, reflect: true }) overflowX: boolean = true;
  @property({ type: Boolean, reflect: true }) overflowY: boolean = true;
  static minScrollheight = 7;
  static scrollWheelValue = 20;
  static get styles() {
    return css`
        :host{
          display:block;
        }
        div[part=container]{
            position:relative;
            height:100%;
            width:100%;
            overflow:hidden;
            box-sizing:border-box;
        }
       div[part=scroll-y] {
          position: absolute;
          top: 0;
          right: 0;
          width: var(--scroll-bar-width,7px);
          bottom: 0px;
          cursor: default;
          user-select: none;
        }
        div[part=scroll-y-handler],div[part=scroll-x-handler]{
          background-color: var(--scroll-bar-color, #DBDBDB);
          border-radius: 3px;
        }
        div[part=scroll-y-handler]{
            position:absolute;
            top:0;
            bottom:auto;
            width:100%;
        }
        
        div[part=scroll-y-handler]:hover,div[part=scroll-x-handler]:hover{
           background-color: var(--scroll-bar-hover-color, #BDBDBD);
        }
        div[part=scroll-x] {
          position: absolute;
          bottom: 0;
          left:0;
          right:0px;
          height: var(--scroll-bar-width,7px);
          cursor: default;
          user-select: none;
        }
        div[part=scroll-x-handler]{
            position:absolute;
            left:0;
            right:auto;
            height:100%;
        }

        div[part=content]{
          overflow:hidden;
          position:absolute;
          top:0;
          right:0;
          left:0;
          bottom:0;
          scroll-behavior:smooth;
        }
        div[part=content].showYScroll{
          right:var(--scroll-bar-width,7px);
        }
        div[part=content].showXScroll{
          bottom:var(--scroll-bar-width,7px);
        }

       
      `;
  }

  private _wheelTimeoutID: number = null;
  @eventOptions({
    passive: false
  })
  private _wheelHander(e: MouseWheelEvent) {
    const scrollObj = this;
    let changeValue = e.detail / 3;
    if (changeValue > 0) {
      changeValue = PScroll.scrollWheelValue;
    }
    window.clearTimeout(this._wheelTimeoutID);
    this._wheelTimeoutID = window.setTimeout(() => {
      scrollObj.changeYScroll(changeValue);
    }, 60);
  }

  private _touchStartX = 0;
  private _touchStartY = 0;
  private _touchStartHanlder(e: TouchEvent) {
    const touch = e.touches[0];
    this._touchStartX = touch.clientX;
    this._touchStartY = touch.clientY;
  }
  private _touchMoveHanlder(e: TouchEvent) {
    const touch = e.touches[0];
    const newX = touch.clientX;
    const newY = touch.clientY;
    const changeX = this._touchStartX - newX;
    const changeY = this._touchStartY - newY;
    event.preventDefault();
    this.changeYScroll(changeY);
    this.changeXScroll(changeX);
  }

  render() {
    return html`<div part="container">
        <div part='content' id="content" @mousewheel=${this._wheelHander} @touchmove=${this._touchMoveHanlder}  @touchstart=${this._touchStartHanlder} ><slot id='contentSlot'></slot></div>
        <div part="scroll-y" id="scroll-y"><div part="scroll-y-handler" ></div></div>
        <div part="scroll-x" id="scroll-x"><div part="scroll-x-handler"></div></div>
    </div>`
  }
  get contentDIV(): HTMLDivElement {
    return this.renderRoot.querySelector('#content');
  }
  get partYScroll(): HTMLDivElement {
    return this.renderRoot.querySelector('div[part=scroll-y]');
  }
  get partYHandler(): HTMLDivElement {
    return this.renderRoot.querySelector('div[part=scroll-y-handler]');
  }
  get partXScroll(): HTMLDivElement {
    return this.renderRoot.querySelector('div[part=scroll-x]');
  }
  get partXHandler(): HTMLDivElement {
    return this.renderRoot.querySelector('div[part=scroll-x-handler]');
  }
  private _obersver: ResizeObserver;
  firstUpdated(_changedProperties: Map<string | number | symbol, unknown>) {
    super.firstUpdated(_changedProperties);
    const scrollDiv = this;
    this._obersver = new ResizeObserver((entries: ResizeObserverEntry[], observer: ResizeObserver) => {
      this.resize();
    });
    this._obersver.observe(this);
    this.resize();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._obersver.unobserve;
    this._obersver = null;
  }

  resize() {
    const div = this.contentDIV;
    if (this.overflowY) {
      div.classList.add('showYScroll');
    } else {
      div.classList.remove('showYScroll');
    }

    if (this.overflowX) {
      div.classList.add('showXScroll');
    } else {
      div.classList.remove('showXScroll');
    }

    if (div.scrollHeight > div.offsetHeight) {
      this.partYScroll.style.display = 'block';
      this.changeYScroll();
    } else {
      this.partYScroll.style.display = 'none';
    }

    if (div.scrollWidth > div.offsetWidth) {
      this.partXScroll.style.display = 'block';
      this.changeXScroll();
    } else {
      this.partXScroll.style.display = 'none';
    }

  }
  get caculateYBarHeight() {
    let result = 0;
    const contentDIV = this.contentDIV;
    const height = contentDIV.offsetHeight;
    const scrollHeight = contentDIV.scrollHeight;
    if (scrollHeight > height) {
      const rate = height / scrollHeight;
      result = rate * height;
      if (result < PScroll.minScrollheight) {
        result = PScroll.minScrollheight;
      }
    }
    this.partYHandler.style.height = result + 'px';
    return result;
  }
  get caculateXBarWidth() {
    let result = 0;
    const contentDIV = this.contentDIV;
    const width = this.offsetWidth;
    const scrollWidth = contentDIV.scrollWidth;
    if (scrollWidth > width) {
      const rate = width / scrollWidth;
      result = rate * width;
      if (result < PScroll.minScrollheight) {
        result = PScroll.minScrollheight;
      }
    }
    this.partXHandler.style.width = result + 'px';
    return result;
  }
  caculateYBarPosition() {
    const contentDIV = this.contentDIV;
    const height = this.offsetHeight;
    const scrollHeight = contentDIV.scrollHeight;
    if (scrollHeight <= height) {
      this.partYHandler.style.top = '0';
      return 0;
    } else {
      const barHeight = this.caculateYBarHeight;
      this.partYHandler.style.height = barHeight + 'px';
      const canScrollDIVHeight = this.partYScroll.offsetHeight - barHeight;
      const topHeight = contentDIV.scrollTop / (scrollHeight - height) * canScrollDIVHeight;
      this.partYHandler.style.top = topHeight + 'px';
      return topHeight;
    }
  }

  caculateXBarPosition() {
    const contentDIV = this.contentDIV;
    const width = contentDIV.offsetWidth;
    const scrollWidth = this.scrollWidth;
    if (scrollWidth < width) {
      this.partXHandler.style.left = '0';
      return 0;
    } else {
      const barHeight = this.caculateXBarWidth;
      this.partXHandler.style.width = barHeight + 'px';
      const canScrollDIVHeight = this.partXScroll.offsetWidth - barHeight;
      const topHeight = contentDIV.scrollLeft / (scrollWidth - width) * canScrollDIVHeight;
      this.partXHandler.style.left = topHeight + 'px';
      return topHeight;
    }
  }
  changeYScroll(scrollValue: number = 0) {
    const contentDIV = this.contentDIV;
    const height = contentDIV.offsetHeight;
    const scrollHeight = contentDIV.scrollHeight;
    const maxScroll = scrollHeight - height;
    const oldScrollTop = contentDIV.scrollTop;
    let scrollTop = oldScrollTop;
    if (oldScrollTop > maxScroll) {
      scrollTop = maxScroll;
    }
    scrollTop += scrollValue;
    if (scrollTop > maxScroll) {
      scrollTop = maxScroll;
    }
    if (scrollTop < 0) {
      scrollTop = 0;
    }
    contentDIV.scrollTop = scrollTop;
    this.caculateYBarPosition();
  }
  changeXScroll(scrollValue: number = 0) {
    const contentDIV = this.contentDIV;
    const width = contentDIV.offsetWidth;
    const scrollWidth = contentDIV.scrollWidth;
    const maxScroll = scrollWidth - width;
    const oldScrollLeft = contentDIV.scrollLeft;
    let scrollLeft = oldScrollLeft;
    if (oldScrollLeft > maxScroll) {
      scrollLeft = maxScroll;
    }
    scrollLeft += scrollValue;
    if (scrollLeft > maxScroll) {
      scrollLeft = maxScroll;
    }
    if (scrollLeft < 0) {
      scrollLeft = 0;
    }
    contentDIV.scrollLeft = scrollLeft;
    this.caculateXBarPosition();
  }

  changeYBarPosition(changeValue: number = 0) {
    const contentDIV = this.contentDIV;
    let scrollTop = parseInt(getStyleProperty(this.partYHandler, 'top'), 10);
    const barHeight = this.caculateYBarHeight;
    const offsetheight = contentDIV.scrollHeight;
    const contentScrollHeight = offsetheight - contentDIV.offsetHeight;
    const maxScrollTop = contentScrollHeight > 0 ? this.partYScroll.offsetHeight - barHeight : 0;
    scrollTop += changeValue;
    if (scrollTop > maxScrollTop) {
      scrollTop = maxScrollTop;
    }
    if (scrollTop < 0) {
      scrollTop = 0;
    }
    this.partYHandler.style.top = scrollTop + 'px';
    let contentScrollTopValue = 0;
    if (contentScrollHeight > 0) {
      const canScrollDIVHeight = offsetheight - barHeight;
      contentScrollTopValue = scrollTop * (contentDIV.scrollHeight - offsetheight) / canScrollDIVHeight;
      contentDIV.scrollTop = contentScrollTopValue;
    } else {
      contentDIV.scrollTop = 0;
    }
  }
  changeXBarPosition(changeValue: number = 0) {
    const contentDIV = this.contentDIV;
    let scrollLeft = parseInt(getStyleProperty(this.partXHandler, 'left'), 10);
    const barWidth = this.caculateXBarWidth;
    const offsetWidth = contentDIV.scrollWidth;
    const contentScrollWidth = offsetWidth - contentDIV.offsetWidth;
    const maxScrollTop = contentScrollWidth > 0 ? this.partXScroll.offsetWidth - barWidth : 0;
    scrollLeft += changeValue;
    if (scrollLeft > maxScrollTop) {
      scrollLeft = maxScrollTop;
    }
    if (scrollLeft < 0) {
      scrollLeft = 0;
    }
    this.partXHandler.style.left = scrollLeft + 'px';
    let contentScrollTopValue = 0;
    if (contentScrollWidth > 0) {
      const canScrollDIVWidth = offsetWidth - barWidth;
      contentScrollTopValue = scrollLeft * (contentDIV.scrollWidth - offsetWidth) / canScrollDIVWidth;
      contentDIV.scrollLeft = contentScrollTopValue;
    } else {
      contentDIV.scrollLeft = 0;
    }

  }

  scrollYToEnd() {
    const offsetHeight = this.contentDIV.offsetHeight;
    const maxScrollTop = this.contentDIV.scrollHeight - offsetHeight;
    this.changeYScroll(maxScrollTop);
  }
  scrollYToValue(scrollTop: number = 0) {
    const currentTop = this.contentDIV.scrollTop;
    this.changeYScroll(scrollTop - currentTop);

  }

  scrollXToEnd() {
    const offsetWidth = this.contentDIV.offsetWidth;
    const maxScrollTop = this.contentDIV.scrollWidth - offsetWidth;
    this.changeXScroll(maxScrollTop);
  }
  scrollXToValue(scrollLeft: number = 0) {
    const currentLeft = this.contentDIV.scrollLeft;
    this.changeXScroll(scrollLeft - currentLeft);
  }

  updated(_changedProperties: Map<string | number | symbol, unknown>) {


  }
}


declare global {
  interface HTMLElementTagNameMap {
    'p-scroll': PScroll;
  }
}
