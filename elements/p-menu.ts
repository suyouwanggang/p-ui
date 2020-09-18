
import { css, customElement, html, LitElement, property, internalProperty } from 'lit-element';
import { } from './p-icon';
import {ifDefined} from 'lit-html/directives/if-defined';

@customElement('p-menu')
 class PMenu extends LitElement {
    /**
     * 定义是 static 还是动态触发位置的mneu
     */
    @property({type: Boolean, reflect: true})
    overlay: boolean = false;
    /**
     * 如果是动态触发的，触发元素选择器
     */
    @property({type: String, reflect: true})
    trigger: string = undefined;
    /**
     * 如果是动态触发的，
     */
    @property({type: String, reflect: true, attribute: 'trigger-event'})
    triggerEvent: string = undefined;
    static get styles() {
        return css`
        :host{
            display:inline-block;
            min-width:130px;
            color:#000;
            background-color: var(--menu-background-color,#F5F5F5);
            border: 1px solid var(--border-color,#d1d1d1);
            padding-top:5px;
            padding-bottom:5px;
            border-radius:var(--border-radius,2px);
        }
        :host([shadow]){
            box-shadow: 1px 1px 10px #d1d1d1;
        }
        div[part=container]{
           display:inline-flex;
           flex-direction:column;
           align-self:stretch;
        }
        `;
    }
    render() {
        return html`<div part="conatiner"><slot></slot></div>`;
    }
    // get subMenu(){
    //     return this.querySelectorAll('p-submenu');
    // }
    updated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(_changedProperties);
    }
}

// @customElement('p-submenu')
//  class PSubMenu extends LitElement {
//      static get styles() {
//          return css`
//         :host{
//             display:block;
//             color: #000;
//         }
//         div[part=label-div]{
//             padding:0.4em 0.6em;
//             background-color: #f4f4f4;
//             border-bottom: 1px solid var(--border-color,#c8c8c8);
//         }
//         div[part=subItem]{
//             border-bottom: 1px solid var(--border-color,#c8c8c8);
//         }
//         div[part=label-div].toogleAble:hover{
//             background-color:var(--ui-hover-color,#eaeaea);
//             cursor:pointer;
//         }`;
//      }
//     /**
//      * 如果是动态触发的，触发元素选择器
//      */
//     @property({type:String,reflect: true})
//     label:string=undefined;
//     /**
//      * 子菜单是否 关闭
//      */
//     @property({type:Boolean,reflect: true})
//     close:boolean=false;

//     get menu():PMenu{
//         return this.closest('p-menu');
//     }
//     toogleSubMenu(){
//         const menu=this.menu;
//         if(menu&&menu.toogleAble){
//             this.close=!this.close;
//         }
//     }
//     get toogleAble(){
//         const menu=this.menu;
//         return menu!=null&&menu.toogleAble ;
//     }
//     renderToogelIcon(){
//         const menu=this.menu;
//         if(menu&&menu.toogleAble){
//             return html`<p-icon part='icon-close'  name=${this.close?'right':'down'}></p-icon>`;
//         }
//         return html`<span part='icon-span'></span>`;
//     }
//     render() {
//         return html`<div part='container' >
//             <div part='label-div' @click="${this.toogleSubMenu}" class='${this.toogleAble?'toogleAble':''}'>  ${this.renderToogelIcon()} <span>${this.label}</span></div>
//             <div id="subItem" part="subItem" style='${this.close?'display:none':''}'><slot></slot></div>
//         </div>`
//     }

//     updated(_changedProperties: Map<string | number | symbol, unknown>){
//         super.updated(_changedProperties);
//     }
// }
@customElement('p-menuitem')
 class PMenuItem extends LitElement {
    /**
     * 如果是动态触发的，触发元素选择器
     */
    @property({type: String, reflect: true})
    label: string = undefined;

    /**
     * 是否 禁用
     */
    @property({type: Boolean, reflect: true})
    disable: Boolean = false;
     /**
     * 点击事件 传值
     */
    @property({type: String, reflect: true})
    value: string = undefined;

     /**
     * 菜单图标
     */
    @property({type: String, reflect: true})
    icon: string = undefined;

     /**
     * 点击url
     */
    @property({type: String, reflect: true})
    href: string = undefined;
    static get styles() {
        return css`
        :host{
            display:block;
            cursor:pointer;
            padding:0.5em 0.6em;
            border: 0 none;
            outline: none;
            text-decoration: none;
            font-weight: 400;
            line-height:1em;

        }
        :host(:not([disable]):hover){
             background-color: var(--menu-hover-back-color,#198AD4);
             color:var(--menu-hover-font-color,#FFF);
             transition:background-color 0.3s ease;
        }
        :host([disable]){
          opacity:0.2;
          pointer-events:none;
          cursor:not-allowed ;
        }
        span[part=icon]{
            margin-right: .429em;
            margin-top: 0;
            vertical-align: middle;
            display:inline-block;
            min-width:16px;
        }
        span[part=title]{
            vertical-align: middle;
        }
        `;
    }
    render() {
        return html`<a href=${ifDefined(this.href)}  >
            <span part='icon'>${this.icon ? html`<p-icon name=${this.icon}></p-icon> ` : ''}</span>
            <span part='label'><slot>${this.label}</slot></span>
    </a>`;
    }
}
export{PMenu,  PMenuItem};
declare global {
    interface HTMLElementTagNameMap {
        'p-menu': PMenu;
        //'p-submenu': PSubMenu;
        'p-menuitem': PMenuItem;
    }
}
