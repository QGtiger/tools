import { H5ScrollCtrlType } from "./type";

/**
 * 移动端的键盘回收上移处理
 */
 export function inputIosAdapte() {
  var ua = window.navigator.userAgent.toLowerCase();
  if (/iphone|ipod|ipad/i.test(navigator.appVersion) && /MicroMessenger/i.test(ua)) {
      document.body.addEventListener('focusout', () => {
          console.log('focusout')
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      });
  }
}

/**
* 添加样式表 addCSSRule(document.styleSheets[0], ".header", "float: left");
* @param {*} sheet 
* @param {*} selector 
* @param {*} rules 
* @param {*} index 
*/
export function addCSSRule(sheet: any, selector: 'string', rules: 'string', index: number) {
  if("insertRule" in sheet) {
      sheet.insertRule(selector + "{" + rules + "}", index);
  }
  else if("addRule" in sheet) {
      sheet.addRule(selector, rules, index);
  }
}

var whitespaceRE = /\s+/


/**
 * 添加 Dom class
 * @param {Element} el 
 * @param {String} cls 
 * @returns 
 */
 export function addClass(el:HTMLElement, cls:string) {
  if (!el) {
    console.warn(`can't add class ${cls} to ${el}`)
    return
  }
  if (!cls || !(cls = cls.trim())) {
    return
  }
  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(whitespaceRE).forEach(function (c) {
        return el.classList.add(c);
      });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}


/**
 * 移除Dom class
 * @param {Element} el 
 * @param {String} cls 
 * @returns 
 */
 export function removeClass(el:HTMLElement, cls:string) {
  if (!el) {
    console.warn(`can't remove class ${cls} from ${el}`)
    return
  }
  if (!cls || !(cls = cls.trim())) {
    return
  }
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(whitespaceRE).forEach(function (c) {
        return el.classList.remove(c);
      });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/**
 * 设置 Dom 内联样式
 * @param {Element} el 
 * @param {Object} styles 
 * @returns 
 */
 export function setStyles (el:HTMLElement, styles: Partial<CSSStyleDeclaration>) {
  if (!el) {
    console.warn(`can't set styles from ${el}`)
    return
  }
  if (!styles) return
  for(let k in styles) {
    if (styles[k]) {
      el.style[k] = styles[k]!
    }
    
  }
}

/**
 * 添加事件
 * @param {Element} element 
 * @param {String} type 
 * @param {Function} callback 
 */
 export function addHandler(element: HTMLElement, type:string, callback:Function) {
  if (!element) {
    console.warn(`can't addHandler ${type} from undefined`)
    return
  }
  if (element.addEventListener) {
      if (type.slice(0,2) === 'on') type = type.slice(2)
      // @ts-expect-error
      element.addEventListener(type, callback, false)
  } else {
      if (type.slice(0,2) !== 'on') type = 'on' + type
      // @ts-expect-error
      element.attachEvent(type, callback)
  }
}


/**
 * remove 事件
 * @param {Element} element 
 * @param {String} type 
 * @param {Function} callback 
 */
 export function removeHandler(element: any, type:string, callback:Function) {
  if (!element) {
    console.warn(`can't removeHandler ${type} from ${element}`)
    return
  }
  if (element.addEventListener) {
      if (type.slice(0,2) === 'on') type = type.slice(2)
      element.removeEventListener(type, callback, false)
  } else {
      if (type.slice(0,2) !== 'on') type = 'on' + type
      element.datachEvent(type, callback)
  }
}


/**
 * H5 页面的 防止滚动
 */
 export const H5ScrollCtrl: H5ScrollCtrlType = (function () {
  let isLockScroll = false // 是否已经锁定了
  let scrollCont = document.getElementsByTagName("html")[0];
  let currScrollTop = 0;
  return {
    disabled() {
      if (isLockScroll) return
      isLockScroll = true
      // const html = document.getElementsByTagName("html")[0];
      // // 判断是不是 html在 滚动
      // if (html.scrollTop) {
      //   scrollCont = html;
      // }
      const scrollTop = scrollCont.scrollTop;
      currScrollTop = scrollTop;

      scrollCont.style.overflow = "hidden";
      scrollCont.style.touchAction = "none";
      scrollCont.style.top = `-${scrollTop}px`;
      scrollCont.style.position = "fixed";
      setStyles(scrollCont, {
        left: '0',
        right: '0'
      })
    },
    enabled() {
      if (!isLockScroll) return
      isLockScroll = false
      scrollCont.style.overflow = "";
      scrollCont.style.touchAction = "auto";
      scrollCont.style.position = "static";
      scrollCont.scrollTop = currScrollTop;
      scrollCont.style.top = "auto";
      setStyles(scrollCont, {
        left: 'auto',
        right: 'auto'
      })
    },
  };
})();