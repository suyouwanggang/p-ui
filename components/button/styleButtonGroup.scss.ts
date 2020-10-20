import {css} from 'lit-element';
                    export default css`:host {
    display:inline-flex; 
}
::slotted(p-button:not(:first-of-type):not(:last-of-type)){
    border-radius:0;
}
::slotted(p-button){
    margin:0!important;
}
::slotted(p-button:not(:first-of-type)){
    margin-left:-1px!important;
}
::slotted(p-button[type]:not([type="dashed"]):not(:first-of-type)){
    margin-left:1px!important;
}
::slotted(p-button:first-of-type){
    border-top-right-radius: 0;
    border-bottom-right-radius: 0px;
}
::slotted(p-button:last-of-type){
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}`;
                