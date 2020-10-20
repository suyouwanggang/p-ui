import {css} from 'lit-element';
                    export default css`:host{
    font-size:inherit ;
    display:block;
    box-sizing:border-box;
}
:host([toogleable]) .panel-header{
    cursor:pointer;
}
.panel-header{
    border: 1px solid var(--panel-header-color,#dee2e6);
    padding: 0.5rem 1rem;
    background: #f8f9fa;
    color: var(--panel-header-color,#495057);
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;
    display:flex;
    justify-content:space-between;
    align-items:center;
}
div[part="panel-title"]{
    flex:1;
}
.panel-content{
    padding: var(--panel-content-padding,0.5em);
    border: 1px solid var(--panel-header-color,#dee2e6);
    background: #ffffff;
    color: #495057;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
    border-top: 0 none;
    transition: all 0.5s cubic-bezier(0,1,0.5,1);
}`;
                