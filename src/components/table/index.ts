import { customElement, html, internalProperty, LitElement, property, query } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import {  styleMap } from 'lit-html/directives/style-map';
import ResizeObserver from 'resize-observer-polyfill';
import watchProperty from '../../decorators/watchProperty';
import getStyleProperty from '../utils/styleUtils';
import caculateColumnData,{ clearColumnCacheData, findLastCanChangeWidth, getThCellByColumn, isColumnContainsColumn, isNumberWidth, RowHeader, SortingEnum } from './tableHelper';
import tableStyle from './tableStyle.scss';
import '../icon/index';
import { addEvent } from '../utils/eventHelper';
import watch from '../../decorators/watch';
import PColumn from './tableColumn';
import { customStyle } from '../../decorators/customStyle';
/**
 * 表格组件，支持列，表头固定
 * @part root_div  renderRoot 容器
 * @part scroll_div 滚动容器
 * @attribute table-striped 隔行变色
 * @attribute table-hover 鼠标移动 行高亮
 * @attribute table-sm 行高变小
 */
@customElement("p-table")
@customStyle()
export default class PTable extends LitElement {
    static get styles() {
        return tableStyle;
    }
    /**
     * @part "root_div" shadom root DIV
     */
    @query("div[part=root_div]",true)
    root_div:HTMLDivElement;

    /**
     *@part "scroll_div"  滚动DIV 
     */
    @query("div[part=scroll-div]",true)
    _scroll_div:HTMLDivElement;

    /**
     * 滚动容器高度，默认是100%, 支持类似 css calc "100% - 40px" 或者“ 100vh - 30px ”
     */
    @property({type:String})
    scroll_heightStyle:string; //支持css calc ( 支持的内容 )

     /**
     * table 容器宽度，默认是浏览器自适应
     */
    @watchProperty('onTableWidthChange',{type:String,reflect:true,attribute:'table-width'})
    tableWidth:string; //支持css calc ( 支持的内容 )
    protected onTableWidthChange(){
        const fixedCol=this.fixedCol;
        const table=this.table;
        if(fixedCol&&table){
            this.updateComplete.then(()=>{
                this.fixedCol=[...fixedCol];
            })
        }
    }


    @query("#tableID",true)
    table :HTMLTableElement;


    /**
     * table  heading
     */
    @query("thead[part=thead-hidden",true)
    thead:HTMLTableSectionElement;
    /** 
    * fixed  heading
    */
   @query("thead[part=thead-fixed",true)
   theadFixed:HTMLTableSectionElement;

    /**
     * 表头原始数据
     */
    @watch('changeColumnData')
    columnData:PColumn[];

    private changeColumnData(value:PColumn[]){
        const {rows,tdRenderColumnData}=caculateColumnData(value);
        this.theadRows=rows;
        this.rendersTdArray=tdRenderColumnData;
        this.updateComplete.then(()=>{
            this.fixedCol=[...this.fixedCol];
        })
       
    }
    /**
     * 表头真实数据，有多少行，每个th 有rowspan ,colspan
     */
    private theadRows:RowHeader;

    /**
     * 循环数据，输出tbody 的表头定义数组
     */
    private rendersTdArray:PColumn[];



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
    
