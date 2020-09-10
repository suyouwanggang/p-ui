import { css, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
/**
 * @event  tab-change 页签改变事件
 * @event  tab-change-end 页签改变完成事件
 * 
 */
type tabPosition = 'top' | 'bottom' | 'left' | 'right';
type tabAgile = '' | 'space-around' | 'space-between' | 'space-evenly' | 'flex-start' | 'flex-end';
@customElement('p-tab')
class PTab extends LitElement {


    static get styles() {
        return css`
            :host{
                display:block;
                text-align:unset;
            }
            .tab_container{
                display: flex;
                flex-direction: column;
            }
         .tab_nav_con{
            flex:0 0 auto;
            position:relative;
            overflow: hidden;
            display: flex;
            color:var(--tab-font-color);
            scroll-behavior: smooth;
        }
        .tab_content{
           display:block;
		   flex:1;
           padding:10px;
           border-top: 1px solid var(--tab-border-color, rgba(0,0,0,.2));
        }
        .tab_tabs {
            white-space:nowrap;
            border-bottom:var(--tab-border-size,2px) solid #FFF;
            padding:0.4em 1em;
            cursor: pointer;
        }
        .tab_tabs .p-tab-icon{
            margin-left:0.4em;
        }
        .tab_tabs[disabled]{
            opacity: 0.4;
            cursor: not-allowed;
        }
       .tab_on{
            border-bottom-color:var(--tab-border-on-color,var(--themeColor,#42b983));
        }
       .tab_container[tabPosition=left],
       .tab_container[tabPosition=right]{
            flex-direction: row;
       }
       .tab_container[tabPosition=left] .tab_nav_con,
       .tab_container[tabPosition=right] .tab_nav_con{
           display: flex;
           flex-direction: column;
           overflow: hidden;
       }
       .tab_container[tabPosition=right] .tab_nav_con{
           order:1;
           border-left:1px solid var(--tab-border-color,rgba(0,0,0,.2) );
       }
       .tab_container[tabPosition=left]  .tab_tabs{
            display: block;
            padding:0.6em 0.3em ;
            border-right:var(--tab-border-size,2px) solid #FFF;
       }
       .tab_container[tabPosition=left] .tab_on{
            border-bottom: none;
            border-right:var(--tab-border-size,2px) solid var(--tab-border-on-color,var(--themeColor,#42b983));
       }
       .tab_container[tabPosition=right]  .tab_tabs{
            display: block;
            padding:0.6em 0.3em ;
            border-left:var(--tab-border-size,2px) solid #FFF;
            text-align: right;
       }
       .tab_container[tabPosition=right] .tab_on{
            border-bottom: none;
            border-left:var(--tab-border-size,2px) solid var(--tab-border-on-color,var(--themeColor,#42b983));
       }
       .tab_container[tabPosition=left] .tab_content{
           flex:1;
           border-top:none;
           margin-left:-1px;
           border-left:1px solid var(--tab-border-color,rgba(0,0,0,.2));
       }
       .tab_container[tabPosition=right] .tab_content{
           flex:1;
           border-top:none;
           margin-right:-1px;
           order:0;
       }
       .tab_container[tabPosition=bottom] .tab_nav_con {
            order:1;
            border-bottom: none;
       }
       .tab_container[tabPosition=bottom]  .tab_tabs{
            border-top:var(--tab-border-size,2px) solid #FFF;
       }
       .tab_container[tabPosition=bottom]  .tab_on{
            border:none;
            border-top:var(--tab-border-size,2px) solid var(--tab-border-on-color,var(--themeColor,#42b983));
       }
       .tab_container[tabPosition=bottom] .tab_content{
           order:0;
           border-top:none;
           border-bottom:1px solid var(--tab-border-color,rgba(0,0,0,.2));
       }
       ::slotted(p-tab-content){
            display:none;
       }
       ::slotted(p-tab-content[active]){
            display:block;
       }
        `;
    }

    protected renderTabTitle(tabContent: PTabContent): TemplateResult {
        const slots: HTMLSlotElement = tabContent.renderRoot.querySelector('#header');
        const nodeList: Element[] = slots.assignedElements({ flatten: true });
        const array = [];
        for (let i = 0, j = nodeList.length; i < j; i++) {
            const el: Element = nodeList[i];
            if (el instanceof HTMLTemplateElement) {
                const template = el;
                const elClone = document.importNode(template.content, true);
                array.push(elClone);
            } else if (el.nodeType === 1) {
                const EL = el as HTMLElement;
                // EL.style.display = '';
                const elClone = el.cloneNode(true) as HTMLElement;
                // elClone.removeAttribute('slot');
                array.push(elClone);
                // EL.style.display = 'none';
            }
        }
        return html`
            <div key=${tabContent.key}  ?disabled=${tabContent.disabled}
                  class="tab_tabs ${tabContent.key === this.activeKey ? 'tab_on' : ''}  tab_tabs_outer">
                  ${array.map((el) => html`${el}`)}
         </div>`;
    }
    protected renderTab(): TemplateResult | Array<TemplateResult> {
        const xTab = this;
        const childchild = this.childTabPanel;
        const result: TemplateResult[] = [];
        childchild.forEach((element, index) => {
            const tContent = element ;
            if (tContent.key == null) {
                tContent.key = index + '';
            }
            if (xTab.activeKey == null) {
                xTab.activeKey = tContent.key;
            }
            if (tContent.key === xTab.activeKey) {
                tContent.setAttribute('active', '');
            } else {
                tContent.removeAttribute('active');
            }
            result.push(this.renderTabTitle(tContent));
        });
        return result;
    }
    @property({ type: String, reflect: true }) tabPosition: tabPosition = 'top';
    @property({ type: String, reflect: true }) activeKey: string = null;
    @property({ type: String, reflect: true }) tabAgile: tabAgile = null;
    render() {
        return html`
            <div class="tab_container" tabPosition="${this.tabPosition}" >
                <div class="tab_nav_con" style="${this.tabAgile ? `justify-content:${this.tabAgile}` : ''}" id='tab_nav_con_id' >
                   ${this.renderTab()} 
                </div>
                <slot id="slots" class="tab_content" ></slot>
            </div>`;
    }
    firstUpdated() {
        const slots: HTMLSlotElement = <HTMLSlotElement>this.shadowRoot.getElementById('slots');
        slots.addEventListener('slotchange', (event) => {
            this.requestUpdate();
        });
        const tab_nav = this.renderRoot.querySelector('#tab_nav_con_id');
        tab_nav.addEventListener('click', (event: Event) => {
            let target = event.target as HTMLElement;
            if (target.nodeType !== 1) {
                target = target.parentElement;
            }
            if (target === tab_nav) {
                return;
            }
            if (target !== tab_nav) {
                target = target.closest('div.tab_tabs[key]');
            }
            const key = target.getAttribute('key');
            if (key === this.activeKey) {
                return;
            } else {
                const tabContent = this.findTab(key);
                if (tabContent === null || tabContent.disabled) {
                    return;
                }
                const beforeEvent = new CustomEvent('beforeChange', {
                    bubbles:true,
                    cancelable: true, //标识可以取消
                    detail: {
                        tabContent: tabContent,
                        label: tabContent.label,
                        key: tabContent.key
                    }
                });
                if (this.dispatchEvent(beforeEvent)) {
                    this.activeKey = tabContent.key;
                    this.dispatchChangeEvent(tabContent);
                }
            }
        });
        const stopBodyTouch = (ev: TouchEvent) => {
            ev.preventDefault();
        };
        const options = {
            passive: false
        };
        let startX: number = undefined;
        let startY: number = undefined;
        slots.addEventListener('touchstart', (event: TouchEvent) => {
            document.addEventListener('touchstart', stopBodyTouch, options);
            startX = event.changedTouches[0].pageX,
                startY = event.changedTouches[0].pageY;
        }, options);
        function GetSlideAngle(dx: number, dy: number) {
            return Math.atan2(dy, dx) * 180 / Math.PI;
        }
        //根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
        function GetSlideDirection(startX: number, startY: number, endX: number, endY: number) {
            const dy = startY - endY;
            const dx = endX - startX;
            let result = 0;
            //如果滑动距离太短
            if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
                return result;
            }
            const angle = GetSlideAngle(dx, dy);
            if (angle >= -45 && angle < 45) {
                result = 4;
            } else if (angle >= 45 && angle < 135) {
                result = 1;
            } else if (angle >= -135 && angle < -45) {
                result = 2;
            } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
                result = 3;
            }
            return result;
        }
        let toutchDirect = 0;
        slots.addEventListener('touchmove', (event: TouchEvent) => {
            const endX = event.changedTouches[0].pageX;
            const endY = event.changedTouches[0].pageY;
            toutchDirect = GetSlideDirection(startX, startY, endX, endY);
            if (toutchDirect === 3 || toutchDirect === 4) {
                event.stopPropagation();
                event.preventDefault();
                document.addEventListener('touchstart', stopBodyTouch, options);
            }
        }, options);
        slots.addEventListener('touchend', (event: TouchEvent) => {
            document.removeEventListener('touchmove', stopBodyTouch);
            document.removeEventListener('touchstart', stopBodyTouch);
            if (toutchDirect === 3 || toutchDirect === 4) {
                event.preventDefault();
                event.stopPropagation();
            }
            const tabs: PTabContent[] = [...this.querySelectorAll('p-tab-content') as any];
            let index = tabs.indexOf(this.activeTab);
            if (toutchDirect === 4) {
                //left 2 right;
                if (index > 0) {
                    index--;
                    const tab = tabs[index];
                    this.activeKey = tab.key;
                    this.dispatchChangeEvent(tab);
                }

            } else if (toutchDirect === 3) {
                //right 2 left;
                index++;
                if (index < tabs.length) {
                    const tab = tabs[index];
                    this.activeKey = tab.key;
                    this.dispatchChangeEvent(tab);
                }
            }
        });
        this.requestUpdate();
        this.setHeaderScroll();
    }
    dispatchChangeEvent(tabContent: PTabContent) {
        if (tabContent == null || tabContent.disabled) {
            return;
        }
        const detail = {
            tabContent: tabContent,
            label: tabContent.label,
            index: this.getTabIndex(tabContent),
            key: tabContent.key
        }
        this.dispatchEvent(new CustomEvent('tab-change', {
            bubbles: true,
            detail: detail
        }));
        this.activeKey = tabContent.key;
        this.setHeaderScroll();
        this.dispatchEvent(new CustomEvent('tab-change-end', {
            bubbles: true,
            detail: detail
        }));
    }
    private setHeaderScroll() {
        const header: HTMLElement = this.renderRoot.querySelector('#tab_nav_con_id');
        // tslint:disable-next-line: no-any
        const tabPos: any = {};
        const isTopPosition = this.tabPosition === 'right' || this.tabPosition === 'left';
        const items = header.querySelectorAll('div.tab_tabs[key]');
        Array.from(items).forEach((item: HTMLElement, index: number) => {
            // tslint:disable-next-line: no-any
            const cache: any = {
                index: index
            };
            if (isTopPosition) {
                cache.height = item.offsetHeight;
                cache.top = item.offsetTop;
            } else {
                cache.width = item.offsetWidth;
                cache.left = item.offsetLeft;
            }
            tabPos[item.getAttribute('key')] = cache;
        });
        // tslint:disable-next-line: no-any
        const active: any = tabPos[this.activeKey];
        if (isTopPosition) {
            header.scrollTop = Math.max(0, active.top + active.offsetHeight / 2 - header.offsetHeight / 2);
        } else {
            header.scrollLeft = Math.max(active.left + active.width / 2 - header.offsetWidth / 2);
        }
    }
    get childTabPanel() {
        const panels: Array<PTabContent> = [];
        const children = this.children;
        let temp = null;
        for (let i = 0, j = children.length; i < j; i++) {
            temp = children[i];
            if (temp instanceof PTabContent) {
                panels.push(temp);
            }
        }
        return panels;
    }
    findTab(key: string): PTabContent {
       return this.childTabPanel.find((item) =>{
           return item.key===key;
       });
    }
    getTabIndex(tab: PTabContent) {
        const children =this.childTabPanel;
        return children.indexOf(tab);
    }
    findTabByIndex(index: number): PTabContent {
        const children = this.childTabPanel;
        return index < children.length ? children[index] : null;
    }
    get activeTab(): PTabContent {
        return this.findTab(this.activeKey);
    }
    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        if (this.isConnected && (changedProperties.has('tabPosition') || changedProperties.has('tabAgile'))) {
            this.updateComplete.then(() => {
                this.setHeaderScroll();
            });
        }
    }
    //  attributeChangedCallback(name: string, oldvalue: string | null, newValue: string | null) {
    //      super.attributeChangedCallback(name, oldvalue, newValue); //一定要调用super 方法哦
    //     if (name === 'activekey' && this.hasUpdated && oldvalue !== newValue && this.renderRoot != null) {
    //         this.dispatchChangeEvent(this.findTab(newValue));
    //     }
    //  }

    set activeTabByIndex(index: number) {
        const tab = this.findTabByIndex(index);
        if (tab) {
            this.activeKey = tab.key;
        }
    }
}


