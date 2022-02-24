/**
 * title: 循环链表
 * desc: 循环链表实现的简单 弹幕
 */
import React, { ReactNode, useCallback, useEffect, useRef, useState, useImperativeHandle } from "react";
import './LoopNodeList.less'
import { LoopNodeList, setStyles, AniFactoryConfig, promiseAwaitFunc, randomNum } from '@lightfish/tools'

type SingleDanmuInfo = string | {
  node: ReactNode
}

export interface SingleLineDanmuProps {
  /**
   * 可以这样写属性描述
   * @description       也可以显式加上描述名
   * @description.zh-CN 还支持不同的 locale 后缀来实现多语言描述
   * @default           支持定义默认值
   */
  speed: number,
  danmuArr: SingleDanmuInfo[],
  autoPlay?: boolean,
  delay?: number,
  gutter?: number | (() => number),
  loop?: boolean,
  multiple?: boolean,
  multipleHeight?: number
}

interface DanmuNode {
  next: DanmuNode | null,
  value: HTMLElement,
  movePromise?: Promise<void>
}

export const SingleLineDanmu = React.forwardRef((props:SingleLineDanmuProps, ref) => {
  const wrapperCont = useRef<HTMLDivElement>()
  const danmuNodeList = useRef<LoopNodeList>(new LoopNodeList())
  const startTimerId = useRef<number>()
  const nextTimerId = useRef<number>()
  const isStopFlag = useRef<boolean>(false)

  const { danmuArr=['弹幕1', '弹幕2'], loop } = props
  const danmuLen = danmuArr.length
  const currDanmuNodeList = danmuNodeList.current
  const currDanmuLen = currDanmuNodeList.size()

  useImperativeHandle(ref, () => ({
    addDanmuItem(item: SingleDanmuInfo) {

    },
    start() {
      isStopFlag.current = false
      scrollOnce(currDanmuNodeList.head)
    },
    stop() {
      isStopFlag.current = true
    }
  }))

  useEffect(() => {
    const { delay = 0, autoPlay=true } = props
    if (autoPlay) {
      startTimerId.current = setTimeout(()=> {
        scrollOnce(currDanmuNodeList.head)
      }, delay)
    }
    return () => {
      nextTimerId.current && clearTimeout(nextTimerId.current)
      startTimerId.current && clearTimeout(startTimerId.current)
    }
  }, [])


  const scrollOnce = useCallback(promiseAwaitFunc(async (node:DanmuNode) => {
    if (!node || isStopFlag.current) return
    if(node.movePromise) {
      await node.movePromise
    }
    const currDom = node.value

    node.movePromise = new Promise<void>(r => {
      const totalWidth = wrapperCont.current!.offsetWidth
      const { multiple=false, multipleHeight = 0,speed=30,gutter=0 } = props
      const currDomOffsetWidth = currDom.offsetWidth
      const moveLen = totalWidth + currDomOffsetWidth
      const totalTime = moveLen / speed * 1000
      const preMoveLen = currDomOffsetWidth + (typeof gutter === 'function' ? gutter() : gutter)
      setStyles(currDom, {
        transform: `translateX(-${moveLen}px)`,
        transition: `transform ${totalTime}ms linear`,
        top: `${multiple ? randomNum(0, multipleHeight) : 0}px`
      })

      nextTimerId.current = setTimeout(() => {
        scrollOnce(node.next)
      }, preMoveLen / speed * 1000)

      AniFactoryConfig.whenTransitionEnd(currDom, 'transition', () => {
        setStyles(currDom, {
          transform: 'translateX(0)',
          transition: 'none'
        })
        r()
      })
    })
  }), [])

  return (
    <div className="singleLineDanmu" ref={el => el && (wrapperCont.current = el)}>
      {
        danmuArr && danmuArr.length && danmuArr.map((item, index) => {
          return (
            <div className="danmu-item" key={`danmu${index}`} ref={
              el => {
                if (el) {
                  if (index + 1 > currDanmuLen) {
                    currDanmuNodeList.append(el, loop && (index + 1 === danmuLen))
                  }
                  // danmuArr 小于 链表的时候
                  if (index + 1 === danmuLen) {
                    currDanmuNodeList.setTail(el, !!loop)
                  }
                }
              }
            }>
              {
                typeof item === 'string' || !React.isValidElement(item.node) ? (
                  <div className="danmu-nokown">
                    {item}
                  </div>
                ) : (
                  item.node
                )
              }
            </div>
          )
        })
      }
    </div>
  )
})

export default class extends React.Component {
  state = {
    arr: [
      {
        node: <img src="http://qnpic.top/yoona2.jpg" width="30px" />
      },
      {
        node: <img src="http://qnpic.top/yoona12.jpg" width="30px" />
      }
    ]
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        arr: [
          {
            node: <img src="http://qnpic.top/yoona2.jpg" width="30px" />
          },
          {
            node: <img src="http://qnpic.top/yoona12.jpg" width="30px" />
          },
          {
            node: <img src="http://qnpic.top/yoona12.jpg" width="30px" />
          }
        ]
      })
    }, 3000)
  }

  render() {
    const {arr} = this.state
    return (
      <SingleLineDanmu speed={50} danmuArr={arr}
      gutter={() => {
        return 20 + Math.random() * 50
      }}
      loop={true}
      multiple={true}
      multipleHeight={200}
      />
    )
  }
}