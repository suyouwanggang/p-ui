import {css} from 'lit-element';
             export default css`:host {
    display:inline-block;
    position:relative;
    overflow:visible;
   --distanceValue: var(--distance,10px);
}
:host([dir="top"]) ::slotted(p-pop-content){
    bottom:100%;
    left:50%;
    transform:translate(-50%,calc( -1 * var(--distanceValue) ) ) scale(0);
    transform-origin: center bottom;
}
:host([dir="top"]) ::slotted(p-pop-content[open]),
:host([dir="top"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
:host([dir="top"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
    transform:translate(-50%,calc( -1 * var(--distanceValue) ) ) scale(1);
}
:host([dir="right"]) ::slotted(p-pop-content){
    left:100%;
    top:50%;
    transform:translate(calc( 1 * var(--distanceValue) ),-50%) scale(0);
    transform-origin: left;
}
:host([dir="right"]) ::slotted(p-pop-content[open]),
:host([dir="right"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
:host([dir="right"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
    transform:translate(calc( 1 * var(--distanceValue) ),-50%) scale(1);
}
:host([dir="bottom"]) ::slotted(p-pop-content){
    top:100%;
    left:50%;
    transform:translate(-50%,calc( 1 * var(--distanceValue) )) scale(0);
    transform-origin: center top;
}
:host([dir="bottom"]) ::slotted(p-pop-content[open]),
:host([dir="bottom"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
:host([dir="bottom"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
    transform:translate(-50%,calc( 1 * var(--distanceValue) )) scale(1);
}
:host([dir="left"]) ::slotted(p-pop-content){
    right:100%;
    top:50%;
    transform:translate(calc( -1 * var(--distanceValue) ),-50%) scale(0);
    transform-origin: right;
}
:host([dir="left"]) ::slotted(p-pop-content[open]),
:host([dir="left"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
:host([dir="left"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
    transform:translate(calc( -1 * var(--distanceValue) ),-50%) scale(1);
}
:host([dir="lefttop"]) ::slotted(p-pop-content){
    right:100%;
    top:0;
    transform:translate(calc( -1 * var(--distanceValue) )) scale(0);
    transform-origin: right top;
}
:host([dir="lefttop"]) ::slotted(p-pop-content[open]),
:host([dir="lefttop"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
:host([dir="lefttop"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
    transform:translate(calc( -1 * var(--distanceValue) )) scale(1);
}
:host([dir="leftbottom"]) ::slotted(p-pop-content){
    right:100%;
    bottom:0;
    transform:translate(calc( -1 * var(--distanceValue) )) scale(0);
    transform-origin: right bottom;
}
:host([dir="leftbottom"]) ::slotted(p-pop-content[open]),
:host([dir="leftbottom"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
:host([dir="leftbottom"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
    transform:translate(calc( -1 * var(--distanceValue) )) scale(1);
}
:host([dir="topleft"]) ::slotted(p-pop-content){
    bottom:100%;
    left:0;
    transform:translate(0,calc( -1 * var(--distanceValue) )) scale(0);
    transform-origin: left bottom;
}
:host([dir="topleft"]) ::slotted(p-pop-content[open]),
:host([dir="topleft"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
:host([dir="topleft"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
    transform:translate(0,calc( -1 * var(--distanceValue) )) scale(1);
}
:host([dir="topright"]) ::slotted(p-pop-content){
    bottom:100%;
    right:0;
    transform:translate(0,calc( -1 * var(--distanceValue) )) scale(0);
    transform-origin: right bottom;
}
:host([dir="topright"]) ::slotted(p-pop-content[open]),
:host([dir="topright"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
:host([dir="topright"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
    transform:translate(0,calc( -1 * var(--distanceValue) )) scale(1);
}
:host([dir="righttop"]) ::slotted(p-pop-content){
    left:100%;
    top:0;
    transform:translate(calc( 1 * var(--distanceValue) )) scale(0);
    transform-origin: left top;
}
:host([dir="righttop"]) ::slotted(p-pop-content[open]),
:host([dir="righttop"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
:host([dir="righttop"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
    transform:translate(calc( 1 * var(--distanceValue) )) scale(1);
}
:host([dir="rightbottom"]) ::slotted(p-pop-content){
    left:100%;
    bottom:0;
    transform:translate(10px) scale(0);
    transform-origin: left bottom;
}
:host([dir="rightbottom"]) ::slotted(p-pop-content[open]),
:host([dir="rightbottom"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
:host([dir="rightbottom"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
    transform:translate(calc( 1 * var(--distanceValue) )) scale(1);
}
:host([dir="bottomleft"]) ::slotted(p-pop-content),
:host(:not([dir])) ::slotted(p-pop-content){
    left:0;
    top:100%;
    transform:translate(0,calc( 1 * var(--distanceValue) )) scale(0);
    transform-origin: left top;
}
:host(:not([dir])) ::slotted(p-pop-content[open]),
:host(:not([dir])[trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
:host(:not([dir])[trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content),
:host([dir="bottomleft"]) ::slotted(p-pop-content[open]),
:host([dir="bottomleft"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
:host([dir="bottomleft"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
    transform:translate(0,calc( 1 * var(--distanceValue) )) scale(1);
}
:host([dir="bottomright"]) ::slotted(p-pop-content){
    right:0;
    top:100%;
    transform:translate(0,calc( 1 * var(--distanceValue) )) scale(0);
    transform-origin: right top;
}
:host([dir="bottomright"]) ::slotted(p-pop-content[open]),
:host([dir="bottomright"][trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
:host([dir="bottomright"][trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
    transform:translate(0,calc( 1 * var(--distanceValue) )) scale(1);
}
:host([trigger="contextmenu"]) ::slotted(p-pop-content){
    right:auto;
    bottom:auto;
    left:var(--x,0);
    top:var(--y,100%);
    transform-origin: left top;
    transform:translate(5px,5px) scale(0);
    transition: .15s;
}
:host([trigger="contextmenu"]) ::slotted(p-pop-content[open]){
    transform:translate(5px,5px) scale(1);
}
:host ::slotted(p-pop-content[open]),
:host([trigger="hover"]:not([disabled]):hover) ::slotted(p-pop-content),
:host([trigger="focus"]:not([disabled]):focus-within) ::slotted(p-pop-content){
    opacity:1;
    visibility:visible;
}

:host([dir='center']) ::slotted(p-pop-content){
    position:fixed;
    right:auto;
    bottom:auto;
    top:50%;
    left:50%;
    transition: .15s;
    transform:translate(-50%, -50%) scale(0);
}
:host([dir='center']) ::slotted(p-pop-content[open]){
    transform:translate(-50%, -50%) scale(1);
}
`;
            