import { DeviceJudgeType } from "./type"

export const ua = navigator.userAgent.toLocaleLowerCase()

export const DeviceJudge: DeviceJudgeType = {
  isWx() {
    return !!ua.match(/MicroMessenger/i) && !!(ua.match(/MicroMessenger/i)![0] === 'micromessenger')
  },
  isIos() {
    const u = navigator.userAgent
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) { // 安卓手机
      return false
    } else if (u.indexOf('iPhone') > -1) { // 苹果手机
      return true
    } else if (u.indexOf('iPad') > -1) { // iPad
      return false
    } else if (u.indexOf('Windows Phone') > -1) { // winphone手机
      return false
    } else {
      return false
    }
  },
  isPC() {
    const userAgentInfo = navigator.userAgent
    const Agents = ['Android', 'iPhone',
      'SymbianOS', 'Windows Phone',
      'iPad', 'iPod']
    let flag = true
    for (let v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false
        break
      }
    }
    return flag
  },
  isQQ() {
    return /android|webos|iphone|ipod|balckberry/i.test(ua)
  },
  isMob() {
    return /android|webos|iphone|ipod|balckberry/i.test(ua)
  }
}

/**
 * 测试url params
 * @param k 
 * @param v 
 * @param baseUrl 
 * @returns 
 */
export function setUrlParam(k: string, v: string | number, baseUrl: string=location.href) {
  let url = new URL(baseUrl);
  let search = new URLSearchParams(url.search);
  search.set(k, v + '');
  url.search = search.toString();
  return url.href;
}

/**
 * 获取 URLparam
 * @param name 
 * @param href 
 * @returns 
 */
export function getUrlParam(name: string, href:string=location.href): string {
  const search = href.slice(href.indexOf('?'))
  const matched = search
      .slice(1)
      .match(new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'));
  if (!matched) return ''
  return search.length ? matched && matched[2] : '';
}

/**
 * dataUrl(base64) 转为 BlobUrl
 * @param {String} dataurl 
 * @returns 
 */
 export function dataURLtoBlobUrl(dataurl: string) {
   // @ts-expect-error
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
  }
  return URL.createObjectURL(new Blob([u8arr], { type: mime }));
}


const cubic = (value: number) => Math.pow(value, 3);
const easeInOutCubic = (value: number) => value < 0.5
  ? cubic(value * 2) / 2
  : 1 - cubic((1 - value) * 2) / 2;

type ScrollAttr = 'scrollTop' | 'scrollLeft' | 'scrollBottom' | 'scrollRight'

/**
 * 滚动到指定位置
 * @param num 
 * @param t 
 * @param dom 
 * @param attr 
 */
export function scrollTo(num = 0, t = 500, dom?: any, attr: ScrollAttr = 'scrollTop') {
  const el = dom || document.documentElement;
  const beginTime = Date.now();
  const beginValue = el[attr];
  const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16));
  const frameFunc = () => {
    const progress = (Date.now() - beginTime) / t;
    if (progress < 1) {
      el[attr] = beginValue - ((beginValue - num)* easeInOutCubic(progress));
      rAF(frameFunc);
    } else {
      el[attr] = num;
    }
  };
  rAF(frameFunc);
}


/**
 * 简单封装的 XMLHTTPRequest
 * @param url
 * @param method
 * @param params
 * @param headers
 * @returns
 */
 export function simpleXhr(url: string, method: string, params: any, headers: any): Promise<string> {
  return new Promise((resolve, reject) => {
      let xhr: XMLHttpRequest
      if (window['XMLHttpRequest']) {
          xhr = new XMLHttpRequest()
      } else if (window['ActiveXObject']) {
          xhr = new window['ActiveXObject']('')
      } else {
          alert('no xmlhttprequest')
          return
      }
      if (xhr) {
          let openUrl = url
          xhr.timeout = 10000
          xhr.open(method, openUrl, true)
          if (headers) {
              for (let name in headers) {
                  xhr.setRequestHeader(name, headers[name])
              }
          }
          xhr.onreadystatechange = function() {
              if (xhr.readyState === 4 && xhr.status === 200 ) {
                  resolve(xhr.response)
              }
          }
          xhr.onloadend = function() {
              if (xhr.status !== 200) {
                  reject('net error')
              }
          }

          xhr.ontimeout = function() {
              reject('time out')
          }

          xhr.send(params)
      }
  })
}

