# p-ui

`p-ui`是一套使用原生`Web Components`规范开发的跨框架UI组件库,基于`lit-elment`库开发。
[github项目地址](https://github.com/suyouwanggang/p-ui)

## 特性
* 跨框架。无论是`react`、`vue`还是原生项目均可使用。
* 组件化,基于lit-element,lit-html 实现。`shadow dom`真正意义上实现了样式和功能的组件化。
* 纯原生，无需任何预处理器编译。
* 所有组件都支持主题颜色，大小定制，以后会有文档专门说明。
## 支持的组件
 ### `p-icon` 组件。基于ant design svg 图标组件 .
  1. `name` 图标名称
  2. 支持·`color`改颜色.
  3. `path` svg 可以通过svg 路径配置svg 图标 .
  4. `size` 大小
  
 ### `p-tips` 组件，类似 html title 属性，效果唯美。
  1. `dir` 配置tip 位置,支持 `top topleft topright ,bottom bottomleft bottomright left  lefttop leftbuttom  right righttop rightbottom auto位置 `
  2. `color` 配置tip 颜色
  3. `type`  内置风格 `success warning error`
  4. `show` 手动控制是否显示，默认`hover`显示
  5. `tips` 配置

 ###  `p-loading` 组件 ,svg 图标加载效果
   `color`,`font-size`控制颜色和字体大小

 ### `p-button` 组件，代替原始的button 组件,内置动画效果。
  1. `type` 内置风格`flat,primary,danger,dashed`
  2. `href` 则渲染为`a`标签，此时可以配置`target`,`rel`,`download`,
  3. `icon`  配置图标
  4. `checked` toogle 切换是否点击过
  5. `value`
  6. `loading` 效果
  7. `shape` 形状，`circle`,其他形状`to do`
  8. `block` 则为快级按钮
  9. `p-button-group` 按钮组支持，默认是横排风格,竖排`vertical`待实现，按钮组支持`change`事件
 ###  `p-switch` 组件 
  1. `name`,`value` 表单属性
  2. `checked` 选中
  3. `disabled` 效果
  4. `change`事件支持
   
 ### `p-checkbox` 组件，代替原始的checkbox 组件，显示效果各浏览器统一。
  1. `name`,`value` 表单属性
  2. `checked` 是否选中
  3. 内置验证，支持`required`,`errortips`配置自定义验证不通过提示可以通过`novalidate`关闭验证
  4. `change` 事件支持
  5. `disabled` 效果支持
  6. `readonly` 效果支持
 ###  `p-checkbox-group` 组件，`p-checkbox` 组支持
  1. 支持横排风格，`vertical` 则显示为竖排风格 .
  2. `change`事件支持.
  3. 内置 `min`,`max` 验证,`novilidate` 关闭验证
  4. `readonly`,`disabled`效果

 ### `p-radio` 组件，代替原始的radio 组件，显示效果各浏览器统一
  1. `name`,`value` 
  2. `disabled` 控制
  3. `checked` 控制选中
 
 ###  `p-radio-group` 组件 radio组  
  1. `name`,`value` 
  2. `disabled` 控制
  4. `change`事件
  5. 内置 `reqiure` 验证
 ###  `p-input` 输入组件  代替原始的input 组件
  1. `name`,`value` 属性支持
  2. `type`支持`input`,`number`,`password`,`email`,`url`,`search`
  3. `type`为`number`,可以通过`scale` 控制输入的小数的位数，例如2，则只能输入2位小数
  4. `clear`=true ,右侧图标能清空内容,`type` 为'password' 时，支持查看password 内容
  5. 左右支持配置icon，通过`leftIcon`,`rightIcon` 控制左右图标
  6. `input` 事件,支持`debounce` 防抖，`throttle`节流 
  7. `change`事件
  8. 内置 `required`,`min`,`max`,`minlength`,`maxlength` 验证
  9. 支持通过`validateObject`自定义验证,格式为 `interface { method(input:PInput):boolean ,tips?:string }`

 ### `p-rate` 评分组件
  1. `name`,`value` 表单属性支持
  2. `disabled` 效果
  3. `icon` 自定义评分图标
  4. `onColor`和`offColor` 配置得分，未得分颜色
  5. `hoverable` 效果，控制鼠标滑过，是否设置当前评分
  6. `size` 图标大小支持
  7. `number` 默认5分制，控制评分图标个数
  8. `tipStrings` 数组控制每一分提示，例如: ['terrible','bad','normal','good','wonderful'];
  9.  `change`事件
  
### `p-page-btn` 分页组件
  1. `name`,`value` 表单属性支持
  1. `pagesize`,`total` 控制分页大小和总数，`value` 为当前页数，默认为第一页
  2. `simple`和默认两种风格
  3. `change` 事件
  4. 键盘控制分页，`left`和`right` 支持
  5. `pagesize` 默认为20,可以调整
  6. `size` 图标大小支持
  7. `number` 默认5分制，控制评分图标个数
  8. `tipStrings` 数组控制每一分提示，例如: ['terrible','bad','normal','good','wonderful'];
  9.  `change`事件

## 兼容性

现代浏览器。

包括移动端，不支持`IE`。

> `IE`不支持原生`customElements`，[webcomponentsjs](https://github.com/webcomponents/webcomponentsjs)可以实现对`IE`的兼容，不过很多`CSS`特性仍然无效，暂时不考虑兼容IE11 及以下.
* 直接在`github`上获取最新文件。

目录如下：

```text
.
|___p-ui
    ├── elements //功能组件
    |   ├── p-icon
    |   ├── p-tips
    |   ├── p-input
    |   ├── p-checkbox
    |   ├── p-radio
    |   ├── p-button
    |   ├── p-switch
    |   ├── p-rate
    |   |—— p-tips
    |   |—— p-pagebtn
    |   |—— p-tab
    |   |—— p-tree
    |   └── ...
    └── iconfont //图标库
        └── icon.svg
```
     

将整个文件夹放入项目当中。

### html引用

```html
<script type="module">
    import './node_modules/p-ui/index.js'; //推荐
    //如需单独使用，文档中都是单独使用的情况，推荐全部引用，即第一种方式。
    import './node_modules/p-ui/components/p-button.js';
</script>
<xy-button>button</xy-button>
```

> 现代浏览器支持原生`import`语法，不过需要注意`script`的类型`type="module"`。

### js引用


```js
import 'p-ui';//推荐
//如需单独使用
import 'p-ui/elements/p-button.js';
let button=document.createElement('p-button');
button.loading=true;
```

> 关于`react`中使用`Web Components`的注意细节可参考[https://react.docschina.org/docs/web-components.html](https://react.docschina.org/docs/web-components.html)

### vue项目引用

与原生类似，没任何差别。

## 其他

大部分情况下，可以把组件当成普通的`html`标签，

比如给`<p-button>button</p-button>`添加事件，有以下几种方式

```html
<p-button onclick="alert(5)">button</p-button>
```

```js
btn.onclick = function(){
    alert(5)
}

btn.addEventListener('click',function(){
    alert(5)
})
```

> 自定义事件只能通过`addEventListener`绑定

比如元素的获取，完全符合`html`规则

```html
<p-tab>
    <p-tab-content label="tab1">tab1</p-tab-content>
    <p-tab-content label="tab2">tab2</p-tab-content>
    <p-tab-content label="tab3" id="tab3">tab3</p-tab-content>
</p-tab>
```

```js
const tab3 = document.getElementById('tab3');
tab3.parentNode;//p-tab
```

组件的布尔类型的属性也遵从原生规范（添加和移除属性），比如

```html
<p-tips show='true' ></p-tips> <!-- 显示，特例 -->
<p-button disabled>button</p-button> <!-- 禁用 -->
<p-button>button</p-button> <!-- 正常 -->
<p-button loading>button</p-button> <!-- 加载中 -->
<p-checkbox checked value='1'>button</p-checkbox> <!--选中 -->
```
