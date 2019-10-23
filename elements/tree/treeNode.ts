interface TreeNodeData {
    name: string;
    key?: string|number|undefined;
    closed?: boolean;
    parentKey?:string|number|undefined;
    seqNo: number;
    icon?: string;
    child?: TreeNodeData[]|undefined;
}


interface TreeFilter {
    (data: TreeNodeData, ...args: []): boolean;
}
const defaultFilter: TreeFilter = function (data: TreeNodeData, name: string = '') {
    if (data) {
        name = name.toLowerCase().trim();
        return data.name!.toLowerCase().indexOf(name) !== -1;
    }
    return true;
}
const binaraySearch = function (searchArray: TreeNodeData[], searchElement: TreeNodeData) {
    let stop = searchArray.length;
    let last, p = 0, delta = 0;
    do {
        last = p;
        if (searchArray[p].seqNo > searchElement.seqNo) {
            stop = p + 1;
            p -= delta;
        } else if (searchArray[p].seqNo === searchElement.seqNo) {
            // FOUND A MATCH!
            return p;
        }
        delta = Math.floor((stop - p) / 2);
        p += delta; //if delta = 0, p is not modified and loop exits
    } while (last !== p);
    return -1;
};
const binarayAdd = function (searchArray: TreeNodeData[], searchElement: TreeNodeData) {
    const mid = binaraySearch(searchArray,searchElement);
    if ( mid === -1 || mid === searchArray.length-1 ) {
        searchArray.push(searchElement);
    } else {
        searchArray.splice(mid,0,searchElement);
    }
};

class TreeData {
    _root: TreeNodeData;
    keyNodeMap = new Map<String|number|undefined, TreeNodeData>();
    constructor() {
        this._root={
            name:'@root',
            parentKey:undefined,
            key:undefined,
            seqNo:0,
            closed:false
        };
        this.keyNodeMap.set(this.root.key, this._root);
    }
    set root(data: TreeNodeData) {
        if (data == null||data==undefined) {
            throw new Error('tree root should not be null or undefined ');
        }
        const tree = this;
        tree._root = data;
        tree.keyNodeMap.clear(); //清空所有节点
        tree.keyNodeMap.set(data.key, data);
        const child: TreeNodeData[]|undefined = data.child;
        if (child != null) {// only set root  会查找child ，看是否有下级节点，如果有，
            const iterator = function (k: TreeNodeData, parent: TreeNodeData) {
                k.parentKey = parent!.key;
                tree.keyNodeMap.set(k.key, k);
                const child: TreeNodeData[] = k.child;
                child!.forEach((item) => {
                    iterator(item, parent);
                });
            };
            child!.forEach((item) => {
                iterator(item, this._root);
            });
        }
    }
    get root() {
        return this._root;
    }
    /**
     * @param nodeList 添加节点到树中，根据parentKey, key 循环所有的节点，自动构建树数据。<br/>
     * 节点顺序同层次已 seqNo 为准，如果seqNo 为空，则seqNo 为添加的顺序号
     */
    initTreeNode(nodeList: TreeNodeData[]) {
        const tree = this;
        const nodeMap = new Map<string|number|null|undefined, TreeNodeData>();
        const parentChildMap = new Map<string|number|null|undefined, TreeNodeData[]>();
        nodeList.forEach((item,index) => {
            if (!item.key) {
                throw new Error('tree Node key should not null');
            }
            if(item.seqNo===undefined){
                item.seqNo=index;
            }
            nodeMap.set(item.key, item);
            const prarentKey = item.parentKey;
            let child: TreeNodeData[]|undefined = parentChildMap.get(prarentKey);
            if (child == null) {
                child = new Array();
                parentChildMap.set(prarentKey, child);
            }
            binarayAdd(child, item);
        });
        const iterator = function (k: TreeNodeData, parent: TreeNodeData) {
            k.parentKey = parent.key;
            tree.keyNodeMap.set(k.key, k);
            const child = parentChildMap.get(k.key);
            child!.forEach((item) => {
                 iterator(item, parent);
            });
        };
        const rootChild = parentChildMap.get(this._root.key);
        rootChild!.forEach((item) => {
            iterator(item, this._root);
        });
    }

    addTreeNode(node: TreeNodeData){
        const key = node.key;
        if ( key == null) {
            throw new Error(`node ${node.name} : key should not null and unique! `);
        }
       const parentKey = node.parentKey;
       const parent = this.keyNodeMap.get(parentKey);
        if ( parent == null) {
            throw new Error('node ${node.name} : parentNode doest not exist ! ');
        }
        const child = parent.child;
        if ( child != null) {
            binarayAdd(child! , node);
            this.keyNodeMap.set(key, node);
        }
    }

    getTreeNode(key: string|undefined|number): TreeNodeData|null {
        return this.keyNodeMap.get(key);
    }
    getChild(key: string |number|undefined, includeSub: boolean = false): TreeNodeData[]|null {
        const node = this.getTreeNode(key);
        if (node != null) {
            const result = new Array<TreeNodeData>();
            const iterator = function (k: TreeNodeData) {
                result.push(k);
                if ( includeSub ) {
                    k.child!.forEach( (item) => {
                        iterator(item);
                    } );
                }
            };
            node.child!.forEach( (item) => {
                iterator(item);
            } ) ;
            return result;
        }
        return null;
    }
    getParentNode(key: string|number|undefined): TreeNodeData {
        let node = this.getTreeNode(key);
        if (node != null) {
            node = this.getTreeNode(node.parentKey);
            return node;
        }
        return null;
    }
    /**
     * 
     * @param key 节点主键
     * @returns 返回删除的节点数据
     */
    removeChild(key: string|number|undefined): TreeNodeData {
        const tree = this;
        // if(key===this.root.key){
        //     throw new Error('sholud remove root node ');
        // }
        const node = this.getTreeNode(key);
        if (node != null) {
           const parent = this.getParentNode(key);
           const child = this.getChild(key, true);
           child.splice(0, 0, node);
           if ( parent && parent.child && parent.child.length > 0 ) {
               const index = parent.child.indexOf(node);
               if ( index >= 0) {
                   parent.child.splice(index, 1);
               }
           }
           child.forEach( (item) => {
               tree.keyNodeMap.delete(item.key);
           });
           return node;
        }
        return null;
    }
}
let testNode = {
    name:'root',
    key:'root',
    closed: false,
  
    seqNo: 0,
  
    child: [
        {
            name: 'root_01',
            key: 'root_01',
            closed: false,
            parentKey: 'root',
            seqNo: 0,
          
            child: [
               {
                    name: 'root_01_01',
                    closed: false,
                    seqNo: 0
                    
                }
            ]
        },
        {
            name: 'root_02',
            key: 'root_02',
            closed: false,
            parentKey: 'root',
            seqNo: 0
        }

    ]

}



export {TreeData, TreeNodeData, testNode,TreeFilter, defaultFilter,binaraySearch,binarayAdd};


