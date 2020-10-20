import {css} from 'lit-element';
                    export default css`
       :host{
        font-size:inherit ;
        display:inline-block;
        transition:.3s;
    }
    .svgclass {
        display:block;
        width: 1em;
        height: 1em;
        margin: auto;
        fill: currentColor;
        overflow: hidden;
        vertical-align: -0.15em;
        /*transition:inherit;*/
    }
    :host([spin]){
        animation: rotate 1.4s linear infinite;
    }
    @keyframes rotate{
        to{
            transform: rotate(360deg);
        }
    }`;
                