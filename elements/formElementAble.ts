type Constructor<T = {}> = new (...args: any[]) => T;
type validateType = 'number' | 'email' | 'date'|'';
export default function FormElementAble<LitElement extends Constructor>(Base: LitElement) {
    return class extends Base {
        private form: HTMLFormElement=undefined;
        @property({ type: Boolean }) novalidate: boolean = false;
        @property({ type: Boolean }) disabled: boolean = false;
        @property({ type: String }) value: string = '';
        @property({ type: String }) pattern: string ='';
        @property({ type: Boolean }) required: boolean = false;
        @property({ type: Boolean }) readOnly: boolean = false;
        @property({ type: String }) errorTips: string = '';
        @property({ type: String }) type: validateType = '';
        @property({ type: Number }) min: number = NaN;
        @property({ type: Number }) max: number = NaN;
        // tslint:disable-next-line: no-any
        $customValidity: any;
        invalid: boolean = false;

        reset() {
            this.invalid = false;
            this.errorTips ="";
        }

        get customValidity() {
            return this.$customValidity;
        }
        // tslint:disable-next-line: no-any
        set customValidity(f: any) {
            this.$customValidity = f;
        }
        checkValidity(): boolean {
            if (this.novalidate || this.disabled || this.form && this.form.novalidate) {
                return true;
            }
            return false;
        }
        get validity() {
            if (this.pattern && this.pattern != "") {
                const reg = new RegExp(this.pattern);
                let result = reg.test(this.value);
                if (!result) {
                    this.errorTips = `请于请求格式:${this.pattern}一致`;
                    return false;
                }
            }
            if (this.type == 'number') {
                const n = new Number(this.value);
                let result = isNaN(n);
                if (!result) {
                    this.errorTips = `请输入正确的数字`;
                }


            }


            return this.customValidity.method(this);
        }
        connectedCallback(){
            this.form=this.closest('form');

        }

    }
}
