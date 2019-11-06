# p-ui

[![NPM version](https://img.shields.io/npm/v/xy-ui.svg?color=red)](https://www.npmjs.com/package/xy-ui)
![npm](https://img.shields.io/npm/dw/xy-ui)
![npm](https://img.shields.io/npm/dt/xy-ui)
[![GitHub stars](https://img.shields.io/github/stars/XboxYan/xy-ui.svg?color=#42b983)](https://github.com/XboxYan/xy-ui/stargazers)
[![GitHub stars](https://img.shields.io/github/forks/XboxYan/xy-ui.svg)](https://github.com/XboxYan/xy-ui/network/members)

`p-ui`是一套使用原生`Web Components`规范开发的跨框架UI组件库。[查看文档](http://localhost:3000)

[github项目地址](https://github.com/suyouwanggang/p-ui)

## 文档

该文档基于[docsify](https://docsify.js.org/)动态创建，文中所有组件均为可交互实例。

现集成[gitalk](https://gitalk.github.io/)评论系统，有相关问题可在下方评论区留言。

## 特性

* 跨框架。无论是`react`、`vue`还是原生项目均可使用。
* 组件化。`shadow dom`真正意义上实现了样式和功能的组件化。
* 类原生。一个组件就像使用一个`div`标签一样。
* 无依赖。纯原生，无需任何预处理器编译。
* 无障碍。支持键盘访问。

## 兼容性

现代浏览器。

包括移动端，不支持`IE`。

> `IE`不支持原生`customElements`，[webcomponentsjs](https://github.com/webcomponents/webcomponentsjs)可以实现对`IE`的兼容，不过很多`CSS`特性仍然无效，所以放弃

## 安装

* npm

```shell
npm i p-ui
```

* cdn

```html
<script type="module">
    import 'https://unpkg.com/p-ui';

    import 'https://unpkg.com/p-ui@1.0.0';//指定版本号
</script>

<!--or-->

<script type="module" src="https://unpkg.com/p-ui"></script>
```

* 直接在`github`上获取最新文件。

目录如下：

```text
.
|___p-ui
    ├── elements //功能组件
    |   ├── p-icon.js
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

### react项目引用

```js
import 'p-ui';//推荐
//如需单独使用
import 'p-ui/elements/p-button.js';
ReactDOM.render(<p-button>button</p-button>, document.body);
```

[demo](https://codepen.io/xboxyan/pen/mNKWaN)

> 关于`react`中使用`Web Components`的注意细节可参考[https://react.docschina.org/docs/web-components.html](https://react.docschina.org/docs/web-components.html)

### vue项目引用

与原生类似，暂无研究。

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
<p-dialog show></p-dialog> <!-- 显示 -->
<p-dialog></p-dialog> <!-- 隐藏 -->
<p-button loading>button</p-button> <!-- 加载中 -->
<p-button>button</p-button> <!-- 正常 -->
```

总之，大部分情况下把它当成普通的`html`标签（不用关注shadow dom的结构）就好了，以前怎么做现在仍然怎么做，只是新增了方法而已。