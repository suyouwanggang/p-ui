import { LitElement, html, css, customElement, property } from 'lit-element';
import model from '../directives/model';
import watch from '../decorators/watch';
import watchProperty from '../decorators/watchProperty';
type Person = {
    userName: string;
    displayName: string;
    color: string;
};
type Person2 = {
    user:{
        userName:string,
        displayName:string,
    };
    color: string;
};
@customElement('p-test-one')
export default class TestOne extends LitElement {
    @watchProperty('changeTestManage')
    testName:string='test';
    changeTestManage(value:string, oldValue:string,name:PropertyKey,isFirstChange:boolean){
        console.log(`value=${value}  oldvalue=${oldValue} name=${String(name)} isFirstChange=${isFirstChange}`);
    }

    @property({ attribute: false })
    person: Person = {
        userName: 'wanggang',
        displayName: '王刚',
        color: 'red'
    };
    @property({ attribute: false })
    array: Person2[]=[];
    constructor(){
        super();
       
        for (let i = 0; i < 10; i++) {
            let p = {
                user:{
                    userName: 'wanggang' + i,
                    displayName: '王刚' + i,
                },
                color: 'red'
            };
            this.array.push(p);
        }
    }
    
    renderArray(){
    return this.array.map( (tempPerson: Person2) =>
            html`
                <div>
                    <span style='background-color:${model(tempPerson, 'color')};width:100px;display:inline-block'>${model(tempPerson, 'color')} ${model(tempPerson, 'color')}</span>
                    <p-color .value=${model(tempPerson, 'color', 'change')}></p-color>
                    <span>${model(tempPerson, 'user.userName')}</span>
                    <span>${model(tempPerson, 'user.displayName')}</span>
                    <p-input type='text' placeholder='userName' .value=${model(tempPerson, 'user.userName')} ></p-input>
                    <input type='text' placeholder='userName' .value=${model(tempPerson, 'user.userName')} />
                    <input type='text' name='displayname' placeholder='displayName' .value=${model(tempPerson, 'user.displayName')} />
                </div>
            `
        );
    }
    firstUpdated( _changedProperties: Map<string | number | symbol, unknown> ){
        super.firstUpdated(_changedProperties);
        this.testName='test.73054465e6890de20c7e.hot-update.js.map';
    }
    update(changedProperties: Map<string | number | symbol, unknown>){
        console.log(' ----update ---');
        super.update(changedProperties);
    }

    updated(changedProperties: Map<string | number | symbol, unknown>){
        console.log(' ----updatedupdatedupdated ---');
        super.update(changedProperties);
    }
    renderTestName(){
        return html`<div><input type='text' .value=${this.testName} @change=${(event:Event) =>{this.testName=(event.target as any).value;}} /></div>`;
    }
    render() {
        return html`<div>
            ${this.renderTestName()}
             <span>${model(this, 'person.color')}</span>
                 <p-color .value=${model(this, 'person.color', 'change')}></p-color>
                <span>${model(this.person, 'userName')}</span>
                <input type='text' placeholder='userName' .value=${model(this.person, 'userName')} />
                <span>${model(this.person, 'displayName')}</span>
                <input type='text' name='displayname' placeholder='displayName' .value=${model(this.person, 'displayName')} />
        </div>${this.renderArray()}` ;
    }
}
