
import './tips/index';
import './icon/index';
import './img/index';
import './loading/index';
import './checkbox/index';
import './radio/index';
import './button/index';
import './text/index';
import './rate/index';
import './input/index';
import './slider/index';
import './page-btn/index';
import './switch/index';
import './tab/index';
import * as treeHepler from './tree/treeFillter';
import './tree/index';
import './pop/index';
import './color-panel/index';
import './color/index';
import './select/index';
import  PDialog from './dialog/index';
import  PMessage from './message/index';
import './date-picker/index';
import './layout/index';
import './panel/index';
import './fieldset/index';
import './accordionPanel/index';
import './step';
import './scroll/index';
import './table/index';
import './organization-tree/index';
import './utils/cloneNode';
declare global {
    interface Window {
        PDialog: typeof PDialog;
        PMessage:typeof PMessage;
        treeHepler:typeof treeHepler;
    }
}

(window['PDialog'] || (window['PDialog'] =PDialog));
(window['PMessage'] || (window['PMessage'] =PMessage));
(window['treeHepler'] || (window['treeHepler'] =treeHepler));
