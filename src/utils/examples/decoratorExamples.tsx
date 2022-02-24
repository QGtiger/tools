/**
 * title: 装饰器的简单应用
 * desc: Promise
 */

import React from "react";
import { applyPreOrPost, PromiseAwait } from '@lightfish/tools'

export default class extends React.Component {
  flag = true

  @PromiseAwait
  log1() {
    return new Promise<void>(r => {
      setTimeout(() => {
        r()
        console.log('log1')
      }, 1000)
    })
  }

  log2() {
    return new Promise<void>(r => {
      setTimeout(() => {
        r()
        console.log('log2')
      }, 1000)
    })
  }

  @applyPreOrPost(() => {
    return Math.random() > 0.4
  })
  log3() {
    console.log('log3')
  }

  render() {
    return (
      <div className="decorator-cont">
        <button onClick={this.log1}>log1</button>
        <button onClick={this.log2}>log2</button>
        <button onClick={this.log3}>log3</button>
      </div>
    )
  }
}