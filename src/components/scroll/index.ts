import { css, customElement, eventOptions, html, LitElement, property, query } from 'lit-element';
import ResizeObserver from 'resize-observer-polyfill';
import { throttle } from '../utils/eventHelper';
import getStyleProperty from '../utils/styleUtils';
import ScrollStyleObj from './style.scss';

/**
 * (x: number, y: number): void;
 */
interface ScrollBack {
  (x: number, y: number): void;
}
type overflowType = '' | 'hidden';

/**
 * 滚动容器
 * @slot 内容slot
 * @part container the root coantainer
 * @part content children container
 * @part scroll-x 水平滚动条容器
 * @part scroll-x-handler 水平滚动条
 * @part scroll-y 竖直滚动条容器
 * @part scroll-y-handler 竖直滚动条
 *
 */
@customElement('p-scroll')
export class PScroll extends LitElement {
  /**
   * hidden,则水平滚动条永远隐藏，否则根据内容自动显示隐藏
   */
  @property({ type: String, reflect: true, attribute: 'overflow-x' }) overflowX: string = '';
  /**
   * hidden,则竖直滚动条隐藏，，否则根据内容自动显示隐藏
   */
  @property({ type: String, reflect: true, attribute: 'overflow-y' }) overflowY: string = '';
  /**
   * 是否允许 键盘 上下左右按键滚动
   */
  @property({ type: Boolean, reflect: true }) keyEnable: boolean = true;
  /**
   * 滚动条宽度
   */
  @property({ type: Number, reflect: true, attribute: 'scroll-bar-width' }) scrollBarWidth: number = 8 ;
  /**
   * 滚动条 容器宽度，必须大与 滚动条宽度
   */
  @property({ type: Number, reflect: true, attribute: 'scroll-bar-out-width' }) scrollBarOutWidth: number = 12;
  static minScrollheight = 8;
  static get styles() {
    return ScrollStyleObj;
  }
  wheelScrollChange = 120;
  @eventOptions({
    passive: false
  })
  private _wheelHander(e: WheelEvent) {
    const scrollObj = this;
    const changeYValue = e.deltaY;
    const changeXValue = e.deltaX;
    e.preventDefault();
      if (changeYValue !== undefined && changeYValue !== 0) {
        scrollObj.changeYScroll((changeYValue > 0 ? 1 : -1) * this.wheelScrollChange);
      }
      if (changeXValue !== undefined && changeXValue !== 0) {
        this.changeXScroll((changeXValue > 0 ? 1 : -1) * this.wheelScrollChange);
      } else {
        scrollObj.changeYScroll(e.detail * this.wheelScrollChange);
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
    return html`<div  part="container" id="container" style='--scroll-bar-width:${this.scrollBarWidth}px ; --scroll-bar-out-width:${this.scrollBarOutWidth}px'>
        <div part='content' id="content" @DOMMouseScroll="${this._wheelHander}" @mousewheel=${this._wheelHander} @touchmove=${this._touchMoveHanlder}
         @touchstart=${this._touchStartHanlder} >
         <div id="content-wrap" part='content-wrap'>
           <slot id='contentSlot'></slot>
          </div>
        </div>
        <div part="scroll-y" id="scroll-y"><div part="scroll-y-handler" ></div></div>
        <div part="scroll-x" id="scroll-x"><div part="scroll-x-handler"></div></div>
        <div part="right-bottom" id="right-bottom"></div>
    </div>`;
  }
  @query('#right-bottom', true)
  public rightBottom: HTMLElement;

  @query('#content', true)
  public contentDIV: HTMLDivElement;

  @query('#content-wrap', true)
  public content_wrap_DIV: HTMLDivElement;

  @query('#container', true)
  public containerDIV: HTMLDivElement;

  @query('div[part=scroll-y]', true)
  public partYScroll: HTMLDivElement;

  @query('div[part=scroll-y-handler]', true)
  public partYHandler: HTMLDivElement;

  @query('div[part=scroll-x]', true)
  public partXScroll: HTMLDivElement;

  @query('div[part=scroll-x-handler]', true)
  public partXHandler: HTMLDivElement;

  disconnectedCallback() {
    super.disconnectedCallback();
    this._obersver.unobserve(this.content_wrap_DIV);
    this._obersver.unobserve(this);
    this._obersver = null;
    this.removeEventListener('mouseover', this._MouseOnEventHandler);
    this.removeEventListener('mouseout', this._MouseOutEventHandler);
    document.removeEventListener('keydown', this._docEventHandler);
  }


  private _obersver: ResizeObserver;
  firstUpdated(_changedProperties: Map<string | number | symbol, unknown>) {
    super.firstUpdated(_changedProperties);
    this._intiKeyEvent();
    this._initScrollBarEvent();
    this.contentDIV.scrollTop = 0;
    this.contentDIV.scrollLeft = 0;
    this._obersver = new ResizeObserver((entries: ResizeObserverEntry[], observer: ResizeObserver) => {
      this.resize();
    });
    this._obersver.observe(this);
    this._obersver.observe(this.content_wrap_DIV);
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
    const dragFun = (scrollDiv: HTMLElement, callBackFun: ScrollBack) => {
      let isDown = false;
      let x = 0;
      let y = 0;
      const handerDown = (event: MouseEvent) => {
        event.preventDefault();
        isDown = true;
        x = event.clientX;
        y = event.clientY;
        //console.log('mousedown');
        document.addEventListener('mousemove', handerMove);
        document.addEventListener('mouseup', handerUp);
      };
      const handerUp = (event: MouseEvent) => {
        event.preventDefault();
        isDown = false;
        x = y = 0;
        document.removeEventListener('mousemove', handerMove);
        document.removeEventListener('mouseup', handerUp);
        // console.log('mouseup');
      };
      const handerMove = (event: MouseEvent) => {
        event.preventDefault();
        const nX = event.clientX;
        const nY = event.clientY;
        if (isDown) {
          callBackFun(event.clientX - x, event.clientY - y);
          x = nX;
          y = nY;
        }
      };
      scrollDiv.addEventListener('mousedown', handerDown);
    };
    dragFun(scrollObj.partYHandler, (x: number, y: number) => {
      scrollObj.changeYBarPosition(y);
    });
    dragFun(scrollObj.partXHandler, (x: number, y: number) => {
      scrollObj.changeXBarPosition(x);
    });

  }
  private _intiKeyEvent() {
    this._MouseOnEventHandler = (event: Event) => {
      this._isMouseOn = true;
    };
    this._MouseOutEventHandler = (event: Event) => {
      this._isMouseOn = false;
    };
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
        if (y !== 0) {
          this.changeYScroll(y);
        }
        if (x !== 0) {
          this.changeXScroll(x);
        }
      }
    };
    this.addEventListener('mouseover', this._MouseOnEventHandler);
    this.addEventListener('mouseout', this._MouseOutEventHandler);
    document.addEventListener('keydown', this._docEventHandler);
  }

  private _resizeDispachFun: () => void;
  /**
   * 当容器，或者子元素发生变化，触发resize 函数和事件
   */
  resize() {
    const container = this.containerDIV;
    const div = this.contentDIV;
    if (this.overflowY !== 'hidden') {
      container.classList.add('showYScroll');
    } else {
      container.classList.remove('showYScroll');
    }
    if (this.overflowX !== 'hidden') {
      container.classList.add('showXScroll');
    } else {
      container.classList.remove('showXScroll');
    }
    const elCompontent = this;
    if (this._resizeDispachFun == null) {
      this._resizeDispachFun = throttle(() => {
        /**
         * resize事件，当容器或者子孩子放生变化，此时触发
         */
        elCompontent.dispatchEvent(new CustomEvent('resize'));
      }, this.throttTime);
      this._resizeDispachFun();
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

  private _yDispatchMethod: (oldValue: number, newValue: number) => void = undefined;
  private _xDispatchMethod: (oldValue: number, newValue: number) => void = undefined;

  protected get xDispatchMethod() {
    const compoent = this;
    if (this._xDispatchMethod === undefined) {
      const d = (oldValue: number, newValue: number) => {
        /**
       * 水平滚动时触发 detail.value 内容区水平滚动大小 detail.oldValue 原始内容区水平滚动大小
       */
        compoent.dispatchEvent(new CustomEvent('scroll-x', {
          bubbles: true,
          detail: {
            value: newValue,
            oldValue: oldValue
          }
        }));
      };
      this._xDispatchMethod = throttle(d, this.throttTime);
    }
    return this._xDispatchMethod;
  }

  protected get yDispatchMethod() {
    const compoent = this;
    if (this._yDispatchMethod === undefined) {
      const d = (oldValue: number, newValue: number) => {
        /**
       * 水平滚动时触发 detail.value 内容区水平滚动大小 detail.oldValue 原始内容区水平滚动大小
       */
        compoent.dispatchEvent(new CustomEvent('scroll-y', {
          bubbles: true,
          detail: {
            value: newValue,
            oldValue: oldValue
          }
        }));
      };
      this._yDispatchMethod = throttle(d, this.throttTime);
    }
    return this._yDispatchMethod;
  }

  private _scrollDispatchMethod: () => void = undefined;
  protected get scrollDispatchMethod() {
    const component = this;
    if (this._scrollDispatchMethod === undefined) {

      const d = () => {
        /**
         *  滚动事件，detail scrollTop,detail scrollLeft 说明内容滚动位置,
         */
        component.dispatchEvent(new CustomEvent('scroll-change', {
          bubbles: true,
          detail: {
            scrollTop: component.contentDIV.scrollTop,
            scrollLeft: component.contentDIV.scrollLeft
          }
        }));
      };
      this._scrollDispatchMethod = throttle(d, this.throttTime);
    }
    return this._scrollDispatchMethod;
  }
  private _scrollEvent() {
    this.scrollDispatchMethod();
  }
  /**
   *
   * @param scrollValue 改变竖直内容滚动位置
   */
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
    if (oldScrollTop !== scrollTop) {
      if (scrollTop === maxScroll) {
        /**
         *  竖直滚动到底部时触发，detail.value,内容滚动高度
         */
        this.dispatchEvent(new CustomEvent('scroll-y-end', {
          bubbles: true,
          detail: {
            value: scrollTop
          }
        }));
      }
      this.yDispatchMethod(oldScrollTop, scrollTop);
      this._scrollEvent();

    }
  }
  /**
   * 事件节流时间
   */
  @property({type:Number})
  public throttTime:number = 20;
  /**
   * 改变水平内容滚动位置
   * @param scrollValue 改变多少
   */
  changeXScroll(scrollValue: number = 0) {
    const root = this;
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
    if (oldScrollLeft !== scrollLeft) {
      if (scrollLeft === maxScroll) {
        /**
         * 水平滚动到最右侧触发      * detail.value 内容水平滚动大小
         */
        this.dispatchEvent(new CustomEvent('scroll-x-end', {
          bubbles: true,
          detail: {
            value: scrollLeft
          }
        }));
      }
      this.xDispatchMethod(oldScrollLeft, scrollLeft);
      this._scrollEvent();
    }
  }
  /**
   * 改变竖直滚动调大位置
   *  @param changeValue 竖直滚动条的改变值，>0 向下
   */
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
    if (contentScrollHeight > 0) {
      const canScrollDIVHeight = this.partYScroll.offsetHeight - barHeight;
      const contentScrollTopValue = scrollTop * (contentDIV.scrollHeight - offsetheight) / canScrollDIVHeight;
      this.scrollYToValue(contentScrollTopValue);
    } else {
      this.scrollYToValue(0);
    }
  }
  /**
   * 改变水平滚动条的位置
   * @param changeValue 改变的大小
   */
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
    if (contentScrollWidth > 0) {
      const canScrollDIVWidth = offsetWidth - barWidth;
      const contentScrollValue = scrollLeft * (contentDIV.scrollWidth - offsetWidth) / canScrollDIVWidth;
      this.scrollXToValue(contentScrollValue);
    } else {
      this.scrollXToValue(0);
    }
  }
  /**
   * 竖直滚动条 滚动到底部
   */
  scrollYToEnd() {
    const contentDIV = this.contentDIV;
    const offsetHeight = contentDIV.offsetHeight;
    const maxScrollTop = contentDIV.scrollHeight - offsetHeight;
    this.changeYScroll(maxScrollTop - contentDIV.scrollTop);
  }
  /**
   * 竖直内容滚动到特定位置
   * @param scrollTop
   */
  scrollYToValue(scrollTop: number = 0) {
    const currentTop = this.contentDIV.scrollTop;
    this.changeYScroll(scrollTop - currentTop);
  }
  /**
   * 水平滚动条滚动到 最右侧
   */
  scrollXToEnd() {
    const contentDIV = this.contentDIV;
    const offsetWidth = contentDIV.offsetWidth;
    const maxScrollTop = contentDIV.scrollWidth - offsetWidth;
    this.changeXScroll(maxScrollTop - contentDIV.scrollLeft);
  }
  /**
   *
   * @param scrollLeft 水平内容滚动到特定位置
   */
  scrollXToValue(scrollLeft: number = 0) {
    const currentLeft = this.contentDIV.scrollLeft;
    this.changeXScroll(scrollLeft - currentLeft);
  }
  update( changedProperties: Map<string | number | symbol, unknown>){
    if (changedProperties.has('throttTime')) {
      this._xDispatchMethod = undefined;
      this._yDispatchMethod = undefined;
      this._scrollDispatchMethod = undefined;
    }
    super.update(changedProperties);
  }
  updated(_changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(_changedProperties);
    if (_changedProperties.has('overflowX') || _changedProperties.has('overflowY') || _changedProperties.has('scrollBarWidth') || _changedProperties.has('scrollBarOutWidth')) {
      this.resize();
    }
  }
}
