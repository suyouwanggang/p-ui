import {css} from 'lit-element';
             export default css`:host{
    display:block;
}
:host([active]) .ac-tab-header{
    background-color:  var(--ac-tab-active-background-color,#fafafa);
}

.ac-tab-header{
    border-top: 1px solid var(--ac-tab-border-color,#c8c8c8);
    background-color:  var(--ac-tab-background-color,#fafafa);
    padding: .3em 0.6em;
    font-size: 1.1em;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:space-between;

}
p-icon[part=right-icon]{
     margin-right: .429em;
}
div[part=ac-tab-content]{
    border-top: 1px solid var(--ac-tab-border-color,#c8c8c8) ;
    background-color: #fff;
    padding: .3em 0.6em;
}
div[part=ac-tab-content].close{
    display:none;
}`;
            