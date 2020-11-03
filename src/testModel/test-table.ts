import { customElement, html, LitElement, property, query } from 'lit-element';
import { ColumnHeaderData, convertHeaderDataToTableColumns, SortingEnum } from '../components/table/tableHelper';
import PTable from '../components/table/index';
import PColumn from '../components/table/tableColumn';
import  orgData from './orginData';
import { OrganiazationNodeType } from '../components/organization-chart';
@customElement('p-test-table')
export default class TestOne extends LitElement {
    createRenderRoot(){
        return this;
    }
    constructor() {
        super();
        const renderTd=function(this:PColumn,rowData:any,index:number,tab:PTable){
            return html`<div >${this.text+index}</div>`;
        }
        const renderTH=function(this:PColumn,tab:PTable){
            return html`<div  class='red' style='display:inline-block;'>${this.text} ${this.width}</div>`;
        }
        this.columnData=[
            {prop:'title',text:'标题',agile:'center',sortAble:true,width:200,resizeAble:true,renderTd:renderTd,renderTh:function(tab){
                return renderTH.call(this,tab);
            }},
            {prop:'简介',text:'简介',agile:'center',width:100,sort:SortingEnum.ASC,sortAble:true,renderTd:renderTd,renderTh:function(tab){
                return renderTH.call(this,tab);
            }},
            {prop:'博文数据',text:'博文数据',agile:'center',children:[
                {prop:'type',text:'博文分类',width:90,renderTd:renderTd,sortAble:true},
                {prop:'activity',text:'博文互动',children:[
                    
                    {text:'点赞',width:90,tdAgile:'center',renderTd:(rowData,index,table)=>{
                        return html`<span>${(200*Math.random()).toFixed(0)}</span>`;
                    }},
                    {text:'阅读',width:100,hidden:true, agile:'right',sortAble:true,sort:SortingEnum.ASC, tdAgile:'right',renderTh:function(tab){
                        return renderTH.call(this,tab);
                    },renderTd:(rowData,index,table)=>{
                        return html`<span>${(300*Math.random()).toFixed(0)}</span>`;
                    }},
                    {text:'评论',width:80,tdAgile:'center',maxWidth:200,minWidth:72,renderTh:function(tab){
                        return renderTH.call(this,tab);
                    },
                    sort:SortingEnum.DESC,sortAble:true,resizeAble:true,
                    renderTd:(rowData,index,table)=>{
                        return html`<span class='red'>${(100*Math.random()).toFixed(0)}</span>`;
                    }},
                ]}

            ]},
            {prop:'作者',text:'作者',agile:'left',children:[
                {text:'头像',width:90,renderTd:renderTd,prop:'头像'},
                {text:'昵称',width:90,renderTd:renderTd,prop:'昵称'},
                {text:'gitHub',width:90,renderTd:renderTd,prop:'github'}
            ]}
        ];

        // this.columnData=[
        //     {key:'title',text:'标题',agile:'center',width:200,renderTd:renderTd},
        //     {key:'简介',text:'简介',agile:'center',width:300,renderTd:renderTd},
        //     {key:'作者',text:'作者',agile:'left',width:200,renderTd:renderTd},
        //     {key:'作者',text:'p-ui',agile:'left',width:'100%',minWidth:200,renderTd:renderTd},
        //     {key:'作者',text:'create',agile:'center',width:150,renderTd:renderTd}
        // ];
        const array=new Array<any>();
        for(let i=0;i<100;i++){
            array.push(i+1);
        }
        this.data=array;
       
    }
    timeoutID:number;
    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>){
        super.firstUpdated(_changedProperties);
        (globalThis as any).table=this.table;
        convertHeaderDataToTableColumns(this.columnData,this.table);
    }
    disconnectedCallback() {
       
    }
    @property({attribute:false})
    columnData:ColumnHeaderData[]=undefined;

     private data:any;
     @query("p-table",true)
    table :PTable;
    render(){
        
        return html`
            <p-org-chart 

            .customStyle=${`
                // .p-person{
                //     --org-chart-role-bg-color:#e9286f;
                // }
            `}  .data=${orgData} ></p-org-chart>  
            <p-table style='height:500px;' .customStyle=${`
            .red{
                color:red;
                font-weight:bold;
            }
        `}  .fixedCol=${[1,-1]}  table-hover .data=${this.data}>
        </p-table>`;
    }
}
