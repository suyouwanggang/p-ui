import {css} from 'lit-element';
                    export default css`:host{
    display:block ;
    box-sizing:border-box;
}
:host([vertical]) div[part='container']{
   flex-direction:column;
   display:block;
}
div[part='container']{
   display:flex;
}
`;
                