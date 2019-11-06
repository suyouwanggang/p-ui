#  主题  
`p-ui` 的组件均可设置`themeColor`,每个组件可以单独设置，也可以全局设置

```css
p-button{
    --themeColor:#42b98c3;/** 单独设置 **/
}

:root{
    --themeColor:#42b98c3;/** 全局设置 **/
}
```
也可以通过`JavaScript`实时修改。

```js
document.body.style.setProperty('--themeColor','#F44336');
```

除了主题颜色`themeColor`以外，还支持如下主题定制

```css
:root {
    --fontColor:#333; /*文字颜色*/
    --borderColor:#d9d9d9;/*边框颜色，按钮、输入框*/
    --borderRadius:3px;/*圆角*/
    --successColor:#52c41a;/*成功色*/
    --waringColor:#faad14;/*警告色*/
    --errorColor:#f4615c;/*错误色*/
    --infoColor:#1890ff;/*提示色*/
    --dangerColor:#ff7875/*危险色*/
}
```
<p-button type='primary'>primary</p-button>
<p-button type='flat'>flat</p-button>


<p-page-btn pagesize=10 total=68 ></p-page-btn>