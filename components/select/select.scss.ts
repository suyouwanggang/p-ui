import {css} from 'lit-element';
                    export default css`:host{
   display: inline-block ;
   --distance:5px;
}
:host([block]){
   display: block;
}
:host([disabled]){
  pointer-events:none;
}
:host(:not([disabled]):not([type="primary"]):focus-within) #input,
:host(:not([disabled]):not([type="primary"]):hover) #input{
  border-color:var(--themeColor,#42b983);
  color:var(--themeColor,#42b983);
}

:host([search]:focus-within:not([disabled])) #input,
:host([search]:not([disabled]):hover) #input{
  color: var(--themeColor,#42b983);
}
p-tips{
  display:block;
  width: 100%;
  height:2em;
}
#input:not([type="primary"]){
  display:flex;
  width:100%;
  height:100%;
  font-size: inherit;
  color: currentColor;
}
:host([search]) #input{
  color:currentColor;
}
p-tips[show=show]{
  --themeColor:var(--errorColor,#f4615c);
  --borderColor:var(--errorColor,#f4615c);
}
:host([invalid]) #input:not([type="primary"]){
  color:var(--errorColor,#f4615c);
}
#input span{
  flex:1;
  text-align:left;
}
#input::after{
  content:'';
  position:absolute;
  left:0;
  top:0;
  right:0;
  bottom:0;
  cursor:default;
  pointer-events:none;
}
#input[readonly]::after{
  pointer-events:all;
}
:host(:focus-within) p-pop-content,:host(:active) p-pop-conten{
  z-index: 2;
}
.option {
  display: flex;
  justify-content: flex-start;
  border-radius:0;
  font-size: inherit;
  padding-left:var(--paddingLeft,.625em);
}
.arrow{
  position:relative;
  font-size:.9em;
  transform:scaleY(.8);
  margin-left:.5em;
  pointer-events:none;
  width:1em;
  height:1em;
  fill:currentColor;
  transition:.3s transform cubic-bezier(.645, .045, .355, 1);
}
:host([search]) .arrow{
  transition:color .3s  cubic-bezier(.645, .045, .355, 1),.3s transform cubic-bezier(.645, .045, .355, 1);
}
p-pop{
  --distanceValue:var(--distance,5px);
  display:block;
  min-width:100%;
  height:inherit;
}
p-pop#pop[open] .arrow{
  transform:scaleY(-.8);
}
p-pop-content{
  min-width:100%;
  overflow:auto;
  max-height:50vh;
  scroll-behavior: smooth;
}
p-pop-content::part(popBody){
  min-width:100%;
}`;
                