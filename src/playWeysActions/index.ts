import {CSSProperties} from "react";
import ReactDOM from 'react-dom'
import { PromiseAwait, typeofFunc } from "../utils/index";
import { addClass, addHandler, H5ScrollCtrl, removeClass, removeHandler, setStyles } from "../document/index";

import './newGuy.less'

type SimpleEvents = {
  isStopPropagation?: boolean,
  handler: Function
} | Function

interface NewGuideCls {
  wrapperCls: string,
  newGuidanceCls: string
}

interface Pos {
  x: number,
  y: number
}

interface FocusDomDescInfer {
  node: React.ReactNode,
  offset: Pos
}

interface FocusDomConfig {
  ele: HTMLElement,
  style?: CSSProperties | undefined,
  descConfig?: Array<FocusDomDescInfer>,
  events?: {
    [key in keyof WindowEventMap]?: SimpleEvents
  }
}

const defaultClasses:NewGuideCls = {
  wrapperCls: 'lf-newGuidance-wrapper',
  newGuidanceCls: 'lf-newGuidance'
}


export class NewGuide {
  _doneStep: number = 1 // 已完成步数
  allSteps: number = 0 // 全部新手引导步数
  stepChangeCb?: Function // stepChange CallBack
  zIndex: number = 1000
  finishCallBackList: Array<Function> = [] // 完成新手引导 回调list
  resetCallBackList: Array<Function> = [] // reset 回调list
  wrapperBody = document.body // 最外层元素
  lastFocusDomsConfig: Array<FocusDomConfig> = []
  lastFocusDomsCommonParentNode?: Element // 公共父元素
  descNodeList: Array<HTMLElement> = [] // 描述性node list

  set doneStep(n: number) {
    this._doneStep = n
    typeof this.stepChangeCb === 'function' && this.stepChangeCb()
    // 完成新手引导
    if (n >= this.allSteps) {
      this.finish()
    }
  }

  get doneStep():number {
    return this._doneStep
  }

  get isInNewGuidance() {
    // 已完成大于总步数就是不再新手引导里面了
    return this.doneStep < this.allSteps
  }

  /**
   * NewGuide Constructor
   * @param doneStep 已完成步数，注意是不是当前步数步数，是当前+1
   * @param allSteps 全部新手引导步数
   * @param stepChange stepChang CallBack
   */
  constructor(doneStep: number, allSteps: number, zIndex: number = 1000, stepChange?: Function) {
    this.allSteps = allSteps
    this.doneStep = doneStep
    this.zIndex = zIndex
    this.stepChangeCb = stepChange
    if (doneStep < allSteps) {
      H5ScrollCtrl.disabled()
      addClass(this.wrapperBody, defaultClasses.wrapperCls)
      this.wrapperBody.style.setProperty('--zIndex', zIndex + '')
    }
  }

  /**
   * 监听新手引导 回调
   * @param cb Function
   */
  notifyFinishFunc(cb: Function) {
    this.finishCallBackList.push(cb)
  }

  /**
   * 监听reset 回调
   * @param cb Function
   */
  notifyResetFunc(cb: Function) {
    this.resetCallBackList.push(cb)
  }

  /**
   * 新手引导完成
   */
  finish() {
    this.reset()
    // this.doneStep = this.allSteps
    this.finishCallBackList.forEach(f => f())
    removeClass(this.wrapperBody, defaultClasses.wrapperCls)
    H5ScrollCtrl.enabled()
  }

  /**
   * 下一步新手引导
   * @param step 
   */
  nextStep(step?: number) {
    this.doneStep = step || (this.doneStep + 1)
  }

  /**
   * 清除上一步的 引导
   */
  reset() {
    this.resetCallBackList.forEach(f => f())
    this.lastFocusDomsConfig.forEach(item => {
      setStyles(item.ele, {
        // @ts-ignore
        zIndex: item.ele._zindex || '',
        // @ts-ignore
        position: item.ele._position || '',
      })

      for (const k in item.events) {
        if (Object.prototype.hasOwnProperty.call(item.events, k)) {
          // @ts-expect-error
          const cb = item.events[k];
          cb && removeHandler(item.ele, k, cb)
        }
      }
    })
    this.lastFocusDomsConfig.splice(0)
    // 清除样式
    this.lastFocusDomsCommonParentNode && removeClass(this.lastFocusDomsCommonParentNode as HTMLElement, defaultClasses.newGuidanceCls + ' black')
    this.descNodeList.forEach(n => {
      ReactDOM.unmountComponentAtNode(n)
      n.remove()
    })
    this.descNodeList.splice(0)
  }

  /**
   * 寻找共同父元素
   * @param arr 
   * @returns 
   */
  findCommonParentNode = (arr: Array<Element>): Element => {
    let el: Element = arr.splice(0, 1)[0].parentNode as Element
    while (el != document.body) {
      // getComputedStyleFunc(el).position != 'static'
      if (arr.every(item => el.contains(item))) {
        break
      }
      el = el.parentNode as Element
    }
    return el
  }

