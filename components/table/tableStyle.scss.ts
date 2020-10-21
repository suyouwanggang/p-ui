import {css} from 'lit-element';
export default css`:host{display:flex;min-height:300px;--table-font-size:12px;font-size:var(--table-font-size);--table-border:1px solid #e8e8e8;--table-border-high:1px solid #ccc;--table-border-active:1px solid #aacbe1;--table-row:#fff;--table-row-odd:#fafafa;--table-head-bg-color:#f2f2f2}div[part=root-div]{flex:1;font-size:inherit;position:relative;display:block;background-color:transparent}div[part=scroll-div]{overflow:auto}div[part=scroll-div]::-webkit-scrollbar{width:14px}div[part=scroll-div]::-webkit-scrollbar-thumb{border-radius:5px;background-color:#e1e1e1;min-height:50px;border:2px solid transparent;background-clip:content-box}div[part=table-header-none]{width:100%;position:absolute;top:0;left:0;border-bottom:var(--table-border);background-color:var(--table-head-bg-color)}table{word-wrap:break-word;text-align:center;border:var(--table-border);border-right:0;border-spacing:0;box-sizing:border-box}table[part=fixd-thead-table]{position:absolute;top:0;left:0}table thead{background-color:var(--table-head-bg-color)}table thead tr:first th{border-top:0}table td:last-child,table th:last-child{border-right:0}table thead tr th{border-top:var(--table-border);border-right:var(--table-border);margin:0;padding:0}table thead tr th div.thWrap{line-height:18px;font-weight:normal;padding:6px;box-sizing:border-box}table thead tr th div.thWrap .thWrap-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}`; 