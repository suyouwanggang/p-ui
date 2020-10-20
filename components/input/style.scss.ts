import {css} from 'lit-element';
                    export default css`:host{
    display:inline-block ;
    border:1px solid var(--borderColor,rgba(0,0,0,.2));
    border-radius:var(--borderRadius,0.25em);
    transition:border-color 0.3s,box-shadow .3s;
    color: var(--fontColor,#333);
    cursor:text;
}
:host([block]){
    display:block;
}
:host([disabled]){
    opacity:var(--disabled-opaticity,0.8);
    cursor:not-allowed;
}
:host([disabled]) p-tips{
    pointer-events:none;
    background:rgba(0,0,0,.08);
}

:host([invalid]){
    --themeColor:var(--errorColor,#f4615c);
    border-color:var(--errorColor,#f4615c);
}

:host(:focus-within:not([disabled])), :host(:not([disabled]):hover){
    border-color:var(--themeColor,#42b983);
}
p-tips{
    box-sizing:border-box;
    display:flex;
    align-items:center;
    height:100%;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 6px 6px;
    font-family: inherit;
    transition: .3s background-color;
}
p-tips[show=true]{
    --color:var(--errorColor,#f4615c);
}
p-tips>input{
    text-align: inherit;
    color: currentColor;
    padding:0;
    padding-left:0.3em;
    border: 0;
    outline: 0;
    line-height: inherit;
    font-size: inherit;
    font-family: inherit;
    flex: 1;
    min-width: 0;
    -webkit-appearance: none;
    -moz-appearance: textfield;
    background: none;
    overflow-x: hidden;
    transition: color .3s;
}

input[type="number"]::-webkit-inner-spin-button{
    display:none;
}
::-moz-focus-inner,::-moz-focus-outer{
    border:0;
    outline : 0;
}
input::placeholder{
    color:#999;
    font-size:90%;
}
p-icon{
    display: flex;
}
:host(:focus-within:not([disabled])) .leftIcon{
    color:var(--themeColor,#42b983);
}
.eye-icon{
    padding:0;
    line-height: 1em;
    cursor:pointer;
}
:host([disabled]) .eye-icon{
    cursor:not-allowed;
}
.btn-number{
    display:flex;
    flex-direction:column;
    margin:-6px 0;
    width:1em;
    visibility:hidden;
    transition:0s;
}
.btn-number p-button{
    display: flex;
    color: #999;
    border-radius:0;
    width:100%;
    flex:1;
    padding:0 2px;
    font-size:1em;
    transition:.2s;
}
.btn-number p-button:hover{
    flex:1.5;
}
:host(:focus-within:not([disabled])) .btn-number, :host(:not([disabled]):hover) .btn-number {
    visibility: visible;
}


.input-label{
    pointer-events:none;
    margin-left:0.14em;
    position:absolute;
    transition: transform .3s, color .3s, background-color .3s;
    transform-origin: left;
    color:#999;
}
:host([leftIcon]) .input-label{
    margin-left:1.5em;
}
:host([label]) #input::placeholder{
    color:transparent;
}
#input:not(:placeholder-shown) + .input-label,
#input:focus + .input-label{
    transform: translateY( calc( -50% - 0.5em ) ) scale(0.8);
    background:#fff;
}
#input:-moz-ui-invalid{
    box-shadow:none;
}
:host(:focus-within:not([disabled])) .icon-pre,
:host(:not([disabled]):hover) .icon-pre,
:host(:not([disabled]):hover) .input-label,
:host(:focus-within:not([disabled])) .input-label{
    color:var(--themeColor,#42b983);
}`;
                