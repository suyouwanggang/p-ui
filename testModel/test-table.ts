import { customElement, html, LitElement, property, query } from 'lit-element';
import { ColumnData } from '../components/table/tableHelper';
import PTable from '../components/table/index';
import getStyleProperty from '../components/utils/styleUtils';

@customElement('p-test-table')
export default class TestOne extends LitElement {
    constructor() {
        super();
        this.columnData=[
            {key:'title',text:'标题',agile:'center',width:600},
            {key:'简介',text:'简介',agile:'center',width:400},
            {key:'博文数据',text:'博文数据',agile:'center',children:[
                {key:'type',text:'博文分类',width:100},
                {key:'activity',text:'博文互动',children:[
                    {text:'评论',width:100},
                    {text:'点赞',width:100},
                    {text:'阅读',width:100}
                ]}

            ]},
            {key:'作者',text:'作者',agile:'left',children:[
                {text:'头像',width:100},
                {text:'昵称',width:100},
                {text:'gitHub',width:200}
            ]}
            
            
        ];

        // this.columnData=[
        //     {key:'title',text:'标题',agile:'center',width:100},
        //     {key:'简介',text:'简介',agile:'center',width:200},
            
        //     {key:'作者',text:'作者',agile:'center',width:300,
        //      children:[
               
        //     ]}
            
            
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
        const table=this.table;
        let addWidth=10;
        let  width=200;
       this.timeoutID= window.setInterval(()=>{
           const col:ColumnData=table.tdRenderColumnData[0];
            width+=addWidth;
           // col.width=width+'px';
            table.requestUpdate().then(()=>{
            //     let tableWidth=parseInt(getStyleProperty(table.table,'width'));
            //     tableWidth+=addWidth;
            //    table.table.style.width=tableWidth+'px';
            })
       },3000)

    }
    disconnectedCallback() {
        if(this.timeoutID){
            window.clearInterval(this.timeoutID);
        }
    }
    @property({attribute:false})
     columnData:ColumnData[]=undefined;

     private data:any;

     @query("p-table",true)
     table :PTable;
    render(){
        return html`<p-table style='height:500px;'  .fixedCol=${2} .columnData=${this.columnData} .data=${this.data}>
        </p-table>`;
    }
}
