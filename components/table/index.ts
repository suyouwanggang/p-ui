import { customElement, html, internalProperty, LitElement, property, query } from 'lit-element';
import {  styleMap } from 'lit-html/directives/style-map';
import ResizeObserver from 'resize-observer-polyfill';
import watchProperty from '../../decorators/watchProperty';
import getStyleProperty from '../utils/styleUtils';
import { ColumnData, default as caculateColumnData, RowHeader } from './tableHelper';
import tableStyle from './tableStyle.scss';

/**
 * @part root_div  renderRoot 容器
 * @part scroll_div 滚动容器
 * 
 */
@customElement("p-table")
export default class PTable extends LitElement {
    static get styles() {
        return tableStyle;
    }

    @query("div[part=root_div]",true)
    root_div:HTMLDivElement;

    /**
     * 滚动DIV 
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
    @property({type:String,reflect:true,attribute:'table-width'})
    tableWidth:string; //支持css calc ( 支持的内容 )



     /**
     * table 
     */
  private __tableElement:HTMLTableElement;
   get  table(){
       if(this.__tableElement==undefined || this.__tableElement==null){
           this.__tableElement=this.renderRoot.querySelector('#tableID');
       }
    //    console.log(this.__tableElement);
       return this.__tableElement;
   }


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
    @watchProperty('changeColumnData', {attribute:false})
    columnData:ColumnData[];

    private changeColumnData(value:ColumnData[]){
        const {rows,tdRenderColumnData}=caculateColumnData(value);
        this.columnTheadData=rows;
        this.tdRenderColumnData=tdRenderColumnData;
    }
    /**
     * 表头真实数据，有多少行，每个th 有rowspan ,colspan
     */
    @property({attribute:false })
    columnTheadData:RowHeader;
    


    /**
     * 循环数据，输出tbody 的表头定义数组
     */
    @property({attribute:false })
    tdRenderColumnData:ColumnData[];



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
    
    /**
     * 固定左侧多少列，右侧多少列
     */
    private _fixedCol:Array<number>;

    @property({attribute:false,reflect:false})
    set fixedCol(leftOrArray:number|number[]){
        if(leftOrArray!=this._fixedCol){
            if(Array.isArray(leftOrArray)){
                this._fixedCol=leftOrArray.length>2? leftOrArray.slice(0,2):[...leftOrArray];
            }else{
                this._fixedCol=[leftOrArray];
            }
        }
       
        if(this._fixedStyleElement){
            this._fixedStyleElement.textContent='';
        }
        if(this.fixedCol!=null&&this.table&&this.table.rows.length>0){
            const div=this._scroll_div;
            const row0=this.table.rows[0];
            const rect=this.table.getBoundingClientRect();
            const tableRectLeft=rect.left;
            const tableRectRight=rect.right;

            let lastCell=row0.cells[row0.cells.length-1];
            let maxColSpan=lastCell.colSpan+ parseInt(lastCell.getAttribute('colIndex'),10);
            let leftIndex=this._fixedCol[0];
            if(leftIndex<0){
                leftIndex=maxColSpan+leftIndex;
            }
            const styleString=[];
            if(leftIndex>0){
               for(let i=0,j=leftIndex;i<j;i++){
                   const selector=`th[colIndex="${i}"],td[colIndex="${i}"]`;
                   let left=0;
                   if(i>0){
                       const td=div.querySelector(selector);
                       if(td!=null){
                           left=td.getBoundingClientRect().left-tableRectLeft;
                       }
                   }
                    styleString.push(`${selector}`,`{
                        position:sticky; left:${left}px;
                    }`);

               }
            }
            if(this._fixedCol.length>=2){
                let righColIndex=this._fixedCol[1];
                if(righColIndex<0){
                    righColIndex=maxColSpan+righColIndex;
                }
                for(let i=righColIndex,j=maxColSpan;i<j;i++){
                    const selector=`th[colIndex="${i}"],td[colIndex="${i}"]`;
                    let right=0;
                    const td=div.querySelector(selector);
                    if(td!=null){
                        right=td.getBoundingClientRect().right-tableRectRight;
                    }
                     styleString.push(`${selector} `, `{
                         position:sticky; right:${right}px;
                     }`);
                }
            }

            if(this._fixedStyleElement){
                this._fixedStyle=styleString.join('');
                this._fixedStyleElement.textContent=this._fixedStyle;
            }
        }
    }
    get fixedCol(){
        return this._fixedCol;
    }
    private __oldstyleElement:HTMLStyleElement;
    private get _fixedStyleElement(){
        if(this.__oldstyleElement===undefined ||this.__oldstyleElement===null){
           this.__oldstyleElement= this.renderRoot.querySelector('#styleID');
        }
        return this.__oldstyleElement;
    }
    private _fixedStyle:string='';
    set fixedStyle(style:string){
        this._fixedStyle=style;
        this._fixedStyleElement.textContent=style;
    }
    getFixedStyle(){
       return this._fixedStyle;
    }
    private  renderTHead(fixed:boolean=false){
        return html`<thead part='thead-${fixed?'fixed':'hidden'}'  >
            ${this.columnTheadData.map((itemRow:ColumnData[])=>
                 html`${this.renderTHeaderRow(itemRow,fixed)}`
            )}
        </thead>`;
    }
    private renderTHeaderRow(rowColumn:ColumnData[],fixed:boolean=false){
        return html`<tr .rowData=${rowColumn}>
            ${rowColumn.map( (col:ColumnData) =>
                html`${this.renderTh(col,fixed)}`
            )}
    </tr>`;
    }
   private  renderThSorting(colData:ColumnData){

    }
    