    @property({attribute:false})
    private fixedCol:Array<number>;
    /**
     * 设置固定多少列，右侧多少列
     */
    onChangefixedCol(){
        if(!Array.isArray(this.fixedCol)){
            this.fixedCol=[this.fixedCol];
        }
        if(this.fixedCol.length>2){
            this.fixedCol=[this.fixedCol[0],this.fixedCol[1]];
        }
        if(this.table){
            const row0:HTMLTableRowElement=this.table.querySelector('tr');
            if(!row0){
                return ;
            }
            if(this.fixedStyleElement){
                this.fixedStyleElement.textContent='';
            }
            const div=this._scroll_div;
            const rect=this.table.getBoundingClientRect();
            const tableRectLeft=rect.left;
            const tableRectRight=rect.right;
            let lastCell=row0.cells[row0.cells.length-1];
            let maxColSpan=lastCell.colSpan+ parseInt(lastCell.getAttribute('colIndex'),10);
            let leftIndex=this.fixedCol[0];
            if(leftIndex<0){
                leftIndex=maxColSpan+leftIndex;
            }
            const styleString=[];
            if(leftIndex>0){
               for(let i=0,j=leftIndex;i<j;i++){
                   const selector=`th[colIndex="${i}"],td[colIndex="${i}"]`;
                   const selectorDom=`th[colIndex="${i}"][colspan="1"],td[colIndex="${i}"][colspan="1"]`;
                   let left=0;
                   if(i>0){
                       let td=div.querySelector(selectorDom);
                        if(td==null){
                            td=div.querySelector(selector);
                        }
                       if(td!=null){
                           left=td.getBoundingClientRect().left-tableRectLeft;
                       }
                   }
                    styleString.push(`${selector}`,`{
                        position:sticky;z-index:1; left:${left}px;
                    }`);

               }
            }
            if(this.fixedCol.length>=2){
                let righColIndex=this.fixedCol[1];
                if(righColIndex<0){
                    righColIndex=maxColSpan+righColIndex;
                }
                for(let i=righColIndex,j=maxColSpan;i<j;i++){
                    const selector=`th[colIndex="${i}"],td[colIndex="${i}"]`;
                    const selectorDom=`th[colIndex="${i}"][colspan="1"],td[colIndex="${i}"][colspan="1"]`;
                    let right=0;
                    let td=div.querySelector(selectorDom);
                    if(td==null){
                        td=div.querySelector(selector);
                    }
                    if(td!=null){
                        right=tableRectRight-td.getBoundingClientRect().right;
                    }
                     styleString.push(`${selector} `, `{
                         position:sticky;z-index:1; right:${right}px;
                     }`);
                }
            }
            this.fixedStyleString=styleString.join('');
            if(this.fixedStyleElement){
                this.fixedStyleElement.textContent=this.fixedStyleString;
            }
        }
    }
    @query("#styleID",true)
    private fixedStyleElement:HTMLStyleElement;
    private fixedStyleString:string;
    private  renderTHead(fixed:boolean=false){
        return html`<thead part='thead-${fixed?'fixed':'hidden'}' >
            ${this.theadRows!=undefined? 
                this.theadRows.map((itemRow:PColumn[])=>
                     this.renderTHeaderRow(itemRow,fixed)
                ):''}
            
        </thead>`;
    }
    private renderTHeaderRow(rowColumn:PColumn[],fixed:boolean=false){
        return html`<tr .rowData=${rowColumn}>
            ${rowColumn.map( (col:PColumn) =>
                this.renderTh(col,fixed)
            )}
    </tr>`;
    }
   private  renderThSorting(colData:PColumn){
       if(colData.sortAble){
        return html`<div class='sortAble' part='sortAble'>
            <p-icon class='up ${colData.sort===SortingEnum.ASC?'current':''}' path='M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z'></p-icon>
            <p-icon class='down ${colData.sort===SortingEnum.DESC?'current':''}' path='M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z'></p-icon>
        </div>`;
       }
       return null;
    }
    private dragThHandler(event:MouseEvent){
        event.preventDefault();
        const div=this._scroll_div;
        const element:HTMLDivElement=event.target as HTMLDivElement;
        const target:HTMLTableHeaderCellElement=element.closest('th,td');
        const col:PColumn =(target as any).columnData;
        const findCol=findLastCanChangeWidth(col);
        if(findCol==null){
            return ;
        }
        const findTh=getThCellByColumn(findCol);
        const {left,top}=div.getBoundingClientRect();
        const {right:thRight,top:thTop}=target.getBoundingClientRect();
        const helper=this.columnReiszeHepler;
        const position=thRight-left-2;
        const oldCursor=getStyleProperty(document.body,'cursor');
        let change=0;
        let x=event.clientX;
        // let color=getStyleProperty(target,'border-right-color');
        helper.style.cssText=`left:${position}px;display:block;top:${thTop-top}px;height:${div.clientHeight-(thTop-top)}px;`;
        let oldWidth= parseInt(getStyleProperty(findTh,'width').replace('px',''));
        let width=oldWidth;
        let addclass=false;
        //console.log(`width=${width}`);
       const moveObj= addEvent(document.body,'mousemove',(ev:MouseEvent)=>{
            ev.preventDefault();
            if(!addclass){
                target.classList.add('dragging');
                addclass=true;
            }
            const nX = ev.clientX;
            change=nX-x;//x 变大，右侧移动
            width=oldWidth+change;
            if(findCol.maxWidth!=undefined&& width>findCol.maxWidth){
                width=findCol.maxWidth;
                change=width-oldWidth;
            }else if(findCol.minWidth!=undefined&&width<findCol.minWidth){
                width=findCol.minWidth;
                change=width-oldWidth;
            }else if(width<20){
                width=20;
                change=width-oldWidth;
            }
            document.body.style.cursor='w-resize';
            let newPostion=change+position;
            // element.style.cssText=`pointer-events: none`;
            helper.style.left=newPostion+'px';
        });
        const upObj= addEvent(document.body,'mouseup',(ev:MouseEvent)=>{
            ev.preventDefault();
            helper.style.cssText='';
            target.classList.remove('dragging');
            document.body.style.cursor=oldCursor;
            moveObj.destory();
            upObj.destory();
            this.tableWidth= parseInt(getStyleProperty(this.table,'width'),10)+change+'px';
            findCol.width=width;
            this.updateComplete.then(()=>{
                this.asynTableHeaderWidth();
                this.onChangefixedCol();
            })
        });
    }
    private  renderThResizble(colData:PColumn){
        if(colData.resizeAble!=false){
            return html`<div  @mousedown=${this.dragThHandler} class='resize-col'></div>`;
        }
        return null;
    }

