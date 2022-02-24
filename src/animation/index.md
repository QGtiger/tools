---
nav:
  title: 动画处理
  path: /tools
---

> 整合的动画处理方式

## 简单的动画

> `AniFactory` 简单的一个动画工厂， 可以用animation 和transition 动画， animation 动画 当然和简单 只需要加一个 class 就好了， transition 动画 添加一个动画前缀就好了， css的写法如下

```css
// 这里注意下， -leave-active 和 -enter-active 要写在 -enter 和 -leave-to 上面
.fade-in-linear-leave-active, .fade-in-linear-enter-active {
  transition: opacity .3s linear;
}

.fade-in-linear-enter, .fade-in-linear-leave-to {
  opacity: 0;
}
```

> 简单的应用

<code src="./examples/aniFactory.tsx">

## 多段动画处理

> 在日常开发中往往会出现 需要多段动画进行 交错显示，这里简单 整合一个function `onShowAnimationList`

<code src="./examples/onShowAnimationList.tsx">