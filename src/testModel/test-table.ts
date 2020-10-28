import { customElement, html, LitElement, property, query } from 'lit-element';
import { ColumnData } from '../components/table/tableHelper';
import PTable from '../components/table/index';

@customElement('p-test-table')
export default class TestOne extends LitElement {
    constructor() {
        super();
        // this.columnData=[
        //     {key:'title',text:'标题',agile:'center',width:600},
        //     {key:'简介',text:'简介',agile:'center',width:400},
        //     {key:'博文数据',text:'博文数据',agile:'center',children:[
        //         {key:'type',text:'博文分类',width:100},
        //         {key:'activity',text:'博文互动',children:[
        //             {text:'评论',width:100},
        //             {text:'点赞',width:300},
        //             {text:'阅读',width:100}
        //         ]}

        //     ]},
        //     {key:'作者',text:'作者',agile:'left',children:[
        //         {text:'头像',width:100},
        //         {text:'昵称',width:100},
        //         {text:'gitHub',width:500}
        //     ]}
            
            
        // ];

        this.columnData=[
            {key:'title',text:'标题',agile:'center',width:200},
            {key:'简介',text:'简介',agile:'center',minWidth:300},
            {key:'作者',text:'作者',agile:'left',width:200},
            {key:'作者',text:'p-ui',agile:'left',width:'100%',minWidth:400},
            {key:'作者',text:'create',agile:'center',width:150}
            
            
            
        ];
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

    }
    disconnectedCallback() {
       
    }
    @property({attribute:false})
     columnData:ColumnData[]=undefined;

     private data:any;
     @query("p-table",true)
    table :PTable;
    render(){
        return html`<p-table style='height:500px;'  .columnData=${this.columnData} .data=${this.data}>
        </p-table>`;
    }
}
