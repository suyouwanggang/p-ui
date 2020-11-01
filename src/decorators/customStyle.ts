import { Constructor, LitElement, PropertyValues, UpdatingElement } from "lit-element";
/**
 * @customStyle 给组件提供一个style 标签，注入自定义的样式
 */
export const  customStyle=()=> {
    const key='customStyle';
    const keyCustomStyle=Symbol('keyCustomStyle');
    return (protoOrDescriptor: Constructor<UpdatingElement>) => {
        Object.defineProperty(protoOrDescriptor.prototype,key,{
            configurable:true,
            enumerable:true,
             set(value){
                 const element:LitElement=this;
                 element.updateComplete.then(()=>{
                    if((element as any)[keyCustomStyle]==undefined){
                        const style = document.createElement('style');
                        style.setAttribute('name','customStyle');
                        (element as any)[keyCustomStyle]=style;
                         element.renderRoot.appendChild(style);
                    }
                    if(value!==(element as any)[keyCustomStyle].textContent){
                        (element as any)[keyCustomStyle].textContent=value;
                    }
                })
             },
             get(){
                const element=this;
                const keyStyle=(element as any)[keyCustomStyle];
                return keyStyle!=undefined? keyStyle.textContent:'';
             }
        });
       
    };
}
