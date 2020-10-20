import {css} from 'lit-element';
             export default css`:host{
    position:absolute;
    display:flex;
    flex-direction:column;
    box-shadow: 2px 2px 15px rgba(0,0,0,0.15);
    box-sizing: border-box;
    transform:scale(0);
    opacity:0.5;
    border-radius: 3px;
    z-index:10;
    transition:.3s cubic-bezier(.645, .045, .355, 1);
    transform-origin:inherit;
    background:#fff;
    visibility:hidden;
}
div[part=popTitle] {
    display:flex;
    align-items:center;
    padding:var(--title-padding-top,4px) var(--title-padding-left,4px);
}
p-icon[part="title-icon"]{
    position:relative;
    top:2px;
}
div[part=popTitle] >div[part=popTitleInner]{
    flex:1;
    font-size: 1.2em;
    color: #4c5161;
    user-select: none;
    cursor: default;
}
div[part=popBody]{
    /*width:max-content;*/
}
:host([thinBar]) div[part=popBody] {
    flex: 1;
    overflow:auto;
    width:max-content;
    scrollbar-color: #DBDBDB #FFF;
    scrollbar-width: thin;
}
:host([thinBar]) div[part=popBody] :hover{
    scrollbar-color: rgb(189,189,189) #FFF ;
}
:host([thinBar]) div[part=popBody]::-webkit-scrollbar {
    width:7px;
    height: 7px;
}
/* 滚动槽 */
:host([thinBar]) div[part=popBody]::-webkit-scrollbar-track {
    background-color:#FFF;
}
/* 滚动条滑块 */
:host([thinBar])  div[part=popBody]::-webkit-scrollbar-thumb {
    border-radius:3px;
    background:#DBDBDB;
}
:host([thinBar]) div[part=popBody]::-webkit-scrollbar-thumb:hover {
    background-color: #BDBDBD;
}
p-icon[part=popIcon]{
    flex:auto;
    font-size:1.2em;
    color:var(--waringColor,#faad14);
    margin: 1em 0px 0px 0.8em;
    align-self:flex-start;
}
div[part=popFooter]{
    margin-top:8px;
    text-align: right;
    white-space: nowrap;
}
#btn-cancel,#btn-submit  {
    margin-left: 0.6em;
    margin-right:0.6em;
    margin-bottom:8px;
    cursor:pointer;
}
#btn-submit {
    margin-right:1.5em;
}
:host([type="confirm"]){
    min-width:250px;
}
:host([type="confirm"])  div[part=popBody] {
    margin-left:0.8em;
    margin-right:0.8em;
}`;
            