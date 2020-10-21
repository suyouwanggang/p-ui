import { LitElement, html, css,customElement, query, property, TemplateResult } from 'lit-element';
import tableStyle from './tableStyle.scss';

enum Sorting{
    ASC, DESC
};
type ColumnData={
    [key:string]:any;//自定义属性
    renderHeader:(d:ColumnData )=>TemplateResult; //渲染th dom
    renderTd:(rowData:any,d:ColumnData) =>TemplateResult; //渲染 td dom
    key?:string;//属性
    text?:string;//标题
    width?:string;//列宽
    sortingAble?:boolean;//是否支持排序
    sorting?:Sorting;//升序，降序
    colspan?:number;//列多少
    rowspan?:number;//多少行
};
type RowHeader=Array<ColumnData[]>;

/**
 * @part root_div  renderRoot 容器
 * @part scroll_div 滚动容器
 * 
 */
@customElement("p-table")
class PTable extends LitElement {
    static get styles() {
        return tableStyle;
    }

    @query("#root_div",true)
    root_div:HTMLDivElement;

    /**
     * 滚动DIV 
     */
    @query("#scroll_div",true)
    scroll_div:HTMLDivElement;




    /**
     * 滚动容器高度，默认是100%, 支持类似 css calc "100% - 40px" 或者“ 100vh - 30px ”
     */
    @property({type:String})
    scroll_height="100%"; //支持css calc ( 支持的内容 )


     /**
     * table 
     */
    @query("#scroll_div",true)
    table:HTMLDivElement;

    /**
     * 表头数据
     */
    @property({attribute:false})
    columnsData:RowHeader;

     /**
     * 渲染数据
     */
    @property({attribute:false})
    data:Array<any>;

    /**
     * 是否显示加载
     */
    @property({attribute:false})
    loading=true;

    private  renderTHead(){
        return html`<thead>
            ${this.columnsData.map((itemRow:ColumnData[])=>
                 html`${this.renderTHeaderRow(itemRow)}`
            )}
        </thead>`;
    }
    private renderTHeaderRow(rowColumn:ColumnData[]){
        return html`<tr .rowData=${rowColumn}>
            ${rowColumn.map( (col:ColumnData) =>
                html`${this.renderTh(col)}`
            )}
    </tr>`;
    }
   private  renderThSorting(colData:ColumnData){

    }
    private  renderThDrag(colData:ColumnData){

    }
    renderTh(colData:ColumnData){
        return html`<th key=${colData.key} 
            rowspan=${colData.rowspan==undefined?1:colData.rowspan}
            colspan=${colData.colspan==undefined?1:colData.colspan}
            .column=${colData}>
            <div class='colTd'>
                ${colData.renderHeader? colData.renderHeader(colData):html`<div >${colData.text}</div>`}
                ${this.renderThSorting(colData)}
                ${this.renderThDrag(colData)}
            </div>
        </th>`;
    }


    render() {
        return html`<div part="root-div">
            <div part='table-header-none'><!-- --></div>
            <div part='scroll-div'>
                <table part="table"></table>
            </div>
        </div>`
    }
}
const getColSpan =(column:ColumnData)=>{
    if(column.children&&column.children.length>0){
        let size=0;
        column.children.forEach(c => {
            size+=getColSpan(c);
       });
       return size;
    }
    return 1;
}

const getTColumnHead=(columns:ColumnData[])=>{
    let maxLevel=0;
    const levelMap=new Map<ColumnData ,number>();//key column, value,level
    const parentMap=new Map<ColumnData ,ColumnData>();//key column, value:Parent ColumnData
    levelMap.set(undefined,0);
    
    const iteratorColumn=(column:ColumnData, childArray:ColumnData[]) =>{
       if(childArray&&childArray.length>0){
           const parentLevel=levelMap.get(column);
           if(parentLevel+1>maxLevel){
                maxLevel=parentLevel;
            }
           childArray.forEach(c => {
               levelMap.set(c,parentLevel+1);
           });
       } 
    }
    iteratorColumn(undefined,columns);
   


    

}
    