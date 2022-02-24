import { addClass, removeClass, setStyles, setTimeoutFunc } from ".."
import './index.less'

type AniFactoryType = 'transition' | 'animation'
type AnimationInfo = {
  type: AniFactoryType,
  timeout: number,
  propCount: number
}
interface AniFactoryConfigInfer {
  transitionEndEvent: string,
  animationEndEvent: string,
  getTransitionInfo: (el: HTMLElement, expectedType: AniFactoryType) => AnimationInfo,
  whenTransitionEnd: (el: HTMLElement, expectedType: AniFactoryType, cb?: Function) => void,
  getClsAniTimeout: (cls: string, aniType: AniFactoryType) => number
}

export type AniConfig = {
  aniType?: 'transition' | 'animation',
  aniName?: string,
}

export const AniFactoryConfig: AniFactoryConfigInfer = (function() {

  const transitionProp: string = 'transition' // transiton 动画
  const animationProp: string = 'animation' // animation 动画
  var transitionEndEvent = 'transitionend'; // transitionend 事件 用于动画结束的时候去除动画 class
  var animationEndEvent = 'animationend'; // animationend 事件 用于动画结束的时候去除动画 class
  
  // 以下是兼容浏览器方法。
  if (window.ontransitionend === undefined &&
      window.onwebkittransitionend !== undefined
  ) {
      transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
      window.onwebkitanimationend !== undefined
  ) {
    animationEndEvent = 'webkitAnimationEnd';
  }

  /**
   * 转化成 number 毫秒
   * @param s 
   * @returns 
   */
  function toMs(s: string) {
    return Number(s.slice(0, -1).replace(',', '.')) * 1000
  }

  /**
   * 获取一段动画的 timeout 时间节点
   * @param delays 
   * @param durations 
   * @returns 
   */
  function getTimeout(delays: Array<string>, durations: Array<string>) {
    while (delays.length < durations.length) {
      delays = delays.concat(delays)
    }

    return Math.max.apply(null, durations.map((curr, index) => {
      return toMs(curr) + toMs(delays[index])
    }))
  }

  // 获取当前动画的信息，如delay duration
  function getTransitionInfo(el: HTMLElement, expectedType: AniFactoryType) {
    var styles: any = window.getComputedStyle(el)

    var type = expectedType // 默认值
    var timeout = 0
    var propCount = 0
    
    if (expectedType === 'animation') {
      var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ')
      var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ')
      var animationTimeout = getTimeout(animationDelays, animationDurations)
      if (animationTimeout > 0) {
        timeout = animationTimeout
        propCount = animationDurations.length
      }
    } else {
      var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ')
      var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ')
      var transitionTimeout = getTimeout(transitionDelays, transitionDurations)
      if (transitionTimeout > 0) {
        timeout = transitionTimeout
        propCount = transitionDurations.length
      }
    }

    return {
      type: type, // 当前动画类型，是transiton 动画 还是 animation动画
      timeout: timeout,
      propCount: propCount
    }
  }

  // 以下是重要代码，是在动画结束的时候，执行回调function
  function whenTransitionEnd (el: HTMLElement, expectedType: AniFactoryType, cb?: Function) {
    var ref = getTransitionInfo(el, expectedType)
    var timeout = ref.timeout;
    var propCount = ref.propCount;
    var event = expectedType === transitionProp ? transitionEndEvent : animationEndEvent;
    var runOnce = true
    var end = function () {
        el.removeEventListener(event, end)
        if (runOnce) {
          runOnce = false
          typeof cb === 'function' && cb();
        }
    };
    el.addEventListener(event, end);
    setTimeout(function () {
      end()
    }, timeout + 1);
  }

  /**
   * 获取gai dom 节点上的 animation timeout 这里就取 duration
   * @param {*} dom 
   */
  function getClsAniTimeout(cls: string, aniType: AniFactoryType) {
    const el = document.createElement('div')
    addClass(el, cls)
    setStyles(el, {
      position: 'absolute',
      width: '0',
      height: '0',
      left: '0',
      bottom: '0'
    })
    document.body.appendChild(el)
    const t = getTransitionInfo(el, aniType).timeout
    document.body.removeChild(el)
    return t
  }

  return {
    transitionEndEvent,
    animationEndEvent,
    getTransitionInfo,
    whenTransitionEnd,
    getClsAniTimeout
  }
})()


