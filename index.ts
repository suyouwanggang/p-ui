
import {  html,  css,  } from 'lit-element';
import 'element-closest-polyfill';
import './elements/p-tips';
import './elements/p-icon';
import './elements/p-loading';
import './elements/p-checkbox';
import './elements/p-button';
import './elements/p-input';
import './elements/p-switch';
import './elements/p-tab';
import './elements/tree/PTree';


const LitHeler={
  html:html,
  css:css
}
 declare global {
  interface Window {
      LitHelper:any
  }
}
  // IMPORTANT: do not change the property name or the assignment expression.
  // This line will be used in regexes to search for LitElement usage.
  // TODO(justinfagnani): inject version number at build time
  (window['LitHelper'] || (window['LitHelper'] =LitHeler  ));
     