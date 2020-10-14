import { LitElement, html, css, customElement, property } from 'lit-element';
import model from '../directives/model';
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
            }
            this.array.push(p);
        }
    }
    renderArray(){
    return this.array.map( (tempPerson:Person2) =>
            html`
                <div>
                    <span>${model(tempPerson, 'color')}</span>
                    <p-color .value=${model(tempPerson, 'color', 'change')}></p-color>
                    <span>${model(tempPerson, 'user.userName')}</span>
                    <input type='text' placeholder='userName' .value=${model(tempPerson, 'user.userName')} />
                    <span>${model(tempPerson, 'user.displayName')}</span>
                    <input type='text' name='displayname' placeholder='displayName' .value=${model(tempPerson, 'user.displayName')} />
                </div>
            `
        );
    }
    firstUpdated( _changedProperties: Map<string | number | symbol, unknown>  ){
        super.firstUpdated(_changedProperties);
    }
    render() {
        return html`<div>
             <span>${model(this.person, 'color')}</span>
                 <p-color .value=${model(this.person, 'color', 'change')}></p-color>
                <span>${model(this.person, 'userName')}</span>
                <input type='text' placeholder='userName' .value=${model(this.person, 'userName')} />
                <span>${model(this.person, 'displayName')}</span>
                <input type='text' name='displayname' placeholder='displayName' .value=${model(this.person, 'displayName')} />
        </div>${this.renderArray()}` ;
    }
}
