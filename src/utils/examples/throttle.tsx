import React, { useCallback, useState } from "react";
import { throttle } from '@lightfish/tools'

export default function ThrottleComp() {
  const [count, setCount] = useState(0)

  const throttleAdd = useCallback(throttle(() => {
    setCount(i => i+1)
  }, 1000), [])

  return (
    <div>
      <span>{count}</span>
      <button onClick={throttleAdd}>+1</button>
    </div>
  )
}