/**
 * 
 * @param name 
 * @returns 
 */
export function getCookie (name: string) {
  if (document.cookie.length > 0) {
    let start = document.cookie.indexOf(`${name}=`)
    if (start !== -1) {
      start = start + name.length + 1
      let end = document.cookie.indexOf(';', start)
      if (end === -1) {
        end = document.cookie.length
      }
      return decodeURI(document.cookie.substring(start, end))
    }
  }
  return ''
}

/**
 * 设置cookie值
 *
 * @param {String} name cookie名称
 * @param {String} value cookie值
 * @param {Number} expiredays 过期时间，天数
 */
 export function setCookie (name:string, value:string, expiredays:number):void {
  let exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = `${name}=${encodeURI(value)}`
  // @ts-ignore
  document.cookie += expiredays ? `;expires=${exdate.toGMTString()}` : ``
}

/**
 * 删除指定cookie值
 * @param {String} name cookie名称
 */
 export function clearCookie (name:string) {
  setCookie(name, '', -1)
}


/**
 * 简单的使用 requestAnimationFrame 方法做定时器
 * @param fn 
 * @param delay 
 * @returns 
 */
 export function setTimeoutFunc(fn:Function, delay: number=1000) {
  let lt: number = 0
  let requestId: number
  let remainTime = 0
  const final = {
    start: function() {
      const now = Date.now()
      requestId = requestAnimationFrame(this.start.bind(this))
      if (now - lt < 100)  {
        remainTime += (now-lt)
        if (remainTime >= delay) {
          fn()
          cancelAnimationFrame(requestId)
          return
        }
      }
      lt = now
    },
    stop: function() {
      cancelAnimationFrame(requestId)
    }
  }
  final.start()
  return final
}


/**
 * 简单的使用 requestAnimationFrame 方法做定时器
 * @param {*} fn 
 * @param {*} delay 100
 */
 export function setIntervalFunc(fn: Function, delay: number=1000) {
  let lt = 0 // lastTime
  let requestId: any
  let _events: Function[] = [] // 每秒需要执行的 方法arr
  typeof fn == 'function' && _events.push(fn)
  // 每秒都会执行
  const cfg = {
    start: function() {
      const now = Date.now()
      requestId = requestAnimationFrame(this.start.bind(this))
      if (now - lt >= delay) {
        lt = now
        _events.map(f => f())
      }
    },
    /**
     * 
     * @param {*} fn 
     */
    notify(fn: Function) {
      typeof fn == 'function' && _events.push(fn)
    },
    off(fn: Function) {
      let i = _events.length;
      while (i--) {
        let cb = _events[i];
        if (cb === fn) {
          _events.splice(i, 1);
          break;
        }
      }
    },
    getRequestId() {
      return requestId
    },
    stop() {
      cancelAnimationFrame(requestId)
    }
  }
  cfg.start()
  return cfg
}


/**
 * 时间格式化
 * @param {*} fmt 
 * @param {*} date 
 * @returns 
 */
 export function dateFormat(fmt: string, date: number | Date | string) {
  let ret;
  // ios 的时间 格式 需要转成 /
  if (typeof date === 'string') {
    date = date.replace(/-/g, '/')
  }
  date = new Date(date)
  const opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "M+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "h+": date.getHours().toString(),           // 时
    "m+": date.getMinutes().toString(),         // 分
    "s+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        // @ts-expect-error
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
  };
  return fmt;
}