import { customElement, html, LitElement,css, property, query, PropertyValues } from 'lit-element';
import '../components/tree/index'
import { PTree, PTreeNode, TreeNodeRender } from '../components/tree/index';
import { TreeNodeData } from '../components/tree/treeFillter';
@customElement('p-test-tree')
export default class Test_Tree extends LitElement {
    
    static get styles() {
        return css`
            .root{
                display:flex;
                margin:20px;
            }
            .left ,.right{
                margin:10px;
                flex:1;
                height:500px;
                display:flex;
            }
            .flexTree{
                height:100%;
                width:100%;
                box-sizing:border-box;
                display:flex;
                flex-direction:column;
            }
            .tree{
                flex:1;
            }
        `
    }
    constructor() {
      super();
    }
    firstUpdated(changeProperityMap:PropertyValues){
        super.firstUpdated(changeProperityMap);
        fetch("/test.json").then((response) =>{
            return response.json();
        }).then((json:any) =>{
            const root={'name':'地图',child:json,close:false};
            for(let i=0,j=root.child.length;i<200;i++ ){
                let n=i%j;
                root.child.push(JSON.parse(JSON.stringify(root.child[n])));
            }
            root.child.forEach((d:TreeNodeData)=> {
                d.close=false;
            });
            this.tree.data=root;
        })
    }
    @query("#p-tree")
   private tree:PTree;
    renderLeftTree(){
       
        const array=Array.from({length:20});
        return html`
            <p-tree includestartnode  >
               ${array.map((obj,i)=>
                    html` <p-tree-node name="test_01"  icon="search" >
                    <p-tree-node name="test_01" icon="lock"  >
                      </p-tree-node>
                </p-tree-node>
                <p-tree-node name="test _02" icon="search">
                  <p-tree-node name="test_02_01" icon="lock" >
                    <span slot="node_name" icon="lock">我爱郑敏</span>
                  </p-tree-node>
                  <p-tree-node name="test_02_02${i+''+Math.random()}" icon="search" >
                  <p-tree-node name="test_02_01" icon="lock" >
                    <p-tree-node name="test_02_01" icon="lock" >
                    <p-tree-node name="test_02_01" icon="lock" >
                    <p-tree-node name="test_02_01" icon="lock" >
                    <p-tree-node name="test_02_01" icon="lock" >
                    <p-tree-node name="test_02_01" icon="lock" >
                       
                       </p-tree-node>
                       </p-tree-node>
                       </p-tree-node>
                       </p-tree-node>
                    </p-tree-node>
                  </p-tree-node>
                  </p-tree-node>
                  <p-tree-node name="test_01" icon="search" >
                  </p-tree-node>
                  <p-tree-node name="test_01" icon="search"></p-tree-node>
                </p-tree-node>`
               )}
            </p-tree>
        `;
    }
    static index=0;
    renderRight(){
        const renderNode:TreeNodeRender=( t:PTreeNode)=>{
            return html`<span>${t.name}</span>`;
        }

        return html`
        <div class='flexTree' style='max-height:500px;'>
            <p-input type='text' debounce=500 @input="${(event:Event) =>{
                this.tree.filterString=(event.target as HTMLInputElement).value;
            }}"></p-input>
        <p-tree lazy id="p-tree" .batchSize=${10} class='tree' .nodeRender=${renderNode} includestartnode style='overflow: auto;' > 
            <div slot='empty'>没有匹配的节点</div>
    </p-tree>
        </div>
        `;
    }
    render(){
        return html`<p-row column='12' grap='10'>  
            <p-col style='max-height:500px;overflow:auto;' span='6'>${this.renderLeftTree()}</p-col>
            <p-col  .span=${6} >${this.renderRight()} </p-col>
    </p-row>`;
       
    }
}
