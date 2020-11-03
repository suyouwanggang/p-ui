import { directive,PropertyPart } from 'lit-html';
// tslint:disable-next-line: no-any
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
    if(prev==props){
        return;
    }
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
    //删除 以前设置的属性， 如果在新的对象中不存在
    if(prev){
        for(const key in prev){
            if(!props || !(key in props)){
                element[key]=undefined;
            }
        }
    }
});
export default props;