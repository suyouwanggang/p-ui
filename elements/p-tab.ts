import { css, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { threadId } from 'worker_threads';
type tabPosition = 'top' | 'bottom' | 'left' | 'right';
type tabAgile = '' | 'space-around' | 'space-between' | 'space-evenly' | 'flex-start' | 'flex-end';
@customElement('p-tab')
class PTab extends LitElement {
    @property({ type: String, reflect: true }) tabPosition: tabPosition = 'top';
    @property({ type: String, reflect: true }) activeKey: string = null;
    @property({ type: String, reflect: true }) tabAgile: tabAgile = null;
    beforeChange: Function = null;

    static get styles() {
        return css`
            :host{
                display:block;
                text-align:unset;
                --themeColor:#42b983;
                --tab-font-color:unset;
                --tab-border-on-color:#42b983;
                --tab-border-size:2px;
                --borderColor:rgba(0,0,0,.2);
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
           border-top: 1px solid var(--borderColor);
        }
        .tab_tabs {
            white-space:nowrap;
            border-bottom:var(--tab-border-size) solid #FFF;
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
            border-bottom-color:var(--tab-border-on-color);
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
           border-left:1px solid var(--borderColor);
       }
       .tab_container[tabPosition=left]  .tab_tabs{
            display: block;
            padding:0.6em 0.3em ;
            border-right:var(--tab-border-size) solid #FFF;
       }
       .tab_container[tabPosition=left] .tab_on{
            border-bottom: none;
            border-right:var(--tab-border-size) solid var(--tab-border-on-color);
       }
       .tab_container[tabPosition=right]  .tab_tabs{
            display: block;
            padding:0.6em 0.3em ;
            border-left:var(--tab-border-size) solid #FFF;
            text-align: right;
       }
       .tab_container[tabPosition=right] .tab_on{
            border-bottom: none;
            border-left:var(--tab-border-size) solid var(--tab-border-on-color);
       }
       .tab_container[tabPosition=left] .tab_content{
           flex:1;
           border-top:none;
           margin-left:-1px;
           border-left:1px solid var(--borderColor);
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
            border-top:var(--tab-border-size) solid #FFF;
       }
       .tab_container[tabPosition=bottom]  .tab_on{
            border:none;
            border-top:var(--tab-border-size) solid var(--tab-border-on-color);
       }
       .tab_container[tabPosition=bottom] .tab_content{
           order:0;
           border-top:none;
           border-bottom:1px solid var(--borderColor);
       }
       ::slotted(p-tab-content:not([active])){
            display:none;
       }
        `;
    }

    protected renderTabTitle(tabContent: PTabContent): TemplateResult {
        return html`<div class='tab_tabs ${this.activeKey == tabContent.key ? 'tab_on' : ''}  tab_tabs_outer'
         ?disabled=${tabContent.disabled} key="${tabContent.key}"  @click=${this._changeTabHanlder} >
            <span class='tab_label'>${tabContent.label}</span>
            ${tabContent.icon ? html`<p-icon class='p-tab-icon' name=${tabContent.icon}></p-icon>` : ''}
            </div>`;
    }
    protected renderTab(): TemplateResult | Array<TemplateResult> {
        const xTab = this;
        // console.log('activeKey===='+xTab.activekey );
        // console.log(xTab.children.length);
        const childchild = Array.from(this.children);
        const result = new Array<TemplateResult>();
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
                if (tContent.key == xTab.activeKey) {
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
            <div class="tab_nav_con" style="justify-content:${this.tabAgile}" >${this.renderTab()}</div>
            <slot id="slots" class="tab_content"></slot>
        </div>`;
    }
    firstUpdated() {
        const slots: HTMLSlotElement = <HTMLSlotElement>this.shadowRoot.getElementById('slots');
        slots.addEventListener('slotchange', (event) => {
            this.requestUpdate();
        });
    }


    _changeTabHanlder(event: Event) {
        let target = <HTMLElement>event.target;
        if (!target.matches('.tab_tabs')) {
            target = target.closest('.tab_tabs');
        }
        const key = target.getAttribute('key');
        if (key === this.activeKey) {
            return;
        } else {
            const tabContent = this.findTab(key);
            if (tabContent === null || tabContent.disabled) {
                return;
            }
            if (this.beforeChange) {
                const result = this.beforeChange.call(this, tabContent);
                if (result !== false) {
                    this.activeKey = tabContent.key;
                }
            } else {
                this.activeKey = tabContent.key;
            }
        }

    }
    dispatchChangeEvent(tabContent: PTabContent) {
        if (tabContent == null || tabContent.disabled) {
            return;
        }
        this.dispatchEvent(new CustomEvent('p-tab-change', {
            detail: {
                tabContent: tabContent,
                label: tabContent.label,
                key: tabContent.key
            }
        }))
        this.activeKey = tabContent.key;
    }

    findTab(key: string): PTabContent {
        return this.querySelector(`p-tab-content[key="${key}"]`);
    }
    findTabByIndex(index: number): PTabContent {
        const children = this.querySelectorAll('p-tab-content');
        return index < children.length ? <PTabContent>children[index] : null;
    }
    get activeTabContent(): PTabContent {
        return this.findTab(this.activeKey);
    }
    attributeChangedCallback(name: string, oldvalue: string | null, newValue: string | null) {
        super.attributeChangedCallback(name, oldvalue, newValue); //一定要调用super 方法哦
        //const slots: HTMLSlotElement = <HTMLSlotElement>this.shadowRoot.getElementById('slots');
        if (name === 'activekey' && oldvalue !== newValue && this.shadowRoot != null) {
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
    @property({ type: String, reflect: true })
    @property({ type: String, reflect: true }) label: string = '';
    @property({ type: String, reflect: true }) key: string = null;
    @property({ type: String, reflect: true }) icon: string = null;
    @property({ type: Boolean, reflect: true }) disabled: boolean = false;
    render() {
        return html`<slot></slot>`;
    }

    get tab(): PTab {
        return this.closest('p-tab');
    }
    updated(changeMap: Map<string | number | symbol, unknown>) {
        this.tab.requestUpdate();
    }
}
export { PTab, PTabContent };