    private  renderThDrag(colData:ColumnData){

    }
    private renderTh(colData:ColumnData,fixed:boolean=false){
        const styleObj:any={ };
        if(!fixed){
            if(typeof colData.width =='number'){
                styleObj['width']=colData.width+'px';
                styleObj['min-width']=colData.width+'px';
                styleObj['max-width']=colData.width+'px';
            }else if(colData.width!=undefined &&"auto"!=colData.width){
                styleObj['width']=colData.width;
                styleObj['min-width']=colData.width;
                styleObj['max-width']=colData.width;
            }
            if(colData.minWidth!=undefined){
                let isNumber=typeof  colData.minWidth == 'number';
                styleObj['min-width']= isNumber? colData.minWidth+'px':colData.minWidth;
                if(colData.width==undefined){
                    styleObj['width']= isNumber? colData.minWidth+'px':colData.minWidth;
                }
            }

            if(colData.maxWidth!=undefined){
                styleObj['max-width']=colData.maxWidth;
            }
        }
        
       
        
        
        return html`<th colIndex=${colData._colIndex} .columnData=${colData}  style='${styleMap(styleObj)}' .align=${colData.agile?colData.agile:'center'}
            rowspan=${colData.rowspan==undefined?1:colData.rowspan}
            colspan=${colData.colspan==undefined?1:colData.colspan}
            >
            <div class='thWrap' part='colThDIV' >
               <div part='colThWrap'> ${colData.renderHeader? colData.renderHeader(colData):html`<div class='thWrap-text'>${colData.text}</div>`}</div>
                ${this.renderThSorting(colData)}
                ${this.renderThDrag(colData)}
            </div>
        </th>`;
    }
    /**
     * 渲染TBODY 
     * 循环对象data 调用 renderRowData 来生成TR
     */
    private renderTBodyData(){
        return html`<tbody>
            ${this.data?this.data.map( (item:any,index:number)=>{
               return  this.renderRowData(item,index);
            }):''}
        </tbody>`;

    }
    /**
     * 渲染一个TBODY TR , 循环 @method tdRenderColumnData 调用 @method renderRowTD 来渲染一个单元格
     * @param rowData data[index] 值
     * @param index  序号
     */
    renderRowData(rowData:any,index:number) {
       return html`<tr> ${this.tdRenderColumnData.map((c:ColumnData) =>{
            //console.log(rowData);
            const tdTemplate=this.renderRowTD(rowData,c,index);
            if(tdTemplate===undefined||tdTemplate===null){
                return html``;
            }else{
                return html`<td  colIndex=${c._colIndex}  .columnData=${c}  ><div >${tdTemplate}</div></td>`;
            }
        })}</tr>`;
    }
    /**
     * 渲染 TBODY TD ，如果返回为 undefined,null 则不渲染TD
     * @param rowData data [index]的值
     * @param col 表头 ColumnData
     * @param index  行序号
     */
    renderRowTD(rowData:any,col:ColumnData,index:number){
        if(col&&col.renderTd){
            return col.renderTd(rowData);
        }else{
            return html`${index+1} .${col.text}${col.text}${col.text}${col.text}${col.text}${col.text}`;
        }
    }
    @internalProperty()
    private _rectHead_width:number;

    @internalProperty()
    private _rectHead_height:number;

    
    private _resizeObserver:ResizeObserver;
 
    firstUpdated(changedProperties: Map<string | number | symbol, unknown>){
        super.firstUpdated(changedProperties);

        this._resizeObserver=new ResizeObserver((entrys =>{
            this.resize();
        }));
        this._resizeObserver.observe(this);
        this._resizeObserver.observe(this.table);
        this.resize();
        this.fixedCol=this._fixedCol;
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
        })
    }
   private  asynTableHeaderWidth(){
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
        super.disconnectedCallback();
    }
    @query("div[part=table-header-div]")
    private table_head_div:HTMLDivElement;

    @query("table[part=fixed-thead-table]")
    private fixedHeaderTable:HTMLTableElement;
    
   
    private handleScroll(){
        const div=this._scroll_div;
        this.table_head_div.scrollLeft=parseInt(div.scrollLeft.toFixed(0));
    }
    //  async _getUpdateComplete(){
    //     await  super._getUpdateComplete();
    //     await this.asynTableHeaderWidth();
    // }
    render() {
        const styleFixedObj:any={};
        const styleTableObj:any={};
        if(this._rectHead_width){
            styleFixedObj['width']=this._rectHead_width+'px';
            // styleTableObj['width']=this._rectHead_width+'px';
        }
        //styleTableObj['marginTop']=(0-this._rectHead_height)+'px';
        if(this.tableWidth){
            styleTableObj.width=`calc( ${this.tableWidth} )`;
        }
        return html`<div part="root-div" >
            <style id="styleID">${this.getFixedStyle()}</style>
            <div part='scroll-div' @scroll=${this.handleScroll} @mousewheel=${this.handleScroll}  style='${this.scroll_heightStyle!=undefined?`height: calc ( ${this.scroll_heightStyle} )`:'' };--table-header-height:${this._rectHead_height}px;' >
                    <table part="table" id="tableID"  style='${styleMap(styleTableObj)}'>
                        ${this.renderTHead(false)}
                        ${this.renderTBodyData()}
                    </table>
                
                <div part='table-header-div'  style='${this._rectHead_height!=undefined?`height:${this._rectHead_height}px;`:''}'>
                    <table part='fixed-thead-table' style='${styleMap(styleFixedObj)}'> ${this.renderTHead(true)}</table>
                 </div>
            </div>
        </div>`
    }
}

