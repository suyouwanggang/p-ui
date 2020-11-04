import { directive, NodePart, PropertyPart, TemplateResult } from 'lit-html';
 const forIterator = directive(<T>(arrays:Array<T>,  template: (t:T,index:number)=>TemplateResult|TemplateResult[])=> (part: PropertyPart) => {
    if(!(part instanceof NodePart)){
        throw new Error ('forIterator can noly by user in text binding' );
    }
    const result:any[]=[];
    if(arrays){
        for(let i=0,j=arrays.length;i<j;i++){
            result.push(template(arrays[i],i));
        }
    }
    part.setValue(result);
    //console.log(part);
});
export default forIterator;