/**
 * 结合transition 和 animation 的 动画工厂
 */
 export class AniFactory {
  target: HTMLElement
  isStartDisplayNone: boolean // 是否开始的时候就是 display none
  showAniCfg: AniConfig
  closeAniCfg: AniConfig

  /**
   * 
   * @param target 目标Dom
   * @param scfg show
   * @param ccfg close
   */
  constructor(target: HTMLElement, scfg: AniConfig = {}, ccfg:AniConfig = {}) {
    this.target = target
    this.showAniCfg = scfg
    this.closeAniCfg = ccfg
    this.isStartDisplayNone = getComputedStyle(target).display === 'none'
  }

  // clearAllAniCls() {
  //   const {target, aniCls} = this
  //   removeClass(target, `${aniCls} ${aniCls}-enter ${aniCls}-leave ${aniCls}-enter ${aniCls}-leave-to ${aniCls}-enter-active ${aniCls}-leave-active`)
  // }

  showAni(cb: Function = () => {}, aniCfg?: AniConfig) {
    return new Promise<void>(r => {
      const {target, showAniCfg, isStartDisplayNone} = this
      const finalConfig = aniCfg || showAniCfg
      const { aniName: aniCls = '', aniType = 'transition' } = finalConfig
      if (aniType === 'animation') {
        isStartDisplayNone && (target.style.display = 'block')
        addClass(target, `${aniCls} ${aniCls}-enter`)
        AniFactoryConfig.whenTransitionEnd(target, aniType, () => {
          cb && cb()
          r()
        })
      } else {
        var showStartClsName = aniCls + '-enter'
        var showActiveClsName = aniCls + '-enter-active'

        addClass(target, showStartClsName)
        isStartDisplayNone && (target.style.display = 'block')
        setTimeoutFunc(() => {
          addClass(target, showActiveClsName)
          setTimeoutFunc(() => {
            removeClass(target, showStartClsName)
            AniFactoryConfig.whenTransitionEnd(target, aniType, function() {
              removeClass(target, showStartClsName + ' ' + showActiveClsName)
              typeof cb === 'function' && cb()
              r()
            })
          }, 10)
        }, 50)
      }
    })
  }

  hideAni(cb: Function = () => {}, aniCfg?: AniConfig) {
    return new Promise(r => {
      const {target, closeAniCfg} = this
      const finalConfig = aniCfg || closeAniCfg
      const { aniName: aniCls = '', aniType = 'transition' } = finalConfig
      if (aniType === 'animation') {
        addClass(target, `${aniCls}-leave`)
        AniFactoryConfig.whenTransitionEnd(target, aniType, cb)
      } else {
        var hiddenStartClsName = aniCls + '-leave-to'
        var hiddenActiveClsName = aniCls + '-leave-active'
        addClass(target, hiddenActiveClsName) // hidden 的动画，就相对简单，只需要加上动画就行了，因为没有 display none 的干扰
        addClass(target, hiddenStartClsName)
        AniFactoryConfig.whenTransitionEnd(target, aniType, function() {
          removeClass(target, hiddenStartClsName + ' ' + hiddenActiveClsName)
          typeof cb === 'function' && cb()
        })
      }
    })
  }
}

interface ReactRef {
  current: HTMLElement
}

interface SingleAnimationCfgInfer {
  dom: HTMLElement,
  aniCls: string,
  aniType?: AniFactoryType, // 默认 animation
  fromLastTogether?: boolean, // 是否一起
  aniStartTimingFromLast?: number, // 距离上一个动画开始时间
  aniEndTimingFromLast?: number, // 距离上一个动画结束
  isRemoveAniEnd?: boolean, // 是否动画结束后删除 class
  isShowOriginCont?: boolean // 是否显示原始container
}

type ShowAniListInfer = (aniArr: SingleAnimationCfgInfer[]) => void

export const onShowAnimationList: ShowAniListInfer = (function() {
  /**
   * 初始化时间线
   * @param dom 
   * @param st 
   * @param cfg 
   * @param timeLine
   */
  function initTimeLine(dom: HTMLElement, st: number, cfg: SingleAnimationCfgInfer, timeLine: [number, number][]) {
    const { aniCls, isRemoveAniEnd=false, isShowOriginCont, aniType } = cfg
    const startTiming = st
    !isShowOriginCont && setStyles(dom, {
      visibility: 'hidden',
      pointerEvents: 'none',
      display: 'block'
    })
    // 做动画的时候去掉 事件
    dom.onclick = function(e) {
      e.stopPropagation()
    }
    setTimeout(() => {
      if (dom) {
        !isShowOriginCont && setStyles(dom, {
          visibility: 'visible',
          pointerEvents: 'auto'
        })
        // 自动做动画
        const aniIns = new AniFactory(dom, {
          aniName: aniCls,
          aniType: aniType
        })
        aniIns.showAni(() => {
          dom.onclick = null
          isRemoveAniEnd && removeClass(dom, aniCls)
        })
      }
    }, startTiming)
    timeLine.push([startTiming, AniFactoryConfig.getClsAniTimeout(aniType == 'animation' ? `${aniCls} ${aniCls}-enter` : `${aniCls}-enter-active`, aniType || 'animation')])
  }
  return function(aniArr: SingleAnimationCfgInfer[]) {
    try {
      if (!Array.isArray(aniArr)) {
        throw new Error(`The param must be the Array`)
      }
      // 加默认值
      aniArr.forEach(a => a.aniType = a.aniType || 'animation')
      let timeLine: [number, number][] = []
      let previousItemIndex
      let currItemIndex = 0

      while(currItemIndex < aniArr.length) {
        const currItem = aniArr[currItemIndex]
        const currDom = currItem.dom
        const {fromLastTogether, aniStartTimingFromLast, aniEndTimingFromLast} = currItem
        if (previousItemIndex === undefined) {
          initTimeLine(currDom, aniStartTimingFromLast || 0, currItem, timeLine)
        } else {
          let st: number = timeLine[previousItemIndex][0]
          if (aniStartTimingFromLast) {
            st += aniStartTimingFromLast
          } else if(aniEndTimingFromLast) {
            st +=timeLine[previousItemIndex][1] + aniEndTimingFromLast
          }
          initTimeLine(currDom, st, currItem, timeLine)
        }
        previousItemIndex = currItemIndex
        ++currItemIndex
      }
    } catch(e) {
      console.error(e)
    }
  }
})()