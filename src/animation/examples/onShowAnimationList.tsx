/**
 * title: 动画处理
 * desc: 多段动画处理
 */
import React, { useEffect, useRef } from "react"
import { onShowAnimationList } from "@lightfish/tools"

export default () => {
  const ani1 = useRef<HTMLElement>()
  const ani2 = useRef<HTMLElement>()
  const ani3 = useRef<HTMLElement>()

  useEffect(() => {
    onShowAnimationList([
      {
        dom: ani1.current!,
        aniCls: 'fade-in-linear',
        aniType: 'transition',
        aniEndTimingFromLast: 1000
      },
      {
        dom: ani2.current!,
        aniCls: 'slide-top',
        aniType: 'transition',
        aniEndTimingFromLast: 1000
      },
      {
        dom: ani3.current!,
        aniCls: 'scale-in-center',
        aniType: 'transition',
        aniEndTimingFromLast: 1000
      }
    ])
  }, [])
  return (
    <>
      <div className="test" ref={r => r && (ani1.current =r)} style={{
        display: 'none'
      }}>123</div>
      <div className="test" ref={r => r && (ani2.current =r)} style={{
        display: 'none'
      }}>456</div>
      <div className="test" ref={r => r && (ani3.current =r)} style={{
        display: 'none'
      }}>789</div>
    </>
  )
}