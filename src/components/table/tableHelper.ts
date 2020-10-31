import { TemplateResult } from 'lit-html';
import PTable from '.';
import PColumn from './tableColumn';

/**
 * 定义排序，升序，降序
 */
export enum SortingEnum {
    ASC = "ASC", DESC = "DESC"
};
/**
 * table 单元格对齐方式 'left','cener','right'
 */
export type TdAgile = 'left' | 'center' | 'right';
/**
 * 定义表头数据，同PColumn 对应
 */
export type ColumnHeaderData={
    /**
     * 自定义渲染th
     */
    renderTh? :(this:PColumn,tab:PTable) =>TemplateResult|TemplateResult[]|null|undefined;
    /**
     * 自定渲染 td 
     */
    renderTd? :(this:PColumn,rowData:any, index:number,tab:PTable)=>TemplateResult|TemplateResult[]|{
        template:TemplateResult|TemplateResult[];
        colspan?:number;
        rowspan?:number;
    }|null|undefined;
    /**
     * 是否隐藏
     */
    hidden?:boolean;
    /**
     * 自定义渲染对象的属性，支持"."分隔取多重属性
     */
    prop?:string;
    /**
     * 表头显示内容
     */
    text?:string;
    /**
     * 表头Th 内容对齐方式，默认是居中对齐
     */
    agile?:TdAgile;
    /**
     * Td 内容对齐方式，默认同表头对齐方式
     */
    tdAgile?:TdAgile;
    /**
     * 是否支持排序
     */
    sortAble?:boolean;
    /**
     * 排序值
     */
    sort?:SortingEnum;
    /**
     * 是否可以拖动改变宽度
     */
    resizeAble?:boolean;
    /**
     * 宽度
     */
    width?:number|string;

     /**
     * 最小宽度
     */
    minWidth?:number|string;
    /**
     * 最大宽度
     */
    maxWidth?:number|string;

    /**
     * 下级th ，支持多层次嵌套
     */
    children?:ColumnHeaderData[];

    /**
     * 其他自定义属性
     */
    [key:string]:unknown;


};
/**
 * 将columnHeaderData 转化为 table 的孩子 PColumn
 * @param columns
 * @param table 
 */
export const convertHeaderDataToTableColumns=(columns:ColumnHeaderData[],table:PTable)=>{
    const children=table.children;
    while(children.length>0){
        table.removeChild(children[0]);
    }
    const frag=document.createDocumentFragment();
    const iteratorData=(parent:ColumnHeaderData,childs:ColumnHeaderData[] ,parentDom:Element|DocumentFragment )=>{
        childs.forEach((item) =>{
            const col=new PColumn();
            parentDom.appendChild(col);
            for(const key in item){
                if(key!='children'){
                    (col as any)[key]=item[key];
                }else{
                    const subChildren=item['children'];
                    if(subChildren){
                       iteratorData(item,subChildren,col);
                    }
                }
            }
        })
    }
    iteratorData(null,columns,frag);
    table.appendChild(frag);
    // table.columnData=table.childColumn;
};
/**
 * 定义需要table 表头 行
 */
export type RowHeader = Array<Array<PColumn>>;