    private renderTh(colData:PColumn,fixed:boolean=false){
        const styleObj:any={ };
        if(!fixed&&colData.colspan==1){
            if(colData.width){
                const isNumber=isNumberWidth(colData.width);
                styleObj['width']=colData.width+(isNumber?'px':'');
                styleObj['min-width']=colData.width+(isNumber?'px':'');
                styleObj['max-width']=colData.width+(isNumber?'px':'');
            }
           
            if(colData.minWidth){
                const isNumber=isNumberWidth(colData.minWidth);
                styleObj['min-width']=colData.minWidth+(isNumber?'px':'');
                if(!colData.width){
                    styleObj['width']=colData.minWidth+(isNumber?'px':'');
                }
            }
            if(colData.maxWidth){
                const isNumber=isNumberWidth(colData.maxWidth);
                styleObj['max-width']=colData.maxWidth+(isNumber?'px':'');
            }
        }
        
        return html`<th draggable=${colData.canDrag!=false?'true':'false'}
           @dragend=${this.handlerDragColumn} @drop=${this.handlerDragColumn}
           @dragleave=${this.handlerDragColumn} @dragover=${this.handlerDragColumn}
            @dragstart=${this.handlerDragColumn} class='${colData.sortAble?'sortAble':''}' colIndex=${ifDefined(colData._colIndex)} .columnData=${colData}  style='${styleMap(styleObj)}' .align=${colData.agile?colData.agile:'center'}
            rowspan=${colData.rowspan==undefined?1:colData.rowspan}
            colspan=${colData.colspan==undefined?1:colData.colspan}
            >
            <div class='thWrap' part='colThWrap' >
                ${colData.renderTh? colData.renderTh.call(colData,this):html`<span class='thWrap-text'>${colData.text} </span>`}${this.renderThSorting(colData)}
            </div>
            ${this.renderThResizble(colData)}
        </th>`;
    }
    

