import {css} from 'lit-element';
                    export default css`:host{
    display:inline-block ;
    position:relative;
    box-sizing:border-box;
    vertical-align: top;
    font-size:14px;
    overflow:hidden;
    color:var(--img-font-color,#666);
}
:host([alt]:not([default]))::before{
    content:attr(alt);
    position:absolute;
    color:#fff;
    left:0;
    right:0;
    bottom:0;
    z-index:1;
    line-height:1.5;
    font-size:14px;
    padding:5px 10px;
    background:linear-gradient(to bottom,transparent,rgba(0,0,0,.5));
    transform:translateY(100%);
    transition:.3s;
}
:host([alt]:hover)::before,
:host([alt][show-alt][load])::before
{
    transform:translateY(0);
}
:host([ratio*="/"]){
    width:100%;
    height:auto!important;
}
:host([ratio*="/"]) img{
    position:absolute;
    left: 0;
    top: 0;
    width:100%;
    height: 100%;
}
:host([ratio*="/"]) div.placeholder{
    position: relative;
    padding-top:100%;
}
img {
    box-sizing: border-box;
    color:transparent;
    display: inline-block;
    width: inherit;
    height: inherit;
    vertical-align: top;
    border:0;
    opacity:0;
    background:inherit;
    transform:scale(0);
    object-fit: cover;
    transition:.3s;
}
:host img[src]{
    opacity:1;
    transform:scale(1);
}
:host([gallery]:not([default]):not([error])){
    cursor:pointer;
}
:host(:not([error]):not([default]):hover) img[src],:host(:focus-within) img[src]{
    transform:scale(1.1);
}
:host([fit="cover"]) img{
    object-fit:cover;
}
:host([fit="fill"]) img{
    object-fit:fill;
}
:host([fit="contain"]) img{
    object-fit:contain;
}

.placeholder{
    position:absolute;
    width:100%;
    height:100%;
    box-sizing:border-box;
    z-index:-1;
    transition:.3s;
    background:inherit;
    visibility:hidden;
}
:host([error]) .placeholder{
    visibility:visible;
    z-index:2;
    background: #eee;
}
:host([error]) img{
    padding:0 20px;
    min-width:100px;
    min-height:100px;
    transform: none;
}
.loading{
    position:absolute;
    left:50%;
    top:50%;
    z-index:3;
    transform:translate(-50%,-50%);
    pointer-events:none;
    opacity:1;
    transition:.3s;
}
img[src]+.loading,:host([error]) .loading{
    opacity:0;
    visibility:hidden;
}
.placeholder p-icon {
    font-size:1.15em;
    margin-right:.4em;
}
.placeholder-icon{
    position:absolute;
    display:flex;
    justify-content:center;
    align-items:center;
    left:0;
    right:0;
    top:50%;
    transform:translateY(-50%);
}
.view{
    position:absolute;
    z-index:3;
    left:50%;
    top:50%;
    transform:translate(-50%,-50%) scale(2);
    opacity:0;
    color:#fff;
    display:none;
    font-size:40px;
    transition:.3s;
    pointer-events:none;
}
:host([gallery]:not([error]):not([default])) .view{
    display:inline-block;
}
:host([gallery]:not([error]):not([default]):hover) .view,:host(:focus-within) .view{
    opacity:1;
    transform:translate(-50%,-50%) scale(1);
}
.animation .shape {
    border-radius: 50%;
    background:var(--themeBackground,var(--themeColor,#42b983));
}
.animation{
    width:2em;
    height:2em;
    display:grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap:.7em;
    transform: rotate(45deg);
    animation: rotation 1s infinite;
}
.shape1 {
    animation: animation4shape1 0.3s ease 0s infinite alternate;
}
@keyframes rotation {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
@keyframes animation4shape1 {
    from {
        transform: translate(0, 0);
    }
    to {
        transform: translate(5px, 5px);
    }
}
.shape2 {
    opacity:.8;
    animation: animation4shape2 0.3s ease 0.3s infinite alternate;
}
@keyframes animation4shape2 {
    from {
        transform: translate(0, 0);
    }
    to {
        transform: translate(-5px, 5px);
    }
}
.shape3 {
    opacity:.6;
    animation: animation4shape3 0.3s ease 0.3s infinite alternate;
}
@keyframes animation4shape3 {
    from {
        transform: translate(0, 0);
    }
    to {
        transform: translate(5px, -5px);
    }
}
.shape4 {
    opacity:.4;
    animation: animation4shape4 0.3s ease 0s infinite alternate;
}
@keyframes animation4shape4 {
    from {
        transform: translate(0, 0);
    }
    to {
        transform: translate(-5px, -5px);
    }
}`;
                