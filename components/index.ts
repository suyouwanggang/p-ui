
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
import './switch/index';
import './tab/index';
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

declare global {
    interface Window {
        
        PDialog:any,
        PMessage:any
    }
}

(window['PDialog'] || (window['PDialog'] =PDialog));
(window['PMessage'] || (window['PMessage'] =PMessage));
    
  