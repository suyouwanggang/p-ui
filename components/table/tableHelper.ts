import { customElement, html, LitElement, property, query, TemplateResult } from 'lit-element';
import tableStyle from './tableStyle.scss';
/**
 * 定义排序，升序，降序
 */
export enum Sorting{
    ASC="ASC", DESC="DESC"
};
export type TdAgile='left'|'center'|'right';
/**
 *定义表头
 */
export type ColumnData={
    [key:string]:any;//自定义属性
    /**
     * //渲染th dom
     */
    renderTh?:(d:ColumnData)=>TemplateResult|TemplateResult[]|null|undefined; 
    /**
     * //渲染 td dom
     */
    renderTd?:(rowData:any) =>TemplateResult|TemplateResult[]|null|undefined;
     
    /**
     * //数据源属性,支持按照"."分割
     */
    key?:string;
    /**
     * 标题
     */
    text?:string;
    /**
     * 表头对齐方式
     */
    agile?:TdAgile;
    /**
     * tbody td 对齐方式
     */
    tdAgile?:TdAgile;
   
    /**
     * 表头列宽
     */
    width?:string;//列宽
    /**
     * 表头是否支持排序
     */
    sortingAble?:boolean;//是否支持排序
    /**
     *是否支持列固定
     *  程序内部使用，通过leftfixdColumns,rightfixedColumns 来改变和设置 
     */
    fixed?:true|undefined;
    /**
     * 排序值
     */
    sorting?:Sorting;//升序，降序
    
    /**
     * 子 表头
     */
    children?:Array<ColumnData>;//子单元格

    colspan?:number;//列多少
    rowspan?:number;//多少行
};
/**
 * 定义需要table 表头 行
 */
export type RowHeader=Array<Array<ColumnData>>;


/**
 * 将表头排版布局，计算出 有多少行，每个单元格跨多少列，用于设置渲染表头，渲染tbody TD
 * @param columns 表头
 * @returns {   
 *   rows: 有多少个 TR 
    tdRenderColumnData:叶子TH， 用于渲染tbody
 * }
 */
const  caculateColumnData=(columns:ColumnData[])=>{
    //const colspanMap=new Map<ColumnData,number>();//每个th 跨多少列
   // const rowSpanMap=new Map<ColumnData,number>();//每个th 跨多少行
    const getColSpan =(column:ColumnData)=>{
        if(column.colspan!=undefined){
            return column.colspan;
        }
        if(column.children&&column.children.length>0){
            let size=0;
            column.children.forEach((c:ColumnData) => {
                size+=getColSpan(c);
           });
           column.colspan=size;
           return size;
        }
        column.colspan=1;
        return 1;
    }
    let maxLevel=0;
    const levelMap=new Map<ColumnData ,number>();//key column, value,level
    levelMap.set(undefined,0);
    const iteratorColumn=(column:ColumnData, childArray:ColumnData[]) =>{
       if(childArray&&childArray.length>0){
           const parentLevel=levelMap.get(column);
           childArray.forEach((c:ColumnData) => {
               levelMap.set(c,parentLevel+1);
               if(parentLevel+1>maxLevel){
                     maxLevel=parentLevel+1;
                }
               getColSpan(c);
               if(c.children&&c.children.length>0){
                   iteratorColumn(c,c.children);
               }
           });
       } 
    }
   
    iteratorColumn(undefined,columns);
    //console.log(maxLevel);
    const rows:RowHeader=[];
    for(let i=0,j=maxLevel;i<j;i++){
        rows.push([]);
    }
    const renderThArray:ColumnData[]=[];
    const iteratorColumnForRow= (col:ColumnData) =>{
        const level=levelMap.get(col);
        const rowThead=rows[level-1];
        rowThead.push(col);
        if(col.children&&col.children.length>0){
           col.rowspan=1;
           col.children.forEach( (item:ColumnData)=> iteratorColumnForRow(item) );
        }else{
            const rowspan=maxLevel-level+1;
            col.rowspan=rowspan;
            renderThArray.push(col);
        }
    };
    columns.forEach((col:ColumnData) =>{
        iteratorColumnForRow(col);
    });

    console.log(columns);
    return {
        rows:rows,//有多少行
        tdRenderColumnData:renderThArray,//叶子单元格
       
    }

}

export default caculateColumnData;

 