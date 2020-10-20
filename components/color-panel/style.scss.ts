import {css} from 'lit-element';
                    export default css`:host{
    display: block;
    width:300px; 
}
.color-pane{
    padding:.8em;
}
.color-palette{
    position:relative;
    height:150px;
    background:linear-gradient(to top, hsla(0,0%,0%,calc(var(--a))), transparent), linear-gradient(to left, hsla(calc(var(--h)),100%,50%,calc(var(--a))),hsla(0,0%,100%,calc(var(--a)))),linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 ),linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 );
    background-position:0 0, 0 0,0 0,5px 5px;
    background-size:100% 100%, 100% 100%, 10px 10px, 10px 10px;
    user-select: none;
    cursor: crosshair;
    opacity:1;
    transition:opacity .1s;
}
.color-palette:active{
    opacity:.99;
}
.color-palette::after{
    pointer-events:none;
    position:absolute;
    content:'';
    box-sizing:border-box;
    width:10px;
    height:10px;
    border-radius:50%;
    border:2px solid #fff;
    left:calc(var(--s) * 1%);
    top:calc((100 - var(--v)) * 1%);
    transform:translate(-50%,-50%);
}
.color-chooser{
    display:flex;
    padding:10px 0;
}
.color-show{
    display:flex;
    position: relative;
    width:32px;
    height:32px;
    background:var(--c);
    transition:none;
    border-radius:50%;
    overflow:hidden;
    cursor:pointer;
}
.color-show .icon-file{
    width:1em;
    height:1em;
    margin: auto;
    fill: hsl(0, 0%, calc( ((2 - var(--s) / 100) * var(--v) / 200 * var(--a) - 0.6 ) * -999999%  ));
    opacity: 0;
    transition: .3s;
}
.color-show:hover .icon-file{
    opacity:1;
}
.color-show input{
    position:absolute;
    clip:rect(0,0,0,0);
}
.color-show::after{
    content:'';
    position:absolute;
    width:32px;
    height:32px;
    background:linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 ),linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 );
    background-position:0 0,5px 5px;
    background-size:10px 10px;
    z-index:-1;
}
.color-range{
    flex:1;
    margin-left:10px;
}
input[type="range"]{
    display: block;
    pointer-events:all;
    width:100%;
    -webkit-appearance: none;
    outline : 0;
    height: 10px;
    border-radius:5px;
    margin:0;
}
input[type="range"]::-webkit-slider-runnable-track{
    display: flex;
    align-items: center;
    position: relative;
}
input[type="range"]::-webkit-slider-thumb{
    -webkit-appearance: none;
    position: relative;
    width:10px;
    height:10px;
    transform:scale(1.2);
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    background:#fff;
    transition:.2s cubic-bezier(.12, .4, .29, 1.46);
}
input[type="range"]::-moz-range-thumb{
    box-sizing:border-box;
    pointer-events:none;
    position: relative;
    width:10px;
    height:10px;
    transform:scale(1.2);
    border-radius: 50%;
    border:0;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    background:#fff;
    transition:.2s cubic-bezier(.12, .4, .29, 1.46);
}
input[type="range"]::-webkit-slider-thumb:active,
input[type="range"]:focus::-webkit-slider-thumb{
    transform:scale(1.5);
}
input[type="range"]::-moz-range-thumb:active,
input[type="range"]:focus::-moz-range-thumb{
    transform:scale(1.5);
}
input[type="range"]+input[type="range"]{
    margin-top:10px;
}
.color-hue{
    background:linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)
}
.color-opacity{
    background:linear-gradient(to right, hsla(calc(var(--h)),100%,50%,0), hsla(calc(var(--h)),100%,50%,1)),linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 ),linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 );
    background-position:0 0,0 0,5px 5px;
    background-size:100% 100%,10px 10px,10px 10px;
}
.color-label{
    position:absolute;
    display:flex;
    visibility:hidden;
    opacity:0;
    left:0;
    right:0;
    top:0;
    bottom:0;
    transition: .3s;
}
.color-label input{
    flex:1;
    margin-right:.8em;
    outline:0;
    min-width:0;
    width: 0;
    border-radius:var(--borderRadius,.25em);
    border:1px solid #ddd;
    padding:0 5px;
    line-height:28px;
    text-align:center;
    -moz-appearance: textfield;
    transition:.3s;
}
input[type="number"]::-webkit-inner-spin-button{
    display:none;
}
::-moz-focus-inner,::-moz-focus-outer{
    border:0;
    outline : 0;
}
.color-label input:focus{
    border-color:var(--themeColor,#42b983);
}
.color-footer{
    display:flex
}
.btn-switch{
    position:relative;
    border-radius:var(--borderRadius,.25em);
    background:none;
    border:0;
    outline:0;
    line-height:30px;
    width: 60px;
    padding: 0;
    color:var(--themeColor,#42b983);
    overflow:hidden;
}
.btn-switch::before{
    content:'';
    position:absolute;
    left:0;
    top:0;
    right:0;
    bottom:0;
    background:var(--themeBackground,var(--themeColor,#42b983));
    opacity:.2;
    transition:.3s;
}
.btn-switch:hover::before,.btn-switch:focus::before{
    opacity:.3;
}
.color-input{
    position:relative;
    flex:1;
    height:30px;
    overflow:hidden;
}
.color-footer[data-type="HEXA"] .color-label:nth-child(1),
.color-footer[data-type="RGBA"] .color-label:nth-child(2),
.color-footer[data-type="HSLA"] .color-label:nth-child(3){
    opacity:1;
    visibility:inherit;
    z-index:2;
}
.color-sign{
    padding-top:10px;
    display:grid;
    grid-template-columns: repeat(auto-fit, minmax(15px, 1fr));
    grid-gap: 10px;
}
.color-sign>button{
    position:relative;
    cursor:pointer;
    width:100%;
    padding-bottom:0;
    padding-top:100%;
    border-radius:4px;
    border:0;
    outline:0;
}
.color-sign>button::before{
    content:'';
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    z-index:-1;
    background:linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 ),linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 );
    background-position:0 0,5px 5px;
    background-size:10px 10px;
    border-radius: 4px;
}
.color-sign>button::after{
    content:'';
    position:absolute;
    opacity:.5;
    z-index:-2;
    left:0;
    top:0;
    width:100%;
    height:100%;
    background:inherit;
    border-radius:4px;
    transition:.3s;
}
.color-sign>button:hover::after,.color-sign>button:focus::after{
    transform:translate(2px,2px)
}
`;
                