    private _dragContext:{
        dragNode?:HTMLElement,
        dragColumn?:PColumn,
        isStart?:boolean,
        enterNode?:HTMLElement
    };
    /**
     * 处理表格列拖动
     * @param event 
     */
    private handlerDragColumn(event:DragEvent){
        const element=(event.target as HTMLElement ).closest('th,td') as HTMLElement;
        const column=(element as any).columnData as PColumn;
        const type=event.type;
        if(type=='dragstart'){
            // console.log('start ==');
            // console.log(column);
            // element.style.opacity='0.8px';
            element.classList.add('dragging');
           // event.dataTransfer.setData('text','');
           // event.dataTransfer.effectAllowed='move';
            this._dragContext={
                isStart:true,
                dragNode:element,
                dragColumn:column
            }
        }else if(type=='dragover'||type=='dragenter'&&this._dragContext ){
            if(this._dragContext ){
                // console.log('stdragleveaart dragenter==');
                event.preventDefault();
                if(element!=this._dragContext.dragNode  && !isColumnContainsColumn(this._dragContext.dragColumn,column)){
                    event.dataTransfer.dropEffect='move';
                }else{
                    event.dataTransfer.dropEffect='none';
                }
            }
            
        }else if(type=='drop'&&this._dragContext){
            if(!this._dragContext){
                return ;
            }
            // console.log('drop drop==');
            if(this._dragContext.dragNode!=element && !isColumnContainsColumn(this._dragContext.dragColumn,column)){
                event.preventDefault();
                // console.log('drop===',element);
                // console.log('drop===',column);
                if(this._dragContext.dragColumn.previousElementSibling===column){
                    column.parentElement.insertBefore(this._dragContext.dragColumn,column);
                }else{
                    const targetColumn=element.nextElementSibling;
                    const relColumn=targetColumn!=null? ((targetColumn as any).columnData as PColumn):null;
                    if(relColumn){
                        relColumn.parentElement.insertBefore(this._dragContext.dragColumn, relColumn);
                    }else{
                        try{
                            column.parentElement.appendChild(this._dragContext.dragColumn);
                        }catch(ex){
                            this._dragContext.dragColumn.parentElement.appendChild(this._dragContext.dragColumn);
                        }
                        
                    }
                }
                this.columnData=this.childCanShowColumn;
                this.updateComplete.then(()=>{this.resize()});
            }
        }else if(type=='dragend'&&this._dragContext){
            // console.log('dragend==');
            // this._dragContext.dragNode.style.opacity='';
            this._dragContext.dragNode.classList.remove('dragging');
            this._dragContext=undefined;
        }
        
    }
    /**
     * 渲染TBODY 
     * 循环对象data 调用 renderRowData 来生成TR
     */
    private renderTBodyData(){
        return html`<tbody>
            ${this.data?this.data.map( (item:any,index:number)=>
                 this.renderRowData(item,index)
            ):''}
        </tbody>`;
    }
    /**
     * 渲染一个TBODY TR , 循环 @method tdRenderColumnData 调用 @method renderRowTD 来渲染一个单元格
     * @param rowData data[index] 值
     * @param index  序号
     */
    renderRowData(rowData:any,index:number) {
        if(this.rendersTdArray!=undefined){
            return html`<tr .rowData=${rowData}> ${this.rendersTdArray.map((c:PColumn) =>{
                //console.log(rowData);
                const tdTemplate=this.renderRowTD(rowData,c,index);
                if(tdTemplate===undefined||tdTemplate===null){
                    return null;
                }else{
                    return html`<td prop=${ifDefined(c.prop)} align=${ifDefined(c.tdAgile)} colIndex=${ifDefined(c._colIndex)}  .columnData=${c}  ><div class='tdWrap' >${tdTemplate}</div></td>`;
                }
            })}</tr>`;
        }
        return null;
    }
    /**
     * 渲染 TBODY TD ，如果返回为 undefined,null 则不渲染TD
     * @param rowData data [index]的值
     * @param col 表头 ColumnData
     * @param index  行序号
     */
    renderRowTD(rowData:any,col:PColumn,index:number){
        if(col&&col.renderTd){
            return col.renderTd.call(col,rowData,index,this);
        }else{
            return html`${index+1} .${col.text}${col.text}${col.text}${col.text}${col.text}${col.text}`;
        }
    }
    @internalProperty()
    private _rectHead_width:number;

    @internalProperty()
    private _rectHead_height:number;

    
    private _resizeObserver:ResizeObserver;
    private _motationObserver:MutationObserver;
    
    get childCanShowColumn():PColumn[]{
        return Array.from(this.children) .filter( (item:Element) =>{
            return item instanceof PColumn&& !item.hidden;
        }) as PColumn[];
        
    }
    get childAllColumn():PColumn[]{
        return Array.from(this.children).filter( (item:Element) =>{
            return item instanceof PColumn;
        }) as PColumn[];
        
    }
    firstUpdated(changedProperties: Map<string | number | symbol, unknown>){
        super.firstUpdated(changedProperties);
        let calledFirst=false;
        this._motationObserver=new MutationObserver(()=>{
           calledFirst=true;
        //    console.log('_motationObserver_motationObserver');
           clearColumnCacheData(this.childAllColumn);
           this.columnData=this.childCanShowColumn;
        });
        this._motationObserver.observe(this,{
            childList:true,
            subtree:true,
            attributeFilter:['hidden']
        });
        if(!calledFirst){
            this.columnData=this.childCanShowColumn;
        }
        
        this._resizeObserver=new ResizeObserver(()=>{
            this.resize();
        });
        this._resizeObserver.observe(this);
        this._resizeObserver.observe(this.table);
        this.resize();
        // console.log('_motationObserver_motationObserver');
    }
    update(changedProperties: Map<string | number | symbol, unknown>){
        super.update(changedProperties);
        if(changedProperties.has('fixedCol')){
            this.onChangefixedCol();
        }
    }
    resize(){
        this.dispatchEvent(new CustomEvent('resize',{
            composed:true,
            bubbles:true
        }));
        this.asynTableHeaderWidth();
        this.handleScroll();
        const rect=this.thead.getBoundingClientRect();
        this._rectHead_height=parseInt(rect.height.toFixed(0));
        this._rectHead_width=parseInt(rect.width.toFixed(0));
        this.updateComplete.then(()=>{
            this.asynTableHeaderWidth();
            this.onChangefixedCol();
        })
    }
     asynTableHeaderWidth(){
        const tablecurrentWidth=this.table.offsetWidth;
        this.table_head_div.style.width=Math.min(parseInt(this._scroll_div.clientWidth.toFixed(0)),tablecurrentWidth)+'px';
        const thArray=this.thead.querySelectorAll('td,th');
        const thFixedArray=this.theadFixed.querySelectorAll('td,th');
        for(let i=0,j=thArray.length;i<j;i++){
            const d=(thArray[i]) as HTMLTableHeaderCellElement;
            const width=parseInt(getStyleProperty(d,'width'))+'px';
            (thFixedArray[i] as HTMLTableHeaderCellElement).style.width=width;
            (thFixedArray[i] as HTMLTableHeaderCellElement).style.minWidth=width;
            (thFixedArray[i] as HTMLTableHeaderCellElement).style.maxWidth=width;
            // d.style.width=width+'px';
        }
    }
    disconnectedCallback(){
        this._resizeObserver.unobserve(this);
        this._resizeObserver.unobserve(this.table);
        this._resizeObserver.disconnect();
        this._motationObserver.disconnect();
        super.disconnectedCallback();
    }
    @query("div[part=table-header-div]")
    private table_head_div:HTMLDivElement;

