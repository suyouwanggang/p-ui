import {css} from 'lit-element';
                    export default css`:host{
    display:inline-block;
    width:2.4em ;
    height:1.2em;
}
label{
    background-color:#eee;
    display:inline-block;
    height:100%;width:100%;
    padding:.125em;
    vertical-align: middle;
    border-radius:1.2em;
    transition:.3s width,.3s height,.3s background-color;
    text-align:left;
    cursor:pointer;
}
label[data-disabled=true]{
    pointer-events: all;
    cursor:not-allowed;
    opacity:0.4;
}
label[checked]{
    background-color:var(--themeBackground,var(--themeColor,#42b983));
    text-align:right;
}
label::after{
    content:'';
    display:inline-block;
    width:.4em;
    height:.4em;
    border-radius:1.2em;
    border:.4em solid #fff;
    background:#fff;
    transition:.3s background-color,.3s padding,.3s width,.3s height,.3s border-radius,.3s border;
    box-shadow: 0 2px 4px 0 rgba(0,35,11,0.2);
}
label:active{
    box-shadow: #eee 0 0 1px 2px;
} `;
                