import { customElement, html, LitElement, property, query } from 'lit-element';
import { ColumnData } from '../components/table/tableHelper';
import PTable from '../components/table/index';

@customElement('p-test-table')
export default class TestOne extends LitElement {
    constructor() {
        super();
        this.columnData=[
            {key:'title',text:'标题',agile:'center'},
            {key:'简介',text:'简介',agile:'center'},
            {key:'博文数据',text:'博文数据',agile:'center',children:[
                {key:'type',text:'博文分类'},
                {key:'activity',text:'博文互动',children:[
                    {text:'评论'},
                    {text:'点赞'},
                    {text:'阅读'}
                ]}

            ]},
            {key:'作者',text:'作者',agile:'left',children:[
                {text:'头像'},
                {text:'昵称'},
                {text:'gitHub'}
            ]},
            {key:'操作时间',text:'操作时间',agile:'right',children:[
                {text:'创建时间'},
                {text:'修改时间'}
                
            ]}
            
        ];
        const array=new Array<any>();
        for(let i=0;i<100;i++){
            array.push(i+1);
        }
        this.data=array;
    }
    @property({attribute:false})
     columnData:ColumnData[]=undefined;

     private data:any;

     @query("p-table",true)
     table :PTable;
    render(){
        return html`<p-table style='height:500px;' .columnData=${this.columnData} .data=${this.data}>

        </p-table>`;
    }
}
