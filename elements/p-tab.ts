import { css, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { threadId } from 'worker_threads';
type tabpostion = 'top' | 'bottom' | 'left' | 'right';
type tabAgile = '' | 'space-arround' | 'space-between' | 'space-evenly'|'flex-start'|'flex-end';
@customElement('p-tab')
class PTab extends LitElement {
    @property({ type: String, reflect: true }) tabposition: tabpostion = 'top';
    @property({ type: String, reflect: true }) activekey: string = null;
    @property({ type: String, reflect: true }) tabagile: tabAgile =null;
    beforeChange: Function = null;

    static get styles() {
        return css`
            :host{
                display:block;
                text-align:unset;
                --themColor:#42b983;
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
       .tab_container[tabpostion=left],
       .tab_container[tabpostion=right]{
            flex-direction: row;
       }
       .tab_container[tabpostion=left] .tab_nav_con,
       .tab_container[tabpostion=right] .tab_nav_con{
           display: flex;
           flex-direction: column;
           overflow: hidden;
       }
       .tab_container[tabpostion=right] .tab_nav_con{
           order:1;
           border-left:1px solid var(--borderColor);
       }
       .tab_container[tabpostion=left]  .tab_tabs{
            display: block;
            padding:0.6em 0.3em ;
            border-right:var(--tab-border-size) solid #FFF;
       }
       .tab_container[tabpostion=left] .tab_on{
            border-bottom: none;
            border-right:var(--tab-border-size) solid var(--tab-border-on-color);
       }
       .tab_container[tabpostion=right]  .tab_tabs{
            display: block;
            padding:0.6em 0.3em ;
            border-left:var(--tab-border-size) solid #FFF;
            text-align: right;
       }
       .tab_container[tabpostion=right] .tab_on{
            border-bottom: none;
            border-left:var(--tab-border-size) solid var(--tab-border-on-color);
       }
       .tab_container[tabpostion=left] .tab_content{
           flex:1;
           border-top:none;
           margin-left:-1px;
           border-left:1px solid var(--borderColor);
       }
       .tab_container[tabpostion=right] .tab_content{
           flex:1;
           border-top:none;
           margin-right:-1px;
           order:0;
       }
       .tab_container[tabpostion=bottom] .tab_nav_con {
            order:1;
            border-bottom: none;
       }
       .tab_container[tabpostion=bottom]  .tab_tabs{
            border-top:var(--tab-border-size) solid #FFF;
       }
       .tab_container[tabpostion=bottom]  .tab_on{
            border:none;
            border-top:var(--tab-border-size) solid var(--tab-border-on-color);
       }
       .tab_container[tabpostion=bottom] .tab_content{
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
        return  html`<div class='tab_tabs ${this.activekey == tabContent.key ? 'tab_on' : ''}  tab_tabs_outer'
         ?disabled=${tabContent.disabled} key="${tabContent.key}"  @click=${this._changeTabHanlder} >
            <span class='tab_label'>${tabContent.label}</span>
            ${tabContent.icon ? html`<p-icon class='p-tab-icon' name=${tabContent.icon}></p-icon>` : ''}
            </div>`;
    }
   protected renderTab():TemplateResult|Array<TemplateResult> {
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
                    tContent.key =  index+'';
                }
                if (xTab.activekey == null) {
                    xTab.activekey = tContent.key;
                }
                if (tContent.key == xTab.activekey) {
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
        <div class="tab_container" tabpostion="${this.tabposition}" >
            <div class="tab_nav_con" style="justify-content:${this.tabagile}" >${this.renderTab()}</div>
            <slot id="slots" class="tab_content"></slot>
        </div>`;
    }
    firstUpdated() {
        const slots: HTMLSlotElement = <HTMLSlotElement>this.shadowRoot.getElementById('slots');
        slots.addEventListener('slotchange', (event) => {
            //    console.log(event);
                this.requestUpdate();
        });
       // this.updateComplete.then( () => this.requestUpdate());
    }
    

    _changeTabHanlder(event:Event){
        let target=<HTMLElement>event.target;
        if(!target.matches('.tab_tabs')){
            target=target.closest('.tab_tabs');
        }
        let key=target.getAttribute('key');
        if(key==this.activekey){
            return ;
        }else{
            let tabContent=this.findTab(key);
            if(tabContent.disabled){
                return ;
            }
            if(this.beforeChange){
                let result=this.beforeChange.call(this,tabContent);
                if(result!=false){
                  this.activekey=tabContent.key;
                }
            }else{
                this.activekey=tabContent.key;
            }
        }
        
    }
    dispatchChangeEvent(tabContent:PTabContent){
        if(tabContent==null||tabContent.disabled){
            return ;
        }
        this.dispatchEvent(new CustomEvent('p-tab-change',{
            detail:{
                tabContent:tabContent,
                label:tabContent.label,
                key:tabContent.key
            }
        }))
        this.activekey=tabContent.key;
    }
    
    findTab(key:string):PTabContent{
        return this.querySelector(`p-tab-content[key="${key}"]`);
    }
    get activeContent(){
        return this.querySelector("p-tab-content[ative]");
    }
    set activeTab(key:string){
       const tabContent= <PTabContent>this.renderRoot.querySelector(`p-tab-content[key="${key}"]`);
       this.dispatchChangeEvent(tabContent);

    }
    attributeChangedCallback(name:string,oldvalue:string|null, newValue:string|null){
        super.attributeChangedCallback(name,oldvalue,newValue); //一定要调用super 方法哦
        //const slots: HTMLSlotElement = <HTMLSlotElement>this.shadowRoot.getElementById('slots');

         if(name=='activekey'&& oldvalue!=newValue&&this.shadowRoot!=null){
           this.dispatchChangeEvent(this.findTab(newValue));
         }
    }
    findTabByIndex(index:number):PTabContent{
        let children= this.querySelectorAll("p-tab-content");
        return index<children.length?<PTabContent>children[index]:null;
    }
    set activeTabByIndex(index:number){
        let tab=this.findTabByIndex(index);
        this.dispatchChangeEvent(tab);
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
   
    get  tab():PTab{
        return this.closest('p-tab');
    }
    updated(changeMap: Map<string | number | symbol, unknown>) {
       this.tab.requestUpdate();
    }
}
export {PTab ,PTabContent}; 

