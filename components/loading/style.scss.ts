import {css} from 'lit-element';
                    export default css`:host{
    font-size:inherit ;
    display:inline-flex;
    align-items: center;
    justify-content:center;
}
.loading{
    display: block;
    margin: auto;
    width: 1em;
    height: 1em;
    color:var(--themeColor,#42b983);
    animation: rotate 1.4s linear infinite;
}
.circle {
    stroke: currentColor;
    animation:  progress 1.4s ease-in-out infinite;
    stroke-dasharray: 80px, 200px;
    stroke-dashoffset: 0px;
    transition:.3s;
}
:host(:not(:empty)) .loading{
    margin-right:.5em;
}
@keyframes rotate{
    to{
        transform: rotate(360deg); 
    }
}
@keyframes progress {
    0% {
      stroke-dasharray: 1px, 200px;
      stroke-dashoffset: 0px; 
    }
    50% {
      stroke-dasharray: 100px, 200px;
      stroke-dashoffset: -15px; 
    }
    100% {
      stroke-dasharray: 100px, 200px;
      stroke-dashoffset: -125px; 
    } 
}`;
                