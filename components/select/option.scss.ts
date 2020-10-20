import {css} from 'lit-element';
                    export default css`:host{
    display: block ;
}
:host([hidden]){
    display: none;
}
.option {
   display: flex;
   justify-content: flex-start;
   border-radius:0;
   font-size: inherit;
   padding-left:var(--paddingLeft,.625em);
}
.option:active{
   transform:translateY(0);
}
:host([focusin]){
   background-color: var(--option-hover-color, #ECF8F3 );
   color:var(--themeColor,#42b983);
}
:host([selected]) {
   color:var(--themeColor,#42b983);
   background-color:var(--option-select-color,#D9F1E6);
}`;
                