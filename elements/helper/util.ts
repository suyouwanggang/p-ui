 const numberRegMap = new Map<Number, RegExp>();
 const  numberReg = /([0-9]+)[\.0-9]*/;
export  const getNumberReg = function (scale: number): RegExp {
    if (scale == 0) {
        return numberReg;
    } else {
        let result = numberRegMap.get(scale);
        if (result === undefined) {
            result = new RegExp('([0-9]+\\.[0-9]{' + scale + '})[0-9]*');
            numberRegMap.set(scale, result);
        }
        return result;
    }
};

