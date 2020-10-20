import {css} from 'lit-element';
                    export default css`:host{
    box-sizing:border-box; 
    display:flex ; 
    padding:0 5px;
    --lineSize:2px;
    --lineBorder:2px;
    --trackSize:10px;
}
:host([vertical]){
   height:300px;
}
:host([disabled]){
    opacity:var(--disabled-opaticity,0.6);
    --themeColor:#999; 
    cursor:not-allowed;
}
:host([disabled]) #slider{ 
    pointer-events:none; 
    opacity:var(--disabled-opaticity,0.6);
}
#slider-con{ 
    display:flex; 
    padding:5px 0; 
    width:100%;
    margin: auto;
}
::-moz-focus-inner,::-moz-focus-outer{
    border:0;
    outline : 0;
}
:host([showtips]){
    pointer-events:all;
}
#slider{
    pointer-events:all;
    margin:0 -5px;
    width: calc( 100% + 10px );
    -webkit-appearance: none;
    outline : 0;
    height: 12px;
    background:none;
    border-radius:2px;
}
:host([linesize='mid']){
    --lineSize:4px;
    --lineBorder:3px;
    --trackSize:14px;
}

:host([linesize='larger']){
    --lineSize:8px;
    --lineBorder:4px;
    --trackSize:22px;
}
#slider::-webkit-slider-runnable-track{
    display: flex;
    align-items: center;
    position: relative;
    height:var(--lineSize) ;
    border-radius:var(--lineBorder) ;
    background:linear-gradient(to right, var(--themeColor,#42b983) calc( 100% * var(--percent) ), rgba(0,0,0,.1) 0% );
}
#slider::-moz-range-progress {
    display: flex;
    align-items: center;
    position: relative;
    height:var(--lineSize);
    border-radius: var(--lineBorder);
    outline : 0;
    background:var(--themeColor,#42b983)
}
#slider::-moz-range-track{
    height:  var(--lineSize) ;
    background: rgba(0,0,0,.1);
}
#slider::-webkit-slider-thumb{
    -webkit-appearance: none;
    border:  var(--lineSize)  solid var(--themeColor,#42b983);
    position: relative;
    width:   var(--trackSize) ;
    height:  var(--trackSize) ; 
    border-radius: 50%;
    background:var(--themeColor,#42b983);
    transition:.2s cubic-bezier(.12, .4, .29, 1.46);
}
#slider::-moz-range-thumb{
    box-sizing:border-box;
    pointer-events:none;
    border:2px solid var(--themeColor,#42b983);
    position: relative;
    width:    var(--trackSize) ; 
    height:   var(--trackSize) ; 
    border-radius: 50%;
    background:var(--themeColor,#42b983);
    transition:.2s cubic-bezier(.12, .4, .29, 1.46);
}
#slider:focus{
    z-index:2;
}
#slider::-webkit-slider-thumb:active,
#slider:focus::-webkit-slider-thumb{
    transform:scale(1.2);
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    background: #fff;
}
#slider::-moz-range-thumb:active,
#slider:focus::-moz-range-thumb{
    transform:scale(1.2);
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    background: #fff;
}
:host([vertical]) #slider-con{
    position: absolute;
    top: 50%;
    left: 50%;
    transform:translate(-50%, -50%) rotate(-90deg);
    width:calc( var(--h,300px)  - 10px );
}
:host([vertical]) #slider-con::before{
    writing-mode: vertical-lr;
    padding: 10px 6px;
}
:host([vertical]){
    display:inline-flex;
    position:relative;
    width:20px;
}
:host([vertical]) p-tips::before,:host([vertical]) p-tips::after{
    left: calc( var(--percent ,.5) * 100% + 5px );
}
:host(:focus-within) #slider-con,:host(:hover) #slider-con{
    z-index:10
}`;
                