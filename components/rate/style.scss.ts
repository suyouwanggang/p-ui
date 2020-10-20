import {css} from 'lit-element';
                    export default css`:host {
    display:contents ;
}
:host div{
    display:inline-flex;
}
p-tips{
    margin:auto 4px;
}
 p-tips.mouseSelect p-icon {
    color: var(--rate-on-color,var(--themeColor,#42b983));
    transform:scale(1.2);
    transition:transform 0.3 ease;
}

p-tips p-icon{
    font-size:1.5em;
    cursor:pointer;
    color:var(--rate-off-color,#eee);
}

:host([disabled]) div p-icon{
    opacity:0.6;
}
:host([disabled]) p-tips,
:host([disabled]) p-icon{
    cursor:default;
}`;
                