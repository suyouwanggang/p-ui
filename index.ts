
import {  html,  css, LitElement } from 'lit-element';
import 'element-closest-polyfill';
import './elements/p-tips';
import './elements/p-icon';
import './elements/p-loading';
import './elements/p-checkbox';
import './elements/p-radio';
import './elements/p-button';
import './elements/p-text';
import './elements/p-rate';
import './elements/p-pagebtn';
import './elements/p-input';
import './elements/p-slider';
import './elements/p-switch';
import './elements/p-tab';
import './elements/tree/PTree';
import './elements/p-pop';
import './elements/p-text';
import './elements/p-color-panel';
import './elements/p-color';
import './elements/p-select';
import PDialog from './elements/p-Dialog';
import PMessage from './elements/p-message';
import   './elements/p-date-picker';
import   './elements/p-layout';
import   './elements/p-panel';
import   './elements/p-fieldset';
import   './elements/p-accordionPanel';
import   './elements/p-routslot';
import   './elements/p-for';
const LitHeler={
  html:html,
  css:css
}
 declare global {
  interface Window {
      LitHelper:any
      PDialog:any
      PMessage:any
  }
}
  // IMPORTANT: do not change the property name or the assignment expression.
  // This line will be used in regexes to search for LitElement usage.
  // TODO(justinfagnani): inject version number at build time
  (window['LitHelper'] || (window['LitHelper'] =LitHeler ));
  (window['PDialog'] || (window['PDialog'] =PDialog  ));
  (window['PMessage'] || (window['PMessage'] =PMessage  ));


