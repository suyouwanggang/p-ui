import { customElement ,LitElement, TemplateResult,property} from 'lit-element';
import PTable from '.';
import watch from '../../decorators/watch';
import watchProperty from '../../decorators/watchProperty';
import { SortingEnum, TdAgile } from './tableHelper';
const properConverter={
    fromAttribute:(value:string|null)=>{
        const n=Number(value);
        if(isNaN(n)){
            return value;
        }else{
            return n;
        }
    },
    toAttribute:(value:unknown) =>{
        return value;
    }
};

/**
 * 表格列定义
 */
@customElement("p-column")
export default class PColumn extends LitElement {
    /**
     * 自定义渲染表头 th
     */
    @watch('changeProperty')
    @property({attribute:false}) 
    renderTh :(this:PColumn,tab:PTable)=>TemplateResult|TemplateResult[]|null|undefined;

    /**
     * 自定义渲染 td
     */
    @watch('changeProperty')
    @property({attribute:false})
    renderTd :(this:PColumn,rowData:any, index:number,tab:PTable)=>TemplateResult|TemplateResult[]|{
        template:TemplateResult|TemplateResult[];
        colspan?:number;
        rowspan?:number;
    }|null|undefined;

    @watchProperty('changeProperty',{reflect:true,attribute:true})
    hidden:boolean;
     /**
     * 自定义渲染对象的属性，支持"."分隔取多重属性
     */
    @watchProperty('changeProperty',{reflect:true,attribute:true})
    prop:string;

    /**
     * 表头显示内容
     */
    
    @watchProperty('changeProperty',{reflect:true,attribute:true})
    text:string;

    /**
     * 表头Th 内容对齐方式，默认是居中对齐
     */
    @watchProperty('changeProperty',{reflect:true,attribute:true})
    agile?:TdAgile;
     /**
     * Td 内容对齐方式，默认同表头对齐方式
     */
    @watchProperty('changeProperty',{reflect:true,attribute:'td-agile'})
    tdAgile?:TdAgile;
    protected changeProperty(){
        const table=this.tableDom;
        if(table!=null){
            table.requestUpdate().then(()=>{
                table.asynTableHeaderWidth();
            })
        }
    }
     /**
     * 表头是否支持排序
     */
    @watchProperty('changeProperty',{type:Boolean,reflect:true,attribute:true})
    sortAble:boolean;//是否支持排序

     /**
     * 排序值
     */
    @watchProperty('changeProperty',{reflect:true, attribute:'sort'})
    sort:SortingEnum;//升序，降序

    /**
     * 是否可以拖动改变宽度
     */
    @watch('changeProperty')
    @property({type:Boolean,reflect:true,attribute:true})
    resizeAble:boolean;


    /**
     * 宽度
     */
    @watchProperty('changeProperty',{reflect:true,attribute:true,converter:properConverter} )
    width?:number|string=undefined;
    /**
     * 最小宽度
     */
    @watch('changeProperty')
    @property({type:Number, reflect:true,attribute:true,converter:properConverter})
    minWidth?:number;
    /**
     * 最大宽度
     */
    @watch('changeProperty')
    @property({type:Number,reflect:true,attribute:true,converter:properConverter})
    maxWidth?:number;


    /**
     * 占多少列
     */
    colspan?:number;
    /**
     * 多少行
     */
    rowspan?:number;
    /**
     * 是否是自动宽度
     */
    _isAuto?:boolean;
    /**
     * colIndex 序号
     */
    _colIndex?:number;
   

    protected createRenderRoot(): Element|ShadowRoot {
        return this;
    }
    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>){
        super.firstUpdated(_changedProperties);
    }
    /**
     * 缓存 子孩子
     */
    _childColumn:PColumn[];
    get childColumn():PColumn[]{
        this._childColumn= Array.from(this.children) .filter( (item:Element) =>{
            return item instanceof PColumn;
        }) as PColumn[];
        
        return this._childColumn;
    }

    get tableDom() :PTable{
        return this.closest('p-table');
    }


}

