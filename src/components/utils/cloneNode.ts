import { LitElement } from "lit-element";
/**
 * 复制LitElement webcomponent 
 * @param element 需要clone 的组件
 * @param deep 是否复制子孩子
 */
 const cloneHelper= (element:Element ,deep?:boolean) =>{
       const clondeNodeElement:any=element.cloneNode(deep);
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
    iteratorNode(element,clondeNodeElement);
    return clondeNodeElement;
}
export default cloneHelper;