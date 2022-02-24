/**
 * title: onceFunc
 * desc: 简单的一个 执行一次的方法 == 闭包
 */

import { onceFunc } from '@lightfish/tools'
import React, { useCallback, useState } from 'react'

export default () => {
  const [count, setCount] = useState(0)
  // 别傻乎乎的用上面这个用法
  // 原因就是因为每次 重新render 都会有着 自己的 局部变量， 这样的话，每次都会重新去声明 addOne 方法
  // const addOne = onceFunc(function() {
  //   setCount((i) => i+1)
  // })
  const addOne = useCallback(onceFunc(function() {
    setCount((i) => i+1)
  }), [])
  return (
    <>
      <span>{count}</span>
      <button onClick={addOne}>+1</button>
    </>
  )
}
