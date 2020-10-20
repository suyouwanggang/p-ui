import {css} from 'lit-element';
                    export default css`:host{
    display:block ;
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
}`;
                