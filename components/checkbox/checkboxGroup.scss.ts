import {css} from 'lit-element';
                    export default css`:host {
    display:inline-block;
}
:host([invalid]) {
    --borderColor: var(--errorColor,#f4615c);
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
:host([vertical]) ::slotted(p-checkbox){
    display:block;
}
:host([disabled]) ::slotted(p-checkbox){
    pointer-events: none;
    opacity:.6;
}
::slotted(p-checkbox){
    transition: opacity .3s;
}`;
                