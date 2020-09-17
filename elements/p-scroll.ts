import { css, customElement, eventOptions, html, LitElement, property } from 'lit-element';
import ResizeObserver from 'resize-observer-polyfill';
const getStyleProperty = function (oE: HTMLElement, sPr: string) {
  sPr = sPr.replace(/([A-Z])/g, '-$1').toLowerCase();
  let d = document.defaultView.getComputedStyle(oE);
  return d.getPropertyValue(sPr);
}
interface scrollBack{
  (x:number,y:number):void;
}
type overflowType = '' | 'hidden';
@customElement('p-scroll')
export class PScroll extends LitElement {
  @property({ type: String, reflect: true, attribute: 'overflow-x' }) overflowX: string = '';
  @property({ type: String, reflect: true, attribute: 'overflow-y' }) overflowY: string = '';
  @property({ type: Boolean, reflect: true }) keyEnable: boolean = true;
  @property({ type: Number, reflect: true, attribute: 'scroll-bar-width' }) scrollBarWidth: number = 8;
  static minScrollheight = 8;
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
          display:none;
          width: var(--scroll-bar-width,8px);
          bottom:0;
          cursor: default;
          user-select: none;
        }
        .showYScroll div[part=scroll-y]{
          display:block;
        }
        .showXScroll div[part=scroll-y]{
          bottom:var(--scroll-bar-width,8px);
        }
        
        div[part=right-bottom]{
          display:none;
          position:absolute;
          right:0;
          bottom:0;
          
        }
        .showYScroll.showXScroll div[part=right-bottom]
        {
          width: var(--scroll-bar-width,8px);
          height: var(--scroll-bar-width,8px);
          display:block;
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
        div[part=scroll-y-handler]:hover,
        div[part=scroll-x-handler]:hover{
           background-color: var(--scroll-bar-hover-color, #BDBDBD);
        }
        div[part=scroll-x] {
          position: absolute;
          bottom: 0;
          left:0;
          display:none;
          right:0;
          height: var(--scroll-bar-width,8px);
          cursor: default;
          user-select: none;
        }
        .showXScroll div[part=scroll-x]{
          display:block;
        }
        .showYScroll div[part=scroll-x]{
          right:var(--scroll-bar-width,8px);
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
          /*scroll-behavior:smooth;*/
        }
        .showYScroll div[part=content]{
          right:var(--scroll-bar-width,8px);
        }
        .showXScroll   div[part=content]{
          bottom:var(--scroll-bar-width,8px);
        }
      `;
  }
  wheelScrollChange = 60;
  private _wheelTimeoutID: number = null;
  @eventOptions({
    passive: false
  })
  private _wheelHander(e: WheelEvent) {
    const scrollObj = this;
    const changeYValue = e.deltaY;
    const changeXValue = e.deltaX;
    //console.log(e);
    //console.log(` detail=${e.detail} wheelDataX=${(e as any).wheelDeltaX} wheelDataY=${(e as any).wheelDeltaY}`);
    e.preventDefault();
    window.clearTimeout(this._wheelTimeoutID);
    this._wheelTimeoutID = window.setTimeout(() => {
      if (changeYValue != undefined) {
        scrollObj.changeYScroll((changeYValue > 0 ? 1 : -1) * this.wheelScrollChange);
      }
      if (changeXValue != undefined) {
        this.changeXScroll((changeXValue > 0 ? 1 : -1) * this.wheelScrollChange);
      }else{
        scrollObj.changeYScroll(e.detail* this.wheelScrollChange);
        // if(e.detail%2==0){
        //   scrollObj.changeXScroll(0-e.detail* this.wheelScrollChange);
        // }
      }
    }, 10);

  }
  updated(_changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(_changedProperties);
    if (_changedProperties.has('overflowX') || _changedProperties.has('overflowY') || _changedProperties.has('scrollBarWidth')) {
      this.resize();
    }
  }
  private _touchStartX = 0;
  private _touchStartY = 0;
  private _touchStartHanlder(event: TouchEvent) {
    const touch = event.touches[0];
    this._touchStartX = touch.clientX;
    this._touchStartY = touch.clientY;
  }
  private _touchMoveHanlder(event: TouchEvent) {
    const touch = event.touches[0];
    const newX = touch.clientX;
    const newY = touch.clientY;
    const changeX = this._touchStartX - newX;
    const changeY = this._touchStartY - newY;
    event.preventDefault();
    this.changeYScroll(changeY);
    this.changeXScroll(changeX);
  }

  render() {
    return html`<div  part="container" id="container" style='--scroll-bar-width:${this.scrollBarWidth}px'>
        <div part='content' id="content" @DOMMouseScroll="${this._wheelHander}" @mousewheel=${this._wheelHander} @touchmove=${this._touchMoveHanlder} 
         @touchstart=${this._touchStartHanlder} ><slot id='contentSlot'></slot></div>
        <div part="scroll-y" id="scroll-y"><div part="scroll-y-handler" ></div></div>
        <div part="scroll-x" id="scroll-x"><div part="scroll-x-handler"></div></div>
        <div part="right-bottom" id="right-bottom"></div>
    </div>`
  }
  get rightBottom(): HTMLElement {
    return this.renderRoot.querySelector("#right-bottom");
  }
  get contentDIV(): HTMLDivElement {
    return this.renderRoot.querySelector('#content');
  }
  get containerDIV(): HTMLDivElement {
    return this.renderRoot.querySelector('#container');
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

  disconnectedCallback() {
    super.disconnectedCallback();
    this._obersver.unobserve(this);
    this._obersver.unobserve(this.rightBottom);
    this._mutationObserver.disconnect();
    this._mutationObserver = null;
    this._obersver = null;
    this.removeEventListener('mouseover', this._MouseOnEventHandler);
    this.removeEventListener('mouseout', this._MouseOutEventHandler);
    document.removeEventListener('keydown', this._docEventHandler);
    
  }


  private _obersver: ResizeObserver;
  private _mutationObserver: MutationObserver;
  firstUpdated(_changedProperties: Map<string | number | symbol, unknown>) {
    super.firstUpdated(_changedProperties);
    const scrollDiv = this;
    this._intiKeyEvent();
    this._initScrollBarEvent();
    this.contentDIV.scrollTop=0;
    this.contentDIV.scrollLeft=0;
    this._obersver = new ResizeObserver((entries: ResizeObserverEntry[], observer: ResizeObserver) => {
      this.resize();
    });
    this._mutationObserver = new MutationObserver((mutation: MutationRecord[]) => {
      this.resize();
    });
    this._obersver.observe(this);
    this._obersver.observe(this.rightBottom);
    this.renderRoot.querySelector('#contentSlot').addEventListener('slotchange', () => {
      this.resize();
    });
    this.resize();
  }
  private _isMouseOn = false;
  private _MouseOnEventHandler: EventListener = null;
  private _MouseOutEventHandler: EventListener = null;
  private _docEventHandler: EventListener = null;
  private _initScrollBarEvent() {
    const scrollObj = this;
    const dragFun =(scrollDiv: HTMLElement, callBackFun:scrollBack)=> {
      let isDown = false;
      let x = 0;
      let y = 0;
      const handerDown=(event: MouseEvent) => {
        event.preventDefault();
        isDown = true;
        x = event.clientX;
        y = event.clientY;
       //console.log('mousedown');
        document.addEventListener('mousemove',handerMove);
        document.addEventListener('mouseup',handerUp);
      };
      const handerUp=(event: MouseEvent) => {
        event.preventDefault();
        isDown = false;
        x = y = 0;
        document.removeEventListener('mousemove',handerMove);
        document.removeEventListener('mouseup',handerUp);
        // console.log('mouseup');
      };
      const handerMove = (event: MouseEvent) => {
        event.preventDefault();
        let nX=event.clientX;
        let nY=event.clientY;
        if (isDown) {
          callBackFun(event.clientX - x, event.clientY-y );
          x=nX;
          y=nY;
        }
      };
      scrollDiv.addEventListener('mousedown', handerDown);
    }
      dragFun(scrollObj.partYHandler,(x:number,y:number)=>{
          scrollObj.changeYBarPosition(y);
      });
      dragFun(scrollObj.partXHandler,(x:number,y:number)=>{
          scrollObj.changeXBarPosition(x);
      });

  }
  private _intiKeyEvent() {
    this._MouseOnEventHandler = (event: Event) => {
      this._isMouseOn = true;
    }
    this._MouseOutEventHandler = (event: Event) => {
      this._isMouseOn = false;
    }
    this._docEventHandler = (event: KeyboardEvent) => {
      if (this._isMouseOn && this.keyEnable) {
        const key = event.key;
        let y = 0, x = 0;
        switch (key) {
          case 'ArrowDown':
            y = this.wheelScrollChange;
            break;
          case 'ArrowUp':
            y = 0 - this.wheelScrollChange;
            break;
          case 'ArrowLeft':
            x = 0 - this.wheelScrollChange;
            break;
          case 'ArrowRight':
            x = this.wheelScrollChange;
            break;
          default:
            break;
        }
        if (y != 0) {
          this.changeYScroll(y);
        }
        if (x != 0) {
          this.changeXScroll(x);
        }
      }
    }
    this.addEventListener('mouseover', this._MouseOnEventHandler);
    this.addEventListener('mouseout', this._MouseOutEventHandler);
    document.addEventListener('keydown', this._docEventHandler);
  }


  resize() {
    const container = this.containerDIV;
    const div = this.contentDIV;
    if (this.overflowY != 'hidden') {
      container.classList.add('showYScroll');
    } else {
      container.classList.remove('showYScroll');
    }
    if (this.overflowX != 'hidden') {
      container.classList.add('showXScroll');
    } else {
      container.classList.remove('showXScroll');
    }

    if (div.scrollHeight > div.offsetHeight) {
      this.changeYScroll();
    } else {
      container.classList.remove('showYScroll');
    }

    if (div.scrollWidth > div.offsetWidth) {
      this.changeXScroll();
    } else {
      container.classList.remove('showXScroll');
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
    const height = contentDIV.offsetHeight;
    const scrollHeight = contentDIV.scrollHeight;
    if (scrollHeight <= height) {
      this.partYHandler.style.top = '0';
      return 0;
    } else {
      const barHeight = this.caculateYBarHeight;
      const canScrollDIVHeight = this.partYScroll.offsetHeight - barHeight;
      const topHeight = contentDIV.scrollTop / (scrollHeight - height) * canScrollDIVHeight;
      this.partYHandler.style.top = topHeight + 'px';
      return topHeight;
    }
  }

  caculateXBarPosition() {
    const contentDIV = this.contentDIV;
    const width = contentDIV.offsetWidth;
    const scrollWidth = contentDIV.scrollWidth;
    if (scrollWidth <= width) {
      this.partXHandler.style.left = '0';
      return 0;
    } else {
      const barWidth = this.caculateXBarWidth;
      const canScrollDIVHeight = this.partXScroll.offsetWidth - barWidth;
      const topWidth = contentDIV.scrollLeft / (scrollWidth - width) * canScrollDIVHeight;
      this.partXHandler.style.left = topWidth + 'px';
      return topWidth;
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
    const offsetheight = contentDIV.offsetHeight;
    const contentScrollHeight = contentDIV.scrollHeight - offsetheight;
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
      const canScrollDIVHeight = this.partYScroll.offsetHeight - barHeight;
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
    const offsetWidth = contentDIV.offsetWidth;
    const contentScrollWidth = contentDIV.scrollWidth - contentDIV.offsetWidth;
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

}


declare global {
  interface HTMLElementTagNameMap {
    'p-scroll': PScroll;
  }
}
