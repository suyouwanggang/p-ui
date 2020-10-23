import { customElement, html, internalProperty, LitElement, property, query } from 'lit-element';
import tableStyle from './tableStyle.scss';
import {RowHeader,ColumnData, default as caculateColumnData}   from './tableHelper';
import watchProperty from '../../decorators/watchProperty';
import ResizeObserver from 'resize-observer-polyfill';

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
    scroll_heightStyle:string; //支持css calc ( 支持的内容 )


     /**
     * table 
     */
    @query("#table",true)
    table:HTMLTableElement;


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
        const styleObj={

        };
        
        return html`<th .columnData=${colData}  
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
                return html`<td .columnData=${c}  ><div style='${c.width?`width:${c.width}`:''};${c.minWidth?`min-width:${c.minWidth}`:''} ;${c.maxWidth?`max-width:${c.maxWidth}`:'' }'>${tdTemplate}</div></td>`;
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
    }
    resize(){
        const rect=this.thead.getBoundingClientRect();
        this._rectHead_height=rect.height;
        this._rectHead_width=rect.width;
       
       
       
        this.dispatchEvent(new CustomEvent('resize',{
            composed:true,
            bubbles:true
        }))
    }
    disconnectedCallback(){
        this._resizeObserver.unobserve(this);
        this._resizeObserver.unobserve(this.table);
        this._resizeObserver.disconnect();
        super.disconnectedCallback();
    }
    @query("div[part=table-header-none]")
    private table_head_none:HTMLDivElement;
    render() {
        return html`<div part="root-div" style='${this._rectHead_height!=undefined?`padding-top:${this._rectHead_height}px;`:''}'>
            <div part='table-header-none'  style='${this._rectHead_height!=undefined?`height:${this._rectHead_height}px;`:''}'><!-- --></div>
            <div part='scroll-div' style='${this.scroll_heightStyle!=undefined?`height: calc ( ${this.scroll_heightStyle} )`:'' };--table-header-height:${this._rectHead_height}px;' >
                <table part="table" id="table" part="table"  style='${this._rectHead_height!=undefined?`margin-top:${0-this._rectHead_height}px;`:''}'>
                    ${this.renderTHead(false)}
                    ${this.renderTBodyData()}
                </table>
                <table part='fixd-thead-table' style='${this._rectHead_width!=undefined?`width:${this._rectHead_width}px`:''}'> ${this.renderTHead(true)}</table>
            </div>
        </div>`
    }
}

