import { LitElement, html, css, customElement, property } from 'lit-element';
import model from '../directives/model';
import '../components/iterator';
import watchProperty from '../decorators/watchProperty';
type Person = {
    userName: string;
    displayName: string;
    color: string;
};
type Person2 = {
    user: {
        userName: string,
        displayName: string,
    };
    color: string;
};
@customElement('p-test-one')
export default class TestOne extends LitElement {
    @watchProperty('changeTestManage')
    testName: string = 'test';
    changeTestManage(value: string, oldValue: string, name: PropertyKey, isFirstChange: boolean) {
        console.log(`value=${value}  oldvalue=${oldValue} name=${String(name)} isFirstChange=${isFirstChange}`);
    }
    @property({ attribute: false })
    userMap = new Map<number, Person2>();

    @property({ attribute: false })
    person: Person = {
        userName: 'wanggang',
        displayName: '王刚',
        color: 'red'
    };
    @property({ attribute: false })
    array: Person2[] = [];
    constructor() {
        super();
        for (let i = 0; i < 10000; i++) {
            let p = {
                user: {
                    userName: 'wanggang' + i,
                    displayName: '王刚' + i,
                },
                color: 'red'
            };
            this.userMap.set(i, p);
            this.array.push(p);
        }
    }
    renderArray() {
        return this.array.map((tempPerson: Person2) =>
            html`
                <div>
                    <span style='background-color:${model(tempPerson,'color')};width:300px;display:inline-block'>${model(tempPerson,
                        'color')} </span>
                    <p-color .value=${model(tempPerson, 'color' , 'change' )}></p-color>
                    <span>${model(tempPerson, 'user.userName')}</span>
                    <span>${model(tempPerson, 'user.displayName')}</span>
                    <p-input type='text' placeholder='userName' .value=${model(tempPerson, 'user.userName' )}></p-input>
                    <input type='text' placeholder='userName' .value=${model(tempPerson, 'user.userName' )} />
                    <input type='text' name='displayname' placeholder='displayName' .value=${model(tempPerson, 'user.displayName' )} />
                </div>
            `
        );
    }
    static templateFun = (value: Person, index: number) => {
        return html`<div> array: ${index + 1}. ${model(value, (valueObj) => JSON.stringify(valueObj))}</div>`;
    }
    static templateMap = (value: Person, index: number) => {
        return html`<div> key=${index}. value=${model(value, (valueObj) => JSON.stringify(valueObj))}</div>`;
    }
    renderIterator() {
        return html`<p-iterator .value=${this.array} .template=${TestOne.templateFun}></p-iterator>`;
    }
    iteratorMap() {
        return html`<p-iterator .value=${this.userMap} .template=${TestOne.templateMap}></p-iterator>`;
    }
    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(_changedProperties);
    }
    update(changedProperties: Map<string | number | symbol, unknown>) {
        console.log(' ----update ---');
        super.update(changedProperties);
    }

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        console.log(' ----updatedupdatedupdated ---');
        super.update(changedProperties);
    }
    renderTestName() {
        return html`<div><input type='text' .value=${this.testName} @change=${(event: Event)=> { this.testName = (event.target as any).value; }}
    /></div>`;
    }
    render() {
        return html`<div>
    ${this.renderTestName()}
    <span>${model(this, 'person.color')}</span>
    <p-color .value=${model(this, 'person.color' , 'change' )}></p-color>
    <span>${model(this.person, (a: Person) => JSON.stringify(a))}</span>
    <input type='text' placeholder='userName' .value=${model(this.person, 'userName' )} />
    <span>${model(this.person, 'displayName')}</span>
    <input type='text' name='displayname' placeholder='displayName' .value=${model(this.person, 'displayName' )} />
</div> ${this.renderIterator()}`;
    }
}
