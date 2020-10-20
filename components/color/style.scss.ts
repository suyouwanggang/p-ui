import {css} from 'lit-element';
                    export default css`
        :host{
            display:inline-block; 
            width:30px;
            height:30px;
            font-size:14px;
            --distance:10px;
        }
        :host([block]){
            display:block;
            width:auto;
        }

        :host([disabled]){
            pointer-events:none;
        }
        p-pop{
            --distanceValue:var(--distance,10px);
            display:block;
            width:100%;
            height:100%;
        }
        .color-btn{
            width:100%;
            height:100%;
            padding:5px;
            background-clip: content-box;
            background-color:var(--themeColor,#42b983);
        }
        // :host([block] [dir='bottomleft']) p-pop-content{
        //     min-width: 100%;
        // }
        // :host([block][dir='bottomleft']) p-pop-content::part(popBody){
        //     width:auto;
        // }
        // :host([block][dir='bottomleft']) p-pop-content p-color-panel{
        //     width:auto;
        // }
        .pop-footer{
            display:flex;
            justify-content:flex-end;
            padding:0 .8em .8em;
        }
        .pop-footer p-button{
            font-size: inherit;
            margin-left: .8em;
        }
        .color-btn::before{
            content:'';
            position:absolute;
            left:5px;
            top:5px;
            right:5px;
            bottom:5px;
            z-index:-1;
            background:linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 ),linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 );
            background-position:0 0,5px 5px;
            background-size:10px 10px;
        }`;
                