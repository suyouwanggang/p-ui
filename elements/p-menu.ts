
import { css, customElement, html, LitElement, property, internalProperty } from 'lit-element';
import { } from './p-icon';
import {ifDefined} from 'lit-html/directives/if-defined';

@customElement('p-menu')
 class PMenu extends LitElement {
    /**
     * 定义 子菜单组，是否可以关闭
     */
    @property({type:Boolean,reflect: true,attribute:'toogle-able'})
    toogleAble:boolean=false;

    /**
     * 定义是 static 还是动态触发位置的mneu
     */
    @property({type:Boolean,reflect: true})
    overlay:boolean=false;
    /**
     * 如果是动态触发的，触发元素选择器
     */
    @property({type:String,reflect: true})
    trigger:string=undefined;
    /**
     * 如果是动态触发的，
     */
    @property({type:String,reflect: true,attribute:'trigger-event'})
    triggerEvent:string=undefined;
    static get styles() {
        return css`
        :host{
            display:inline-block;
            min-width:130px;
            line-height:1.4em;
            padding: 0;
            background-color: #fff;
            border: 1px solid var(--border-color,#c8c8c8);
            border-radius:var(--border-radius,3px);
        }
        div[part=container]{
           display:inline-flex;
           flex-direction:column;
           align-self:stretch;
        }
        ::slotted(p-submenu:first-child) {
            border-top:none;
        }
        
        ::slotted(p-submenu[close]) + ::slotted(p-submenu) {
            border-top:none;
        }
        ::slotted(p-submenu:last-child){
            border-bottom:none;
        }
        `;
    }
    render(){
        return html`<div part="conatiner"><slot></slot></div>`;
    }
    get subMenu(){
        return this.querySelectorAll('p-submenu');
    }
    updated(_changedProperties: Map<string | number | symbol, unknown>){
        super.updated(_changedProperties);
        if(_changedProperties.has('toogleAble')){
            const subMenu=this.subMenu;
            subMenu.forEach((item:PSubMenu) =>{
                item.requestUpdate();
            })
        }
    }
}
@customElement('p-submenu')
 class PSubMenu extends LitElement {
     static get styles() {
         return css`
        :host{
            display:block;
            color: #333;
            border-top: 1px solid var(--border-color,#c8c8c8);
        }
        :host([no-border]){
            border-top:none;
        }
        div[part=label-div]{
            padding:0.4em 0.6em;
            background-color: #f4f4f4;
            border-bottom: 1px solid var(--border-color,#c8c8c8);
        }
        div[part=label-div].toogleAble:hover{
            background-color:var(--ui-hover-color,#eaeaea);
            cursor:pointer;
        }`;
     }
    /**
     * 如果是动态触发的，触发元素选择器
     */
    @property({type:String,reflect: true})
    label:string=undefined;
    /**
     * 子菜单是否 关闭
     */
    @property({type:Boolean,reflect: true})
    close:boolean=false;

    get menu():PMenu{
        return this.closest('p-menu');
    }
    toogleSubMenu(){
        const menu=this.menu;
        if(menu&&menu.toogleAble){
            this.close=!this.close;
        }
    }
    get toogleAble(){
        const menu=this.menu;
        return menu!=null&&menu.toogleAble ;
    }
    renderToogelIcon(){
        const menu=this.menu;
        if(menu&&menu.toogleAble){
            return html`<p-icon part='icon-close'  name=${this.close?'right':'down'}></p-icon>`;
        }
        return html`<span part='icon-span'></span>`;
    }
    render() {
        return html`<div part='container' >
            <div part='label-div' @click="${this.toogleSubMenu}" class='${this.toogleAble?'toogleAble':''}'>  ${this.renderToogelIcon()} <span>${this.label}</span></div>
            <div id="subItem" style='${this.close?'display:none':''}'><slot></slot></div>
        </div>`
    }

    updated(_changedProperties: Map<string | number | symbol, unknown>){
        super.updated(_changedProperties);
    }
}
@customElement('p-menuitem')
 class PMenuItem extends LitElement {
    /**
     * 如果是动态触发的，触发元素选择器
     */
    @property({type:String,reflect: true})
    label:string=undefined;

    /**
     * 是否 禁用
     */
    @property({type:Boolean,reflect: true})
    disable:Boolean=false;
     /**
     * 点击事件 传值
     */
    @property({type:String,reflect: true})
    value:string=undefined;

     /**
     * 菜单图标
     */
    @property({type:String,reflect: true})
    icon:string=undefined;

     /**
     * 点击url 
     */
    @property({type:String,reflect: true})
    href:string=undefined;
    static get styles() {
        return css`
        :host{
            display:block;
            cursor:pointer;
            padding: .571em .857em;
            border: 0 none;
            outline: none;
            text-decoration: none;
            font-weight: 400;
            line-height: 16px;
        }
        :host(:not([disable]):hover){
            background-color:var(--ui-hover-color,#eaeaea);
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
            float: none;
            color: #333;
            display:inline-block;
            min-width:16px;
        }
        span[part=title]{
            vertical-align: middle;
            float: none;
            color: #333;
        }
        `
    }
    render() {
        return html`<a href=${ifDefined(this.href)}  >
            <span part='icon'>${this.icon? html`<p-icon name=${this.icon}></p-icon> `: ''}</span>
            <span part='label'><slot>${this.label}</slot></span>
    </a>`;
    }
}
export{PMenu, PSubMenu, PMenuItem};
declare global {
    interface HTMLElementTagNameMap {
        'p-menu': PMenu;
        'p-submenu': PSubMenu;
        'p-menuitem': PMenuItem;
    }
}
