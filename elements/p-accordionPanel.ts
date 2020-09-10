import { css, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { } from './p-icon';
/**
 * @event  before-tab-change 改变child panel 之前
 * @event  tab-change 改变 child panel state 之后
 * 
 */

@customElement('p-ac-panel')
class PAccordionPanel extends LitElement {
    @property({ type: Boolean, reflect: true }) mutil: boolean = false;
    static get styles() {
        return css`
            :host{
                display:block;
            }
            :host ::slotted(p-ac-tab){
                margin-top:1px;
            }
        `;
    }
    render() {
        return html`<div><slot id='slot'></slot></div> `;
    }
    get childTabPanel() {
        const panels: Array<PACTab> = [];
        const children = this.children;
        let temp = null;
        for (let i = 0, j = children.length; i < j; i++) {
            temp = children[i];
            if (temp instanceof PACTab) {
                panels.push(temp);
            }
        }
        return panels;
    }
    findTab(key: string): PACTab {
        return this.childTabPanel.find((item) => {
            return item.key === key;
        });
    }
    getTabIndex(tab: PACTab) {
        const children = this.childTabPanel;
        return children.indexOf(tab);
    }
    findTabByIndex(index: number): PACTab {
        const children = this.childTabPanel;
        return index < children.length ? children[index] : null;
    }
    public get activeTab() {
        return this.childTabPanel.filter((item: PACTab) => {
            return item.active;
        });
    }
    public setTabToActive(tab: PACTab, active: boolean = false) {
        if (active && !this.mutil) {
            const tabs = this.activeTab;
            tabs.forEach((item: PACTab) => {
                item.active = false;
            });
        }
        tab.active = active;
    }
}


@customElement('p-ac-tab')
class PACTab extends LitElement {
    static get styles() {
        return css`
            :host{
                display:block;
            }
            :host([active]) .ac-tab-header{
                border: 1px solid var(--ac-tab-active-border,var(--theme-color,#42b983));
                background-color:  var(--ac-tab-active-background-color,var(--theme-color,#42b983));
                color:#FFF;
            }

            .ac-tab-header{
                border: 1px solid var(--ac-tab-border,#c8c8c8);
                background-color:  var(--ac-tab-background-color,#f4f4f4);
                padding: .3em 0.6em;
                font-size: 1.1em;
                cursor:pointer;
            }
            :host(:not([active]))  .ac-tab-header:hover{
                border:1px solid var(--ac-tab-hover-border,#bdbdbd);
                background-color:  var(--ac-tab-hover-background-color,#bdbdbd);
            }
            p-icon[part=right-icon]{
                 margin-right: .429em;
            }
            div[part=ac-tab-content]{
                border: 1px solid var(--ac-tab-content-border,#c8c8c8)  ;
                background-color: #fff;
                padding: .3em 0.6em;
                border-top: 0 none;
            }
        }`;
    }
    @property({ type: Boolean, reflect: true }) active: boolean = false;
    @property({ type: String, reflect: true }) key: string = undefined;
    @property({ type: String, reflect: true }) header: string = undefined;
    renderHeader() {
        return html`<div class='ac-tab-header' @click="${this._clickHeader}" part='ac-tab-header' ><p-icon part='right-icon' name='${this.active ? 'down' : 'right'}'></p-icon>
            <slot name='header-span'><span part='ac-tab-header-span'>${this.header}</span></slot>
        </div>`;
    }
    render() {
        return html`<div part='ac-tab-container'>${this.renderHeader()}
        <div part='ac-tab-content' style='${!this.active ? 'display:none' : ''}'><slot></slot></div>
    </div>`
    }
    get accordionPanel(): PAccordionPanel {
        return this.closest('p-ac-panel');
    }
    private _clickHeader(e: Event) {
        const tab = this;
        const panel = this.accordionPanel;
        let canChange = true;
        if (panel) {
            canChange = panel.dispatchEvent(new CustomEvent('before-tab-change', {
                bubbles: true,
                cancelable: true,
                detail: {
                    tab: tab
                }
            }));
        }
        if (canChange) {
            panel.setTabToActive(tab, !tab.active);
            panel.dispatchEvent(new CustomEvent('tab-change', {
                bubbles: true,
                detail: {
                    tab: tab
                }
            }));
        }
    }

}
export { PAccordionPanel, PACTab };

declare global {
    interface HTMLElementTagNameMap {
        'p-ac-panel': PAccordionPanel;
        'p-ac-tab': PACTab;
    }
}
