本项目是使用 [Create React App](https://github.com/facebook/create-react-app)创建的，
以后所有的d3相关的预热小项目都会放在本项目文件下。

## 启动

在本项目中，你可以使用

### `npm start`

来启动项目，项目会在3000端口上以本地开发模式运行在浏览器中。

## 学习总结

### (1)数据绑定

在d3中，在我看来最为重要的概念之一就是**数据绑定**，d3中
有三个数据状态用于描述数据绑定的概念，```enter/update/exit```。

enter: 表示无节点有数据
update: 表示既有数据又有节点
exit: 表示有节点无数据

以上这三句话听上去非常别扭，不知所云，那就引用Mike大佬在《Thinking 
 with Joins》一文中的范例来作以讲解。
 
>Mike大佬假设了这么一个场景，如果需要使用d3绘制一个散点图，那么我们
会选择如何去做，首先我们需要知晓一点，d3中是没有绘制多个DOM节点的API
的，只有一个可怜的append方法，难不成我们需要将这个方法结合for循环强
行绘制多次？
答案是：No！

为了验证上面这句No，我们需要准备一个数组：

```javascript
let data = [1, 2, 3]
```

然后，调用一下这一段数据（已经将enter/update/exit状态分开）

```javascript
let circle = svg.selectAll("circle")
  .data(data);

circle.exit().remove();

circle.enter().append("circle")
    .attr("r", 2.5)
    .merge(circle)
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
```

首先，我们来看一下第一段代码，第一段代码中描述的是update状态，第二段
则是exit状态，第三段为enter状态。




## 版本提示

本项目中使用到的d3版本为最新版本version5.9.2，可支持canvas绘图，
且一些旧用法已被废除，故未在本项目下使用。

**日期:** 2019/03/17