    @query("table[part=fixed-thead-table]")
    private fixedHeaderTable:HTMLTableElement;
    
    private _column_resize_helper:HTMLDivElement;
    get columnReiszeHepler(){
        if(this._column_resize_helper==undefined||this._column_resize_helper==null){
            this._column_resize_helper=this.renderRoot.querySelector('#column-reisze-helper');
        }
        return this._column_resize_helper;
    }
    private handleScroll(){
        const div=this._scroll_div;
        this.table_head_div.scrollLeft=parseInt(div.scrollLeft.toFixed(0));
    }
   
    render() {
        const styleFixedObj:any={};
        const styleTableObj:any={};
        if(this._rectHead_width){
            styleFixedObj['width']=this._rectHead_width+'px';
        }
        if(this.tableWidth){
            styleTableObj.width=`calc( ${this.tableWidth} )`;
        }
        return html`<div part="root-div" >
            <style id="styleID">${this.fixedStyleString}</style>
            <div part='scroll-div' @scroll=${this.handleScroll} @mousewheel=${this.handleScroll}  style='${this.scroll_heightStyle!=undefined?`height: calc ( ${this.scroll_heightStyle} )`:'' };--table-header-height:${this._rectHead_height}px;' >
                    <table part="table" id="tableID"  style='${styleMap(styleTableObj)}'>
                        ${this.renderTHead(false)}
                        ${this.renderTBodyData()}
                    </table>
                    <div part='table-header-div'  style='${this._rectHead_height!=undefined?`height:${this._rectHead_height}px;`:''}'>
                        <table part='fixed-thead-table' style='${styleMap(styleFixedObj)}'> ${this.renderTHead(true)}</table>
                    </div>
                    <div class='column-reisze-helper' id='column-reisze-helper' part='column-resize-helper'></div>
            </div>
        </div>`
    }

    /**
     * 获取 tbale 行 数据源
     * @param rowIndexOrChildElement  rowIndex ,或者是行所在dom 的子元素
     */
    public getRowData(rowIndexOrChildElement:number|Element):any{
        if(typeof rowIndexOrChildElement=='number'){
            const row=this.table.rows[rowIndexOrChildElement];
            return row!=null? (row as any).rowData :null;
        }
        const row=rowIndexOrChildElement.closest('tr');
        if(row&&row.parentElement && row.parentElement.tagName.toLocaleLowerCase()=='tbody'&&row.parentElement.parentElement===this.table){
            return (row as any).rowData;
        }else if(row&&row.parentElement){
            return this.getRowData(row.parentElement);
        }
        return null;
        
    }
    /**
     * 获取 td 对应的列模型
     * @param cellChildElement td,th 所在的子元素
     */
    public getCellColumn(cellChildElement:Element):PColumn{
        if(!cellChildElement){
            return null;
        }
        const th=cellChildElement.closest('th,td');
        if((th&&th.parentElement.parentElement==this.table) || (th&&th.parentElement.parentElement==this.fixedHeaderTable)){
            return (th as any).columnData as PColumn;
        }else if(th&&th.parentElement){
            return  this.getCellColumn(th.parentElement);
        }
        return null;

    }
}

