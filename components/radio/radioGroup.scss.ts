import {css} from 'lit-element';
                    export default css`:host {
    display:inline-block ;
}
:host(:focus-within) p-tips,:host(:hover) p-tips{
    z-index:2;
}
:host([disabled]){ 
    pointer-events: none; 
}
:host([disabled]) p-tips{
    pointer-events: all;
    cursor: not-allowed;
    outline: 0;
}
::slotted(p-radio){
    transition: opacity .3s;
}
:host([disabled]) ::slotted(p-radio){
    pointer-events: none;
    opacity:.6;
}
p-tips[show='true']{
    --themeColor:var(--errorColor,#f4615c);
    --borderColor:var(--errorColor,#f4615c);
}`;
                