  /**
   * 初始化配置数组
   * @param arr 
   */
  onInitFocusDomConfigArr(arr:Array<FocusDomConfig>) {
    this.lastFocusDomsConfig = arr.map<FocusDomConfig>(item => {
      const obj = Object.create(null)
      obj.ele = item.ele,
      obj.style = item.style || {}
      obj.descConfig = item.descConfig || []
      const _events = item.events
      if (!_events) {
        obj.events = {}
      } else {
        for (const eventName in _events) {
          if (Object.prototype.hasOwnProperty.call(_events, eventName)) {
            // @ts-expect-error
            const cfg = _events[eventName];
            const type = typeofFunc(cfg)
            if (type === 'function') {
              continue
            } else if (type === 'object') {
              const cb = cfg.handler
              const { isStopPropagation } = cfg
              if (isStopPropagation) {
                // @ts-expect-error
                _events[eventName] = function(e: Event) {
                  e.stopPropagation()
                  cb()
                }
              } else {
                // @ts-expect-error
                _events[eventName] = cb
              }
            }
          }
        }
      }
      obj.events = _events
      return obj
    })
    return this.lastFocusDomsConfig
  }

  /**
   * 聚焦dom list
   * @param domConfigArr 
   * @param isBlack 
   */
  focusDomList(domConfigArr: Array<FocusDomConfig>, isBlack: boolean = true) {
    this.reset()

    const _lastFocusDomsConfig = this.onInitFocusDomConfigArr(domConfigArr)
    const commonParentNode = this.lastFocusDomsCommonParentNode = this.findCommonParentNode(_lastFocusDomsConfig.map(i => i.ele))
    addClass(commonParentNode as HTMLElement, defaultClasses.newGuidanceCls)
    
    this.backTurn(isBlack)

    _lastFocusDomsConfig.forEach(item => {
      const currDom = item.ele
      if (!(currDom instanceof Element)) {
        console.error('ele must be the type of Element')
        return
      }
      // @ts-ignore 记一次之前的 zIndex
      currDom._zindex = currDom.style.zIndex
      // @ts-ignore
      let _p = currDom._position = getComputedStyle(currDom).position
      // 设置样式
      setStyles(currDom, {
        // @ts-expect-error
        zIndex: this.zIndex + 10,
        position: _p === 'static' ? 'relative' : getComputedStyle(currDom).position,
        ...item.style
      })

      // 设置描述性文案
      if (Array.isArray(item.descConfig)) {
        for (let i = 0; i < item.descConfig.length; i++) {
          const currDescConfig = item.descConfig[i];
          this.onShowFocusDomDesc(item.ele, currDescConfig.node, currDescConfig.offset)
        }
      }

      // 添加事件
      const currEvents = item.events
      if (currEvents) {
        for (const ename in currEvents) {
          if (Object.prototype.hasOwnProperty.call(currEvents, ename)) {
            // @ts-expect-error
            const cb = currEvents[ename];
            addHandler(currDom, ename, cb)
          }
        }
      }
      
    })
  }

  /**
   * 渲染描述node
   * @param parentNode 
   * @param domNode 
   * @param offset 
   */
  onShowFocusDomDesc(parentNode: HTMLElement, domNode: any, offset: Pos = {x: 0, y: 0}) {
    const currDescDom = document.createElement('div')
    addClass(currDescDom, 'lf-newGuidance-desc')
    setStyles(currDescDom, {
      position: 'absolute',
      left: `${offset.x}px`,
      top: `${offset.y}px`,
      pointerEvents: `none`
    })
    parentNode.appendChild(currDescDom)

    ReactDOM.render(domNode, currDescDom)

    this.descNodeList.push(currDescDom)
  }

  lastBackBlack: boolean = false
  /**
   * 背景切换
   * @param ib 
   * @returns 
   */
  @PromiseAwait
  backTurn(ib: boolean) {
    if (this.lastBackBlack === ib) return
    this.lastBackBlack = ib
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const fn = ib ? addClass : removeClass
        const el = this.lastFocusDomsCommonParentNode
        fn(this.lastFocusDomsCommonParentNode as HTMLElement, `black`)

        var hasRun = false
        var end = function () {
          removeHandler(el, 'transitionend', end)
          if (!hasRun) {
            hasRun = true
            resolve()
          }
        };
        addHandler(el as HTMLElement, 'transitionend', end)
        setTimeout(function () {
          end()
        }, 500 + 1);
        // 动画结束
        // addHandler(this.lastFocusDomsCommonParentNode, 'transitionend', () => {
        //   resolve()
        // })
      }, 50)
    })
  }
}