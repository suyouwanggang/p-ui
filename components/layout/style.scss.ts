import {css} from 'lit-element';
                    export default css`:host{
    display:flex ;
    flex-direction:column;
}
:host([expand]){
    flex:1;
}
:host([row]){
    flex-direction:row;
}
:host([mainAgile=start]){
    justify-content:flex-start;
}
:host([mainAgile=end]){
    justify-content:flex-end;
}
:host([mainAgile=center]){
    justify-content:center;
}
:host([crossAgile=start]){
    align-items:flex-start;
}
:host([crossAgile=end]){
    align-items:flex-end;
}
:host([crossAgile=center]){
    align-items:center;
}

:host([center]){
    justify-content:center;
    align-items:center;
}`;
                