/**
 * 清除原来的 PColumn 缓存计算的一些属性;
 * @param columns 
 */
 export const clearColumnCacheData = (columns: PColumn[]) => {
    columns.forEach((item) => {
        const childColumn = [...item.childAllColumn];
        item._cacheCanShowColumn = undefined;
        item.colspan = undefined;
        item.rowspan = undefined;
        item._colIndex = undefined;
        clearColumnCacheData(childColumn);
    })
}
/**
 * 将表头排版布局，计算出 有多少行，每个单元格跨多少行，多少列，用于渲染表头，取colspan=4 的columnData来渲染tbody TD
 * @param columns 表头
 * @returns {   
 *   rows: 有多少个 TR 
     tdRenderColumnData:叶子TH， 用于渲染tbody
 * }
 */
 const caculateColumnData = (columns: PColumn[]): {rows: RowHeader, tdRenderColumnData: PColumn[] } => {
    
    //const colspanMap=new Map<ColumnData,number>();//每个th 跨多少列
    // const rowSpanMap=new Map<ColumnData,number>();//每个th 跨多少行
    const getColSpan = (column: PColumn) => {
        if(column.hidden){
            return 0;
        }
        if (column.colspan != undefined) {
            return column.colspan;
        }
        const childColumn = column.childCanShowColumn;
        if (childColumn && childColumn.length > 0) {
            let size = 0;
            childColumn.forEach((c: PColumn) => {
                size += getColSpan(c);
            });
            column.colspan = size;
            return size;
        }
        column.colspan = 1;
        return 1;
    }
    const canShowColumns=columns;
    let maxLevel = 0;
    const levelMap = new Map<PColumn, number>();//key column, value,level
    levelMap.set(undefined, 0);
    const iteratorColumn = (column: PColumn, childArray: PColumn[]) => {
        if (childArray && childArray.length > 0) {
            const parentLevel = levelMap.get(column);
            for(let i=0,j=childArray.length;i<j;i++){
                let c=childArray[i];
                c._isAuto = c.width == undefined || c.width === 'auto';
                levelMap.set(c, parentLevel + 1);
                if (parentLevel + 1 > maxLevel) {
                    maxLevel = parentLevel + 1;
                }
                getColSpan(c);
                const childColumn = c.childCanShowColumn;
                if (childColumn && childColumn.length > 0) {
                    iteratorColumn(c, childColumn);
                }
            }
        }
    }
    iteratorColumn(undefined, canShowColumns);
    const iteratorForColIndex = (startColIndex: number, childArray: PColumn[]) => {
        if (childArray && childArray.length > 0) {
            let colIndex = startColIndex;
            for(let i=0,j=childArray.length;i<j;i++){
                let c=childArray[i];
                if(!c.hidden){
                    c._colIndex = colIndex;
                    colIndex += getColSpan(c);
                }
            }
            for(let i=0,j=childArray.length;i<j;i++){
                let c=childArray[i];
                const childColumn = c.childCanShowColumn;
                if (childColumn && childColumn.length > 0) {
                    iteratorForColIndex(c._colIndex, c.childCanShowColumn)
                }
            }
        }
    }
    iteratorForColIndex(0, canShowColumns);

    //console.log(maxLevel);
    const rows: RowHeader = [];
    for (let i = 0, j = maxLevel; i < j; i++) {
        rows.push([]);
    }
    const renderThArray: PColumn[] = [];
    const iteratorColumnForRow = (col: PColumn) => {
        const level = levelMap.get(col);
        const rowThead = rows[level - 1];
        rowThead.push(col);
        const childColumn = col.childCanShowColumn;
        if (childColumn && childColumn.length > 0) {
            col.rowspan = 1;
            childColumn.forEach((item: PColumn) => iteratorColumnForRow(item));
        } else {
            const rowspan = maxLevel - level + 1;
            col.rowspan = rowspan;
            renderThArray.push(col);
        }
    };
    canShowColumns.forEach((col: PColumn) => {
        iteratorColumnForRow(col);
    });


    return {
        rows: rows,//有多少行
        tdRenderColumnData: renderThArray,//叶子单元格

    }

}
/**
 * 查找PColumn 最底层最后一个能够拖动的PColumn
 * @param column 
 */
export const findLastCanChangeWidth=(column:PColumn) :PColumn=>{
    const subColumns=column.childCanShowColumn;
    if(subColumns.length==0){
        return column;
    }else{
        return findLastCanChangeWidth(subColumns[subColumns.length-1]);
    }
}
/**
 * 查找PColumn 对应的th
 * @param column 
 *  
 */
export const getThCellByColumn=(column:PColumn): HTMLTableHeaderCellElement=>{
    const table=column.tableDom;
    const array=table.thead.querySelectorAll('th,td') ;
    const result= Array.from(array).find( (item:Element) =>
          ( item as any).columnData==column
    )
    return result as HTMLTableHeaderCellElement;
}
export const isNumberWidth =(col:Number|string)=>{
    return typeof col =='number'|| !isNaN(Number(col));
}
export default caculateColumnData;


