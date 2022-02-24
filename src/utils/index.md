---
nav:
  title: utils
  path: /tools
---

> 简单的一些方法

## 前言

> 简单记录一下一些方法， [装饰器](https://juejin.cn/post/6844904100144889864)

```tsx
/**
 * title: 基本源码
 */
import React from 'react'
import { LoopNodeList } from '@lightfish/tools'
import '.'

export default () => <div>Hellow world</div>
```

## 执行一次函数

> 执行一次 Function

<code src="./examples/onceFunc.tsx"></code>

## debounce 函数防抖

> `debounce` 应用场景有下拉的刷新

<code src="./examples/debounce.tsx" />

## 函数 节流

> `throttle` 函数节流，在一些防止用户交互逻辑过于频繁的解决方式

<code src="./examples/throttle.tsx" />

## 装饰器的简单应用

<code src="./examples/decoratorExamples" />
