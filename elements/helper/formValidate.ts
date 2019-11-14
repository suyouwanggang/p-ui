interface ValidateResult {
    valid: boolean; /**true ,验证通过，否则，验证不通过 */
    type?: string; //错误类型
    validationMessage?: string; //错误说明
}

interface ValidateItem {
    method(input: unknown): ValidateResult | undefined;
}


const getTipLabel = function (input: HTMLInputElement) {
    let label = input.getAttribute('tipLabel');
    if (label === null) {
        label = '此字段';
    }
    return label;
};
const requiredValidte: ValidateItem = {
    method(input: HTMLInputElement) {
        const value = input.value.trim();
        const result: ValidateResult = {
            valid: value.length > 0,
            type: 'valueMissing'
        }
        if (!result.valid) {
            result.validationMessage = `请填写${getTipLabel(input)}`;
        }
        return result;
    }
};


const minValidte: ValidateItem = {
    method(input: HTMLInputElement) {
        if (input.value.length === 0) {
            return undefined;
        }
        const value = Number(input.value.trim());
        const min = Number(input.getAttribute('min'));
        const result: ValidateResult = {
            valid: true
        }
        if (isNaN(value)) {
            result.valid = false;
            result.type = 'typeMismatch';
            result.validationMessage = '请填写有效的数字';
            return result;
        }
        if (!isNaN(min)) {
            result.valid = value >= min;
        }
        if (!result.valid) {
            result.type = 'rangeUnderflow';
            result.validationMessage = `值必须大于或等于${min}`;
        }
        return result;
    }
};

const maxValidte: ValidateItem = {
    method(input: HTMLInputElement) {
        if (input.value.length === 0) {
            return undefined;
        }
        const value = Number(input.value.trim());
        const max = Number(input.getAttribute('max'));
        const result: ValidateResult = {
            valid: true
        }
        if (isNaN(value)) {
            result.valid = false;
            result.type = 'typeMismatch';
            result.validationMessage = '请填写有效的数字';
            return result;
        }
        if (!isNaN(max)) {
            result.valid = value <= max;
            result.type = 'rangOverflow';
        }
        if (!result.valid) {
            result.type = 'rangeUnderflow';
            result.validationMessage = `值必须小于或等于${max}`;
        }
        return result;
    }
};

const getCountDecimals = function (n: Number) {
    if (Math.floor(n.valueOf()) === this.valueOf()) return 0;
    return n.toString().split('.')[1].length || 0;
};
const stepValidte: ValidateItem = {
    method(input: HTMLInputElement) {
        if (input.value.length === 0) {
            return undefined;
        }
        const value = Number(input.value.trim());
        let scale = Number(input.getAttribute('scale'));
        scale = Math.abs(Number(scale.toFixed(0)));
        const result: ValidateResult = {
            valid: true
        }
        if (isNaN(value)) {
            result.valid = false;
            result.type = 'typeMismatch';
            result.validationMessage = '请填写数字';
            return result;
        }
        const countScales = getCountDecimals(value);
        if (countScales > scale) {
            result.type = 'stepMismatch';
            result.validationMessage = `请输入有效的${scale}位数字`;
        }
        return result;
    }
};


const tooShortValidte: ValidateItem = {
    method(input: HTMLInputElement) {
        const value = input.value;
        const minlength = Number(input.getAttribute('minlength'));
        const result: ValidateResult = {
            valid: true
        };
        if (!isNaN(minlength) && value.length < minlength) {
            result.valid = false;
            result.type = 'tooShort';
            result.validationMessage = `请填写${minlength}个或者${minlength}个以上字符`;
            return result;
        }

        return result;
    }
};
const tooLongValidte: ValidateItem = {
    method(input: HTMLInputElement) {
        const value = input.value;
        const maxlength = Number(input.getAttribute('maxlength'));
        const result: ValidateResult = {
            valid: true
        };
        if (!isNaN(maxlength) && value.length > maxlength) {
            result.valid = false;
            result.type = 'tooLength';
            result.validationMessage = `请填写${maxlength}个或者${maxlength}个以下字符`;
            return result;
        }
        return result;
    }
};

const patternValidte: ValidateItem = {
    method(input: HTMLInputElement) {
        const value = input.value;
        const pattern = input.pattern;
        const result: ValidateResult = {
            valid: true
        };
        if (pattern !== undefined) {
            const reg = new RegExp(pattern);
            result.valid = reg.test(value);
            if (!result.valid) {
                result.type = 'patternMismatch';
                const message = input.getAttribute('patternErrorMessage');
                result.validationMessage = message || `请与请求的格式:${pattern}一致`;
            }
        }
        return result;
    }

}
const cusotmValidate: ValidateItem = {
    method(input: HTMLInputElement) {
        const value = input.value;
        // tslint:disable-next-line: no-any
        const customValidateMethod = (input as any).customValidateMethod;
        const result: ValidateResult = {
            valid: true
        };
        if (customValidateMethod !== undefined) {
            const validateResult: ValidateResult = customValidateMethod.method(input);
            if (!validateResult.valid) {
                result.valid = false;
                result.type = 'customError';
                const message = input.getAttribute('customErrorMessage');
                result.validationMessage = message || `自定义验证失败`;
            }
        }
        return result;
    }
}
const getDefaultValidateList = (inputEL: HTMLInputElement|unknown) => {
    const input= inputEL as any;
    const items: ValidateItem[] = [];
    if (input.required) {
        items.push(requiredValidte);
    }
    if (input.minLength) {
        items.push(tooShortValidte);
    }
    if (input.maxLength) {
        items.push(tooLongValidte);
    }
    if (input.min !== undefined) {
        items.push(minValidte);
    }
    if (input.max !== undefined) {
        items.push(maxValidte);
    }

    if (input.pattern !== undefined) {
        items.push(patternValidte);
    }
    if (input.customValidateMethod) {
        items.push(cusotmValidate);
    }

    return items;
}

const getValidityResult: any = (input: HTMLInputElement|unknown) => {
    const items = getDefaultValidateList(input);
    const result = {
        badInput: false,
        customError: false,
        patternMismatch: false,
        rangeOverflow: false,
        rangeUnderflow: false,
        stepMismatch: false,
        tooLong: false,
        tooShort: false,
        typeMismatch: false,
        valid: true,
        valueMissing: false,
        message: {

        }
    };
    for (let i = 0, j = items.length; i < j; i++) {
        const item = items[i];
        const itemResult = item.method(input);
        if (itemResult !== undefined && !itemResult.valid) {
            result.valid = false;
            if (itemResult.type) {
                result[itemResult.type] = true;
                result.message[itemResult.type] = itemResult.validationMessage;
            }
        }
    }
    return (result as ValidityState);
};


let inputEL = document.createElement('input');
inputEL.required = true;
inputEL.pattern='[0-9]ab';
inputEL.value = '2';
inputEL.minLength = 2;
inputEL.maxLength = 4;
inputEL.max = '1000';
inputEL.min = '10';
(inputEL as any).customValidateMethod={
    method(input){
        const result: ValidateResult = {
            valid: input.value!='2'
        };
        if(!result.valid){
            result.validationMessage='值不能为2';
        }

    }

}

console.log(getValidityResult(inputEL));














