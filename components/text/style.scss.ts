import {css} from 'lit-element'; export default css`:host{
    font-size:inherit;
    display:inline-block;
    transition:.3s;
}
:host([type="warning"]){
    color:var(--waringColor,#faad14);
}
:host([type="error"]){
    color:var(--errorColor,#f4615c);
}
:host([type="success"]){
    color:var(--successColor,#52c41a);
}
:host([mark]){
    background:var(--waringColor,#faad14);
}
:host([code]){
    font-family: 'SFMono-Regular',Consolas,'Liberation Mono',Menlo,Courier,monospace;
    margin: 0 .2em;
    padding: .2em .3em;
    font-size: 85%;
    border-radius: .2em;
    background-color: #f8f8f8;
    color: #e96900;
}
:host([rows]){
    display:block;
}
:host([draggable]){
    cursor:default;
}
:host([rows]) span{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--rows,1);
    overflow: hidden;
}`; 