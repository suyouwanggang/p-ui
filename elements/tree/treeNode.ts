
interface TreeNodeData{
    name:string;
    key?:string;
    closed:boolean;
    parentKey?:string;
    seqNo?:number;
    icon?:string;
    child?:TreeNodeData[]
}
// interface TreeNodeZit{
//     name:string;
//     key?:string;
//     closed:boolean;
//     parentKey?:string;
//     seqNo?:number;
//     icon?:string;
//     child:TreeNodeZit[]

// }
interface TreeFilter{
    ( data:TreeNodeData, ...args:any):boolean;
}
const defaultFilter:TreeFilter=function(data:TreeNodeData,name:string=''){
    if(data){
        name=name.toLowerCase().trim();
        return data.name!.indexOf(name)!=-1;
    }
    return true;
}

// function convertToZit(data:TreeNodeData):TreeNodeZit{
//     let zit:any=Object.assign({},data);
//     zit.child=[];
//     return zit;
// }

class TreeData {
    _root:TreeNodeData=null;
    filter:TreeFilter;
    map=new Map<String,TreeNodeData>();
    constructor(){
        
    }
    set root(data:TreeNodeData){
        this._root=data;
        let child:TreeNodeData[]=data.child;
        this.map.set(data.key,data);
        let iterator=function(k:TreeNodeData){
            this.map.put(k.key,k);
            let child:TreeNodeData[]=k.child;
            if(child!=null){
                child.forEach(item =>{
                    iterator(item);
                })
            }
        }
        if(child!=null){
            child.forEach( item=>{
                iterator(item);
            })
        }
    }
    get root(){
        return this._root;
    }
    initiData(treeList:TreeNodeData[]){

        
    }
}
   


