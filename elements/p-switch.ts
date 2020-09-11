import { LitElement, html, customElement, property, css } from 'lit-element';
@customElement('p-switch')
export class PSwitch extends LitElement {
    @property({ type: Boolean ,reflect:true}) disabled: boolean = false;
    @property({ type: String ,reflect:true}) value: string = '';
    @property({ type: Boolean,reflect:true }) checked: boolean = false;
    @property({ type: String, reflect:true}) name: string = '';
    
   
    static get formAssociated() {
        return true;
    }
    static styles = css`
        :host{
            display:inline-block;
            width:2.4em;
            height:1.2em;
        }
        label{
            background-color:#eee;
            display:inline-block;
            height:100%;width:100%;
            padding:.125em;
            vertical-align: middle;
            border-radius:1.2em;
            transition:.3s width,.3s height,.3s background-color;
            text-align:left;
            cursor:pointer;
        }
        label[data-disabled=true]{
            pointer-events: all;
            cursor:not-allowed;
            opacity:0.4;
        }
        label[checked]{
            background-color:var(--themeBackground,var(--themeColor,#42b983));
            text-align:right;
        }
        label::after{
            content:'';
            display:inline-block;
            width:.4em;
            height:.4em;
            border-radius:1.2em;
            border:.4em solid #fff;
            background:#fff;
            transition:.3s background-color,.3s padding,.3s width,.3s height,.3s border-radius,.3s border;
            box-shadow: 0 2px 4px 0 rgba(0,35,11,0.2);
        }
        label:active{
            box-shadow: #eee 0 0 1px 2px;
        } 
        
    `;

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
        // console.log(`start methodName=${methodName}`);
        // for (const key of array) {
        //     console.log(key);
        // }
        // console.log(`end methodName=${methodName}`);
    }
    /**(method) PSwitch.attributeChangedCallback(name: string, old: string | null, value: string | null): void
Synchronizes property values when attributes change. */
    attributeChangedCallback(name: string, old: string | null, value: string | null) {
        super.attributeChangedCallback(name, old, value);
        

    }
    connectedCallback() {
        super.connectedCallback();
        this.log('connectedCallback', [...arguments]);

    }
    /**Invoked when the element is first updated. Implement to perform one time work on the element after update.

Setting properties inside this method will trigger the element to update again after this update cycle completes.

    @param _changedProperties Map of changed properties with old values */
    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(_changedProperties);
        this.log('firstUpdated', [...arguments]);

    }
    /**
     * Performs element initialization. By default this calls createRenderRoot to create the element renderRoot node and captures any pre-set values for registered properties.
     * 
     */
    initialize() {
        super.initialize();
        this.log('initialize', [...arguments]);

    }
    /*
        Performs an element update. Note, if an exception is thrown during the update, firstUpdated and updated will not be called.

You can override this method to change the timing of updates. If this method is overridden, super.performUpdate() must be called.

For instance, to schedule updates to occur just before the next frame:
 */
    performUpdate(): void | Promise<unknown> {

        this.log('performUpdate', [...arguments]);
        super.performUpdate();
    }
	
	/**Controls whether or not update should be called when the element requests an update. By default, this method always returns true, but this can be customized to control when to update.

    @param _changedProperties Map of changed properties with old values */
    shouldUpdate(_changedProperties: Map<string | number | symbol, unknown>): boolean {

        this.log('shouldUpdate', [...arguments]);
        return super.shouldUpdate(_changedProperties);
    }
    /*
        Updates the element. This method reflects property values to attributes and calls render to render DOM via lit-html.
         Setting properties inside this method will not trigger another update
    */
    update(changedProperties: Map<string | number | symbol, unknown>) {
        
        /*
		const checked = this.checked;
		if (checked) {
            this.setAttribute('checked', '');
        } else {
            this.removeAttribute('checked');
        }*/
        super.update(changedProperties);
        this.log('update', [...arguments]);
    }
    /**Invoked whenever the element is updated. Implement to perform post-updating tasks via DOM APIs, for example, focusing an element.

Setting properties inside this method will trigger the element to update again after this update cycle completes.

@param _changedProperties Map of changed properties with old values */
    updated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(_changedProperties);
        this.log('updated', [...arguments]);

    }
   

}