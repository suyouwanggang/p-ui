
type TreeNodeData = {
    name?: string; /*节点名称*/
    key?: string | number; /* ID  */
    close?: boolean; /* 是否关闭 */
    seqNo?: number; /*同层序号*/
    icon?: string; /*节点图标 */
    child?: TreeNodeData[]; /*下级节点 */
    closeable?: boolean; /*false,表示节点不能折叠起来 */
    [key:string]:unknown; /*自定义属性 */
    _children?: TreeNodeData[]; //内部使用属性，过滤使用
    _parent?: TreeNodeData ; //上级属性，内部使用
}


/* 节点过滤器*/
interface TreeFilter {
    (data: TreeNodeData, ...arg: unknown[]): boolean;
}
const defaultFilter: TreeFilter = (data: TreeNodeData, name: string, ...args: unknown[]) => {

    if (name == null || name === undefined || name === '' || name.trim() === '') {
        return true;
    }
    if (data && data.name !== undefined) {
        name = name.toLowerCase().trim();
        return data.name.toLowerCase().indexOf(name) !== -1;
    }
    return false;
};

const filterTreeDataArray = (root: TreeNodeData, filter: TreeFilter, ...filterObject: unknown[]): TreeNodeData => {
    const map = new Map<TreeNodeData, Array<TreeNodeData>>();
    const setAddNode = new Set<TreeNodeData>();
    //key 为node, value:为下级满足的节点
    const parentMap = new Map<TreeNodeData, TreeNodeData>();
    parentMap.set(root, undefined);
    //key 为node, value:为父节点
    const iteratorFun = (node: TreeNodeData, parent: TreeNodeData) => {
        parentMap.set(node, parent);
        node._parent = parent; //设置上级
       // console.log(node.name);
        if (node !== root && (filter === null || filter.apply(null, [node, ...filterObject]))) {
            //console.log('match=='+node.name);
            let tempNode = node;
            while (tempNode&& !setAddNode.has(tempNode)) {
                setAddNode.add(tempNode  );
                //console.log('tempname=='+ tempNode.name);
                let matchSub = map.get(tempNode._parent);
                if (matchSub === undefined) {
                    matchSub = [];
                    map.set(tempNode._parent, matchSub);
                }
                matchSub.push(tempNode);
                tempNode = tempNode._parent;
            }
        }
        if (node.child) {
            node.child.forEach((item) => iteratorFun(item, node));
        }
    };
    root._children=null;
    iteratorFun(root, null);
    const iteratorMap = (node: TreeNodeData) => {
        const sub = map.get(node);
        if (sub !== undefined) {
            node._children = sub;
            sub.forEach( (item) => iteratorMap(item));
        } else {
            node._children = [];
        }
    };
    iteratorMap(root);
    return setAddNode.size === 0 ? null : root;
};



/**
 * 过滤树
 * @param root 根节点
 * @param filter 
 * @param args 
 */
const filterTreeData = (root: TreeNodeData, filter: TreeFilter, ...args: unknown[]): TreeNodeData => {
    if (filter == null) {
        return root;
    }
    const argArray = [root, filter, ...args];
    return filterTreeDataArray.apply(null, argArray);
}


/**
 * 将数组对象根据转化为 root 子节点，
 * @param nodeList 节点列表，通过节点key, 将其递归加入到root 节点孩子中
 * @param root 根节点
 * @returns 返回根节点
 */
const listTreeDataToRoot = (nodeList: TreeNodeData[], root: TreeNodeData = {}): TreeNodeData => {
    const map = new Map<string | number, Array<TreeNodeData>>();
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
        if (subChild) {
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
// tslint:disable-next-line: no-any
const toJSONTreeData = (data: TreeNodeData): any => {

    return JSON.stringify(data, (key: string,value:any) => {
        if (key.startsWith('_')) {
            return undefined;
        } else {
            return value;
        }
    });

};

export { TreeNodeData, TreeFilter, listTreeDataToRoot, filterTreeData, defaultFilter, findDataByKey, toJSONTreeData };