import { css, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
/**
 * @event  change beforeChange
 * 
 */
type tabPosition = 'top' | 'bottom' | 'left' | 'right';
type tabAgile = '' | 'space-around' | 'space-between' | 'space-evenly' | 'flex-start' | 'flex-end';
@customElement('p-tab')
class PTab extends LitElement {
    @property({ type: String, reflect: true }) tabPosition: tabPosition = 'top';
    @property({ type: String, reflect: true }) activeKey: string = null;
    @property({ type: String, reflect: true }) tabAgile: tabAgile = null;

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
       ::slotted(p-tab-content:not([active])){
            display:none;
       }
        `;
    }

    protected renderTabTitle(tabContent: PTabContent): TemplateResult {
        const slots: HTMLSlotElement = tabContent.renderRoot.querySelector('#header');
        const nodeList: Node[] = slots.assignedNodes({ flatten: true });
        const array = [];
        for (let i = 0, j = nodeList.length; i < j; i++) {
            let el: any = nodeList[i];
            if (el.nodeType === 1) {
                 el = el.cloneNode(true);
                 array.push(el.outerHTML);
            }
        }
        return html`
            <div key=${tabContent.key}  ?disabled=${tabContent.disabled}
                  class="tab_tabs ${tabContent.key === this.activeKey ? 'tab_on' : ''}  tab_tabs_outer">
                  ${unsafeHTML(array.join(''))}
         </div>`;
    }
    protected renderTab(): TemplateResult | Array<TemplateResult> {
        const xTab = this;
        const childchild = Array.from(this.children);
        const result: TemplateResult[] = [];
        childchild.forEach((element, index) => {
            if (element instanceof PTabContent) {
                // tslint:disable-next-line: no-unnecessary-type-assertion
                const tContent: PTabContent = element as PTabContent;
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
            }
        });
        return result;
    }
    render() {
        return html`
            <div class="tab_container" tabPosition="${this.tabPosition}" >
                <div class="tab_nav_con" style="justify-content:${this.tabAgile}" id='tab_nav_con_id' >
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
                    cancelable: true, //标识可以取消
                    detail: {
                        tabContent: tabContent,
                        label: tabContent.label,
                        key: tabContent.key
                    }
                });
                if (this.dispatchEvent(beforeEvent)) {
                    this.activeKey = tabContent.key;
                }
            }
        });
    }
    dispatchChangeEvent(tabContent: PTabContent) {
        if (tabContent == null || tabContent.disabled) {
            return;
        }
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                tabContent: tabContent,
                label: tabContent.label,
                key: tabContent.key
            }
        }));
        this.activeKey = tabContent.key;
    }

    findTab(key: string): PTabContent {
        return this.querySelector(`p-tab-content[key="${key}"]`);
    }
    findTabByIndex(index: number): PTabContent {
        const children = this.querySelectorAll('p-tab-content');
        return index < children.length ? <PTabContent>children[index] : null;
    }
    get activeTab(): PTabContent {
        return this.findTab(this.activeKey);
    }
    attributeChangedCallback(name: string, oldvalue: string | null, newValue: string | null) {
        super.attributeChangedCallback(name, oldvalue, newValue); //一定要调用super 方法哦
        if (name === 'activekey' && this.hasUpdated && oldvalue !== newValue && this.renderRoot != null) {
            this.dispatchChangeEvent(this.findTab(newValue));
        }
    }

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
       slot[name=header]{
            display:none !important;
        }`;
    }
    @property({ type: String, reflect: true })
    @property({ type: String, reflect: true }) label: string = null;
    @property({ type: String, reflect: true }) key: string = null;
    @property({ type: String, reflect: true }) icon: string = null;
    @property({ type: Boolean, reflect: true }) disabled: boolean = false;
    render() {
        const pTab: PTab = this.tab;
        return html`
            <slot id="header" name='header'>
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
        this.tab.requestUpdate();
    }
    firstUpdated() {
        const slot: HTMLSlotElement = this.renderRoot.querySelector('#header');
        slot.addEventListener('slotchange', () => {
            this.tab.requestUpdate();
        });
    }
    setActive() {
        this.tab.activeKey = this.key;
    }
}
export { PTab, PTabContent };