@customElement('p-tab-content')
class PTabContent extends LitElement {
    static get styles() {
        return css`
        :host{
            display:none ;
        }
        :host([active]){
            display:block;
        }
        #header[name=header],   ::slotted([slot=header]){
            display:none !important;
        }`;
    }
    @property({ type: String, reflect: true }) label: string = null;
    @property({ type: String, reflect: true }) key: string = null;
    @property({ type: String, reflect: true }) icon: string = null;
    @property({ type: Boolean, reflect: true }) disabled: boolean = false;
    render() {
        const pTab: PTab = this.tab;
        return html`
            <slot id="header" name='header' style="display:none;">
                <span class='tab_label'>${this.label}</span>
                ${this.icon ? html`<p-icon class='p-tab-icon' name=${this.icon}></p-icon>` : ''}
            </slot>
        <slot></slot>`;
    }
    get tab(): PTab {
        return this.closest('p-tab');
    }
    updated(changeMap: Map<string | number | symbol, unknown>) {
        super.updated(changeMap);
        if (changeMap != null && (changeMap.has('label') || changeMap.has('icon') || changeMap.has('disabled'))) {
            this.updateTabHeader();
        }
    }
    updateTabHeader() {
        this.tab.requestUpdate();
    }
    firstUpdated() {
        const tabPanel = this;
        const slot: HTMLSlotElement = this.renderRoot.querySelector('#header');
        slot.addEventListener('slotchange', () => {
            tabPanel.updateTabHeader();
        });
    }
    setActive() {
        this.tab.activeKey = this.key;
    }
}
export { PTab, PTabContent };

declare global {
    interface HTMLElementTagNameMap {
      'p-tab': PTab;
      'p-tab-content': PTabContent;
    }
  }
