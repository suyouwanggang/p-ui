import { ServerHttp2Session } from "http2";

 type TreeNodeData= {
    name?: string;/*节点名称*/
    key?: string | number ;/* ID  */
    close?: boolean;/* 是否关闭 */
    seqNo?: number;/*同层序号*/
    icon?: string;/*节点图标 */
    child?: TreeNodeData[];/*下级节点 */
    closeable?: boolean;/*false,表示节点不能折叠起来 */
    
}


/* 节点过滤器*/
 interface TreeFilter {
    (data: TreeNodeData, ...arg: unknown[]): boolean;
}
const defaultFilter: TreeFilter =  (data: TreeNodeData, name:string, ...args:unknown[])=> {
   
    if (name == null || name === undefined || name === ''||name.trim()==='' ) {
        return true;
    }
    if (data&&data.name!=undefined) {
        name = name.toLowerCase().trim();
        return data.name.toLowerCase().indexOf(name) !== -1;
    }
    return false;
};

 const filterTreeDataArray = (root:TreeNodeData,filter: TreeFilter,...filterObject:unknown[])=> {
        const map=new Map<TreeNodeData,Array<TreeNodeData>>();
        const map2=new Map<TreeNodeData,Set<TreeNodeData>>();
        //key 为node, value:为下级满足的节点

        const parentMap=new Map<TreeNodeData,TreeNodeData>();
        parentMap.set(root,undefined );
        //key 为node, value:为父节点
        const iteratorFun=(node:TreeNodeData,parent:TreeNodeData)=>{
            parentMap.set(node,parent);
            // console.log(node.name);
            if(node!=root &&filter.apply(null,[node, ...filterObject])){
                // console.log('match=='+node.name);
                let tempNode=node;
                let tempParentNode=parentMap.get(tempNode);
                labelWle: while(tempParentNode){
                    //console.log('tempname=='+ temp.name);
                    let set=map2.get(tempParentNode);
                    if(set==undefined){
                        set=new Set( );
                        map2.set(tempParentNode,set);
                    }
                    if(!set.has(tempNode)){
                        set.add(tempNode);
                        let matchSub=map.get(tempParentNode);
                        if(matchSub==undefined){
                            matchSub=[];
                            map.set(tempParentNode,matchSub);
                        }
                        matchSub.push(tempNode);
                        tempNode=tempParentNode;
                        tempParentNode=parentMap.get(tempParentNode);
                    }else{
                        break labelWle;
                    }
                }
            }
            if(node.child){
                node.child.forEach((item) =>iteratorFun(item,node));
            }
        }
       iteratorFun(root,null);
       const iteratorMap=(node:TreeNodeData) =>{
         const sub=map.get(node);
         if(sub!=undefined){
             node.child=sub;
             sub.forEach(item => iteratorMap(item));
         }else{
             node.child=[];
         }
       }
       iteratorMap(root);
       return root;
};



/**
 * 过滤树
 * @param root 根节点
 * @param filter 
 * @param args 
 */
  const filterTreeData = (root: TreeNodeData, filter: TreeFilter, ...args: unknown[]): TreeNodeData => {
    const cloneRoot: TreeNodeData = JSON.parse(JSON.stringify(root));
    if (filter == null) {
        return cloneRoot;
    }
    const iteratorNode=(node:TreeNodeData,node2:TreeNodeData) =>{
        Object.defineProperty(node,'_source',{
            configurable:false,
            writable:false,
            enumerable:false,
            value:node2
        });
        if(node.child){
            node.child.forEach((item,index)=>{
                iteratorNode(item,node2.child[index]);
            })
        }
    }
    iteratorNode(cloneRoot,root);
    const argArray=[cloneRoot,filter,...args];
    return filterTreeDataArray.apply(null,argArray);
}


/**
 * 将数组对象根据转化为 root 子节点，
 * @param nodeList 节点列表，通过节点key, 将其递归加入到root 节点孩子中
 * @param root 根节点
 * @returns 返回根节点
 */
  const listTreeDataToRoot = (nodeList: TreeNodeData[], root: TreeNodeData = {}): TreeNodeData => {
    const map = new Map<string | number , Array<TreeNodeData>>();
    nodeList.forEach((item: TreeNodeData) => {
        let sub = map.get(item.key);
        if (sub === undefined) {
            sub = new Array<TreeNodeData>();
            map.set(item.key, sub);
        }
        sub.push(item);
    });
    const iteratorFun = (key: string | number, data: TreeNodeData) => {
        const subChild = map.get(key);
        if(subChild){
            subChild.forEach((item: TreeNodeData) => {
                if (!data.child) {
                    data.child = [];
                }
                data.child.push(item);
                iteratorFun(item.key, item);
            });
        }
        
    };
    iteratorFun(root.key, root);
    return root;
};


const findDataByKey = function (data: TreeNodeData, key: string | number): TreeNodeData {
    if (data.key === key) {
        return data;
    } else {
        const child = data.child;
        if (child) {
            let found = null;
            for (let i = 0, j = child.length; i < j; i++) {
                found = findDataByKey(child[i], key);
                if (found) {
                    return found;
                }
            }
        }
    }
    return null;
};


export {TreeNodeData,TreeFilter, listTreeDataToRoot,filterTreeData,defaultFilter,findDataByKey};