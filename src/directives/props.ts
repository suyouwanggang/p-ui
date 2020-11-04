import { directive,PropertyPart } from 'lit-html';
 type KeyValue={
     [key:string]:unknown;
 };
const previousProps = new WeakMap<PropertyPart, KeyValue>();
/**
 * 将对象的所有属性都设置给element
 * @param 对象属性
 * @exclude 排除哪些属性
 */
 const props = directive((props:KeyValue,...exclude:string[] )=> (part: PropertyPart) => {
    const prev=previousProps.get(part);
    const element:any=part.committer.element;
    previousProps.set(part,props);
    for(const key in props){
        if(exclude.includes(key)){
            continue;
        }
        const value=props[key];
        if(!prev||prev[key]!==value){
            element[key]=value;
        }
    }
    //删除以前设置的属性， 如果在新的对象中不存在
    if(prev){
        for(const key in prev){
            if(exclude.includes(key)){
                continue;
            }
            if(!props || !(key in props)){
                element[key]=undefined;
            }
        }
    }
});


/**
 * 将对象的指定属性设置给element
 * @param 对象属性
 * @inclues 只包含哪些属性
 */
const propsInclude = directive((props:KeyValue,...includes:string[] )=> (part: PropertyPart) => {
    const prev=previousProps.get(part);
    const element:any=part.committer.element;
    previousProps.set(part,props);
    includes.forEach( (key) =>{
        if(key in props){
            const value=props[key];
            if(!prev||prev[key]!==value){
                element[key]=value;
            }
        }
    })
    
    //删除以前设置的属性， 如果在新的对象中不存在
    if(prev){
        for(const key in prev){
            if(includes.includes(key)){
                if(!props || !(key in props)){
                    element[key]=undefined;
                }
            }
        }
    }
});
export {propsInclude};
export default props;