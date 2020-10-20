import { css, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { } from '../icon/index';
import PanelStyle from './style.scss';
import PanelStyle2 from './stylepanel.scss';
/**panel 
 * @event  before-tab-change 改变child panel 之前
 * @event  tab-change 改变 child panel state 之后
 *
 */
@customElement('p-ac-panel')
export default class PAccordionPanel extends LitElement {
    @property({ type: Boolean, reflect: true }) multi: boolean = false;
    static get styles() {
        return PanelStyle;
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
        if (active && !this.multi) {
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
        return PanelStyle2;
    }
    @property({ type: Boolean, reflect: true }) active: boolean = false;
    @property({ type: String, reflect: true }) key: string = undefined;
    @property({ type: String, reflect: true }) header: string = undefined;
    renderHeader() {
        return html`<div class='ac-tab-header' @click="${this._clickHeader}" part='ac-tab-header' >
            <slot name='header'><div><p-icon part='right-icon' name='${this.active ? 'down' : 'right'}'></p-icon><span part='ac-tab-header-span'>${this.header}</span></div></slot>
            <slot name='header-right'></slot>
        </div>`;
    }
    render() {
        return html`<div part='ac-tab-container'>${this.renderHeader()}
                    <div part='ac-tab-content' class='${!this.active ? 'close' : ''}'><slot></slot></div>
            </div>`;
    }
    get accordionPanel() :PAccordionPanel{
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

