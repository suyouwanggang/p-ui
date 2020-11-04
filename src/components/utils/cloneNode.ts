import { LitElement } from "lit-element";

class DeepClone extends HTMLElement{
    cloneNode(deep?:boolean){
       const clondeNodeElement:any=super.cloneNode(deep);
       const iteratorNode=(old:Element, newNode:Element) =>{
           if(old instanceof LitElement){
               const properties:Map<PropertyKey,any>=((old as LitElement).constructor as any)._classProperties;
               const set=properties.keys();
               for(let key of set){
                    (newNode as any)[key]=(old as any)[key];
               }
               if((old as any)['customStyle']){
                 (newNode as any)['customStyle']=(old as any)['customStyle'];
               }
           }
           if(deep){
            const old_children=old.children;
            if(old_children){
                const new_children=newNode.children;
                for(let i=0,j=old_children.length;i<j;i++){
                    iteratorNode(old_children[i],new_children[i]);
                }
            }
         }
       }
       iteratorNode(this,clondeNodeElement);
       return clondeNodeElement;
    }
}
const applyMixins=(derivedCtor: any, baseCtors: any[],methods:string[])=> {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            if(methods.includes(name)){
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            }
        })
    }); 
}
applyMixins(LitElement,[DeepClone],['cloneNode']);
