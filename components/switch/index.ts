import { LitElement, html, customElement, property, css } from 'lit-element';
import styleSwitchObj from './style.scss';
@customElement('p-switch')
export class PSwitch extends LitElement {
    @property({ type: Boolean ,reflect:true}) disabled: boolean = false;
    @property({ type: String ,reflect:true}) value: string = '';
    @property({ type: Boolean,reflect:true }) checked: boolean = false;
    @property({ type: String, reflect:true}) name: string = '';
    static get formAssociated() {
        return true;
    }
    static styles =styleSwitchObj;

    constructor() {
        super();

    }
    changeCheck() {
        if (this.disabled) {
            return;
        } else {
            this.checked = !this.checked;
            this.dispatchChangeEvent( );
        }
    }
    dispatchChangeEvent(){
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                checked: this.checked
            }
        }));

    }
    
    render() {
        return html`<label data-disabled=${this.disabled} value=${this.value} ?checked=${this.checked} name=${this.name}  @click="${this.changeCheck}"></label>`;
    }
    log(methodName: string, array: any[]) {
       
    }
   
    connectedCallback() {
        super.connectedCallback();
       

    }
    /**Invoked when the element is first updated. Implement to perform one time work on the element after update.

Setting properties inside this method will trigger the element to update again after this update cycle completes.

    @param _changedProperties Map of changed properties with old values */
    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(_changedProperties);
    }
    /**
     * Performs element initialization. By default this calls createRenderRoot to create the element renderRoot node and captures any pre-set values for registered properties.
     * 
     */
    initialize() {
        super.initialize();
    }
    /*
        Performs an element update. Note, if an exception is thrown during the update, firstUpdated and updated will not be called.

You can override this method to change the timing of updates. If this method is overridden, super.performUpdate() must be called.

For instance, to schedule updates to occur just before the next frame:
 */
    performUpdate(): void | Promise<unknown> {
        super.performUpdate();
    }
	
	/**Controls whether or not update should be called when the element requests an update. By default, this method always returns true, but this can be customized to control when to update.

    @param _changedProperties Map of changed properties with old values */
    shouldUpdate(_changedProperties: Map<string | number | symbol, unknown>): boolean {
        return super.shouldUpdate(_changedProperties);
    }
    /*
        Updates the element. This method reflects property values to attributes and calls render to render DOM via lit-html.
         Setting properties inside this method will not trigger another update
    */
    update(changedProperties: Map<string | number | symbol, unknown>) {
        super.update(changedProperties);
       
    }
    /**Invoked whenever the element is updated. Implement to perform post-updating tasks via DOM APIs, for example, focusing an element.

Setting properties inside this method will trigger the element to update again after this update cycle completes.

@param _changedProperties Map of changed properties with old values */
    updated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(_changedProperties);
    }
   

}