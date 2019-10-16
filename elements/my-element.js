import {LitElement ,html} from "lit-element";

class MyElement extends LitElement {
    static get properties(){
      return {
        foo:{type:String}
      }
    }
	
    constructor(){

        super();
        this.foo="message";
    }
    /**
     * Implement `render` to define a template for your element.
     *
     * You must provide an implementation of `render` for any element
     * that uses LitElement as a base class.
     */
    render(){
     
      /**
       * `render` must return a lit-html `TemplateResult`.
       *
       * To create a `TemplateResult`, tag a JavaScript template literal
       * with the `html` helper function:
       */
      return html`
         <style>
           :host{

             color:red;
           }
         </style>
        ${this.foo}
        
      `;
    }
  }
  customElements.define('my-element', MyElement);