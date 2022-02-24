export type EventsTypes = string

export type EventInfer = {
  type: EventsTypes,
}

export type EventsCallBack = (e?: EventInfer, ...args: any) => void

export type EventsCallBackType = {
  call: EventsCallBack,
  context?: any
}

export type EventsDispatchCenter = {
  [k: EventsTypes]: Array<EventsCallBackType>
}

export interface EventsDispatchClass {
  _events: EventsDispatchCenter,
  event?: EventInfer,
  $on: (type: EventsTypes | Array<EventsTypes>, func: EventsCallBack, context?: any) => void,
  $once: (type: EventsTypes | Array<EventsTypes>, func: EventsCallBack, context?: any) => void,
  $off: (type?: EventsTypes | Array<EventsTypes>, func?: EventsCallBack) => void,
  $emit: (type: EventsTypes | Array<EventsTypes>, event?: EventInfer) => void
}

export function UseEvent(events?: EventsDispatchCenter) {
  return function<T extends { new(...args: any[]): {} }>(Target: T) {
    return class extends Target implements EventsDispatchClass {
      _events: EventsDispatchCenter = events || Object.create(null)
      // event: EventInfer;
      constructor(...args: any) {
        super(...args)
        // this._events = events || Object.create(null)
      }
  
      $on(type: EventsTypes | Array<EventsTypes>, func: EventsCallBack, context?: any) {
        if (Array.isArray(type)) {
          type.map(t => {
            this.$on(t, func, context)
          })
        } else {
          (this._events[type] || (this._events[type] = [])).push({
            call: func,
            context: context
          })
        }
      }
  
      $once(type: EventsTypes | EventsTypes[], func: EventsCallBack, context?: any) {
        const on = () => {
          this.$off(type, on)
          // @ts-ignore
          func.apply(context, arguments)
        }
        this.$on(type, on)
        return this
      }
  
      $off (type?: EventsTypes | EventsTypes[] | undefined, func?: EventsCallBack | undefined) {
        if (!type) {
          // 这里 需要需要修改用 delete
          // this._events = Object.create(null)
          for (let k in this._events) {
            delete this._events[k]
          }
          return this
        }
        if (Array.isArray(type)) {
          type.map(t => {
            this.$off(t, func)
          })
          return this
        }
        const cbs = this._events[type]
        if (!cbs || !cbs.length) {
          return this
        }
        if (!func) {
          this._events[type] = []
          return this
        }
        let i = cbs.length
        while(i--) {
          const cb = cbs[i]
          if (cb.call === func) {
            cbs.splice(i, 1)
            break
          }
        }
        return this
      }
  
      $emit(type: EventsTypes | EventsTypes[], event?: EventInfer)  {
        const args = [].slice.call(arguments, 1);
        if (Array.isArray(type)) {
          type.map(t => {
            this.$emit(t, ...args)
          })
          return this
        }
        const cbs = this._events[type]
        if (cbs && cbs.length) {
          cbs.map((item: EventsCallBackType) => {
            const _this = item.context || this
            item.call.apply(_this, args)
          })
        }
      }
    }
  }
}

