import { css, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
type tabPosition = 'top' | 'bottom' | 'left' | 'right';
@customElement('p-tab')
export default class PTab extends LitElement {
    @property({ type: String, reflect: true }) tabPosition: tabPosition = 'top';
    @property({ type: String, reflect: true }) activeKey: string = null;

    static get styles() {
        return css`
            :host{
                display:block;
                text-align:unset;
            }
            .tab_container{
                --themColor:#42b983;
                --tab-font-color:#42b983;
                --tab-border-on-color:#42b983;
                --tab-border-size:2px;
                --borderColor:rgba(0,0,0,.2);
                display: flex;
                flex-direction: column;
            }
         .tab_nav_con{
            flex:0 0 auto;
            overflow: hidden;
            display: flex;
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
            padding:0.4em 0.8em;
            cursor: pointer;
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


    render() {
        return html`
        <div class="tab_container" tabPosition="${this.tabPosition}" >
            <div class="tab_nav_con">${this.renderTab()}</div>
            <slot id="slots" class="tab_content"></slot>
        </div>`;
    }
    firstUpdated() {
        const xTab = this;
        const slots: HTMLSlotElement = <HTMLSlotElement>this.shadowRoot.getElementById('slots');
        slots.addEventListener('slotchange', () => {
            const slotsChild = slots.assignedElements();
            xTab.requestUpdate();
        });
    }

    renderTab(): TemplateResult | Array<TemplateResult> {
        const xTab = this;
        const childchild = Array.from(this.children);
        const result = new Array<TemplateResult>();
        childchild.forEach((element, index) => {
            if (element instanceof PTabContent) {
                // tslint:disable-next-line: no-unnecessary-type-assertion
                const tContent: PTabContent = element as PTabContent;
                if (tContent.key == null) {
                    tContent.key = '' + index;
                }
                if (xTab.activeKey == null) {
                    xTab.activeKey = tContent.key;
                }
                if (tContent.key === xTab.activeKey) {
                    tContent.setAttribute('active', '');
                } else {
                    tContent.removeAttribute('active');
                }
                result.push(tContent.renderTabTitle(this));
            }
        });
        return result;
    }


}


@customElement('p-tab-content')
class PTabContent extends LitElement {
    @property({ type: String, reflect: true })
    @property({ type: String, reflect: true }) label: string = '';
    @property({ type: String, reflect: true }) key: string = null;
    @property({ type: String, reflect: true }) icon: string = '';
    @property({ type: Boolean, reflect: true }) disabled: boolean = false;
    render() {
        return html`<slot></slot>`;
    }
    renderTabTitle(parent: PTab): TemplateResult {
        return html`<div class='tab_tabs ${parent.activeKey == this.key ? 'tab_on' : ''}' ?disabled=${this.disabled}>
            <span class='tab_label'>${this.label}</span>
            ${this.icon ? html`<p-icon name=${this.icon}></p-icon>` : ''}
            </div>`;
    }
    updated(changeMap: Map<string | number | symbol, unknown>) {
    
       let tab:PTab= this.closest('p-tab');
       tab.requestUpdate();
    }
}

