
/**
 * 函数防抖，如下拉菜单
 * @param {Function} fn 
 * @param {Number} delay 
 * @returns 
 */
 export function debounce(fn: Function, delay: number=2000) {
  let timer:any = null;
  function invokeFunc(...args: any[]) {
    // @ts-expect-error
    let context = this;
    if(timer) clearTimeout(timer)
    timer = setTimeout(()=>{
      fn.apply(context, args)
    }, delay)
  }
  function cancel() {
    if (timer !== undefined) {
      clearTimeout(timer)
    }
  }
  invokeFunc.cancel = cancel
  return invokeFunc
}

/**
 * 函数防抖的 装饰器版本
 * @param time 
 * @returns 
 */
export function debounceDecorator(time: number = 1000) {
  return function (target: any, property: string, descriptor: PropertyDescriptor) {
    const func = descriptor.value
    if (typeof func !== 'function') {
      throw new Error('debounceDecorator error: are u kidding me ?')
    }
    let timerId: number
    function invokeFunc(...args: any[]) {
      // @ts-expect-error
      let context = this;
      if(timerId) clearTimeout(timerId)
      timerId = setTimeout(()=>{
        func.apply(context, args)
      }, time)
    }
    function cancel() {
      if (timerId !== undefined) {
        clearTimeout(timerId)
      }
    }
    invokeFunc.cancel = cancel
    descriptor.value = invokeFunc
  }
}




/**
* 函数节流， 用作防连点
* @param {Function} fn 
* @param {Number} delay 
* @returns 
*/
export function throttle(fn: Function, delay: number=2000) {
  let flag: boolean = true,
    timerId: number
  return function (...args: any[]) {
    if (!flag) return
    flag = false
    timerId && clearTimeout(timerId)
    timerId = setTimeout(function() {
      flag = true
    }, delay)
    // @ts-expect-error
    const context = this
    return fn.apply(context, args)
  };
}


/**
 * 函数节流的 装饰器版本
 * @param time 
 * @returns 
 */
export function throttleDecorator(time: number = 1000) {
  return function(target: any, property: string, descriptor: PropertyDescriptor) {
    const func: Function = descriptor.value
    if (typeof func !== 'function') {
      throw new Error('debounceDecorator error: are u kidding me ?')
    }
    let flag: boolean = true,
    timerId: number
    function invokeFunc(...args: any[]) {
      if (!flag) return
      flag = false
      timerId && clearTimeout(timerId)
      timerId = setTimeout(function() {
        flag = true
      }, time)
      // @ts-expect-error
      const context = this
      return func.apply(context, args)
    }
    descriptor.value = invokeFunc
  }
}


/**
 * Promise 确保执行 依赖于外部 标记值
 * @param propertyName 变量名
 * @param propertyValue 前后执行状态
 * @param allowedValue 允许执行的状态值 数组
 * @returns 
 */
export function PromiseAwaitByPropertyValue<T>(propertyName: string, propertyValue: T[], allowedValue?: T[]) {
  return function(target: any, property: string, descriptor: PropertyDescriptor) {
    const func = descriptor.value
    descriptor.value = async function(...args: any[]) {
      // @ts-expect-error
      const currPropertyValue = this[propertyName]
      const beforePropertyValue = propertyValue[0]
      const afterPropertyValue = propertyValue[1]
      if (allowedValue && !allowedValue.includes(currPropertyValue)) {
        console.error('something for everything is bad:', currPropertyValue)
        return
      }
      if (currPropertyValue === beforePropertyValue) {
        console.error(`the ${property} is not promise call back.`)
        return
      }
      // @ts-expect-error
      this[propertyName] = beforePropertyValue
      await func.apply(this, args)
      // @ts-expect-error
      this[propertyName] = afterPropertyValue
    }
  }
}

/**
 * 只会执行一次
 * @param fn 
 * @returns 
 */
export function onceFunc(fn: Function) {
  let isDone: boolean = false
  return function(...args: any[]) {
    if (isDone) return
    isDone = true
    // @ts-expect-error
    return typeof fn === 'function' && fn.apply(this, args)
  }
}

/**
 * 当方法的一些 前置判断和后置处理给剥离出来
 * @param preCondition 前置条件
 * @param postProcess 后置处理 入参就是实际调用的入参
 * @returns 
 */
export function applyPreOrPost(preCondition?: Function | string, postProcess?: Function) {
  return function (target: any, property: string, descriptor: PropertyDescriptor) {
    const func: Function = descriptor.value
    if (typeof func !== 'function') {
      throw new Error('debounceDecorator error: are u kidding me ?')
    }
    descriptor.value = async function(...args: any[]) {
      // @ts-expect-error
      if (preCondition === undefined || (typeof preCondition === 'function' && preCondition.apply(this)) || (typeof preCondition === 'string' && this[preCondition])
        ) {
        const res = await func.apply(this, args)
        postProcess?.apply(this, args)
        return res
      }
    }
  }
}

/**
 * 只有装饰方法 执行完了之后 才可以第二次执行
 * @param target 
 * @param property 
 * @param descriptor 
 */
export function PromiseAwait(target: any, property: string, descriptor: PropertyDescriptor) {
  const func: Function = descriptor.value
  let isPromiseFulfilled = true
  descriptor.value = async function(...args:any[]) {
    if (!isPromiseFulfilled) {
      return
    }
    isPromiseFulfilled = false
    const response = await func.apply(this, args)
    isPromiseFulfilled = true
    return response
  }
}

/**
 * PromiseAwait 闭包版本
 * @param func 
 * @returns 
 */
export function promiseAwaitFunc(func: Function) {
  let isPromiseFulfilled = true
  return async function(...args: any[]) {
    if (!isPromiseFulfilled) return
    isPromiseFulfilled = false
    // @ts-expect-error
    const res = await func.apply(this, args)
    isPromiseFulfilled = true
    return res
  }
}

/**
 * 简易的classnames
 * @returns 
 */
export function classnames() {
  var args = Array.prototype.slice.call(arguments)
  var classList: string[] = []
  args.forEach(function(item){
    if (typeof item === 'object') {
      for(var k in item) {
        var kv = item[k]
        if (kv) {
          classList.push(k)
        }
      }
    } else if (typeof item === 'string') {
      classList.push(item)
    }
  })
  return classList.join(' ')
}

/**
 * 获取 n-m之间的 随机数
 * @param {Number} m 
 * @param {Number} n 
 * @returns 
 */
 export function randomNum(m: number, n: number) {
  let max = n
  let min = m
  return Math.floor(Math.random()*(max-min+1))+min
}

export function typeofFunc (t: any) {
  return Object.prototype.toString.call(t).slice(8, -1).toLowerCase()
}