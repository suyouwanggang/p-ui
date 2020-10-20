import {css} from 'lit-element';
                    export default css`:host{
    display:none ;
    visibility:hidden;
    z-index:10;
}
:host([show]){
    display:flex;
    opacity:1;
    visibility:visible;
}
:host([show][block]){
    display:block;
}
:host([horizontal-agile='left']) {
    justify-content:flex-start;
}
:host([horizontal-agile='right']) {
    justify-content:flex-end;
}
:host([horizontal-agile='center']) {
    justify-content:center;
}
.message{
    display:flex;
    padding:10px 15px;
    margin-top:10px;
    align-items:center;
    font-size: 14px;
    color: #666;
    background: #fff;
    border-radius: 3px;
    transform: translateY(-100%);
    transition:.3s transform cubic-bezier(.645, .045, .355, 1),.3s;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    pointer-events:all;
}
:host([show]) .message{
    transform: translateY(0);
}

.message>*{
    margin-right:5px;
}

p-loading{
    display:none;
}

:host([show][loading]) p-loading{
    display:block;
}
:host p-icon{
    color:var(--themeColor,#42b983);
}`;
                