import {LitElement ,html, property } from "lit-element";

export class MyWindow extends LitElement {
    @property() url:String = "";
    @property() width:String = "400px";
    @property()  height:String = "800px";
    constructor(){
        super();
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
       
        if(this.url!==''){
          return this.renderIFrame();
        }else{
          return html ``;
         }

        
        
    }
    renderIFrame(){
        return html`<iframe style='width:${this.width};height:${this.height}' src="${this.url}"></iframe>`;
    }
    
  }
  customElements.define('my-window', MyWindow);


