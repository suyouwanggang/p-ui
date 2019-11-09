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


var arr = [1,2,3]
var handle: ProxyHandler<any[]|Object>= {
    //target目标对象 key属性名 receiver实际接受的对象
    get(target:any[]|Object ,key:PropertyKey ,receiver:any ) {
        console.log(`get ${key as string }`)
        // Reflect相当于映射到目标对象上
        return Reflect.get(target,key,receiver)
    },
    set(target:any[]|Object ,key:PropertyKey,value:any,receiver) {
        console.log(`set ${key as string }`)
        return Reflect.set(target,key,value,receiver)
    }
}
//arr要拦截的对象，handle定义拦截行为
var proxy:any[]= new Proxy(arr,handle) as any[];

proxy.push(4) //可以翻到控制台测试一下会打印出什么


let handler :ProxyHandler<any>= {
    get (target:any, key:PropertyKey, receiver:any) {
      // 递归创建并返回
      if (typeof target[key] === 'object' && target[key] !== null) {
        return new Proxy(target[key], handler)
      }
      return Reflect.get(target, key, receiver)
    }
  }
  let obj={};

