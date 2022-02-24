/**
 * title: 动画
 * desc: 动画工厂
 */

import React from "react";
import { AniFactory } from "@lightfish/tools";

export default class extends React.Component {
  aniIns?: AniFactory
  aniCont?: HTMLDivElement
  showAni = (isStart: boolean) => {
    if (!this.aniCont) return
    if (!this.aniIns) {
      this.aniIns = new AniFactory(this.aniCont)
    }
    const aniInvoke = isStart ? 'showAni' : 'hideAni'
    this.aniIns[aniInvoke](() => {
      console.log(aniInvoke + '完成')
    }, {
      aniName: (document.querySelector('#animationSelect') as HTMLSelectElement).value,
      aniType: 'transition'
    })
  }

  render() {
    return (
      <div>
        <p className="animation-cont" ref={el => {
          if (el) {
            this.aniCont = el
          }
        }}>animation</p>
        <select name="animation" id="animationSelect">
          <option value="fade-in-linear">fade-in-linear</option>
          <option value="slide-top">slide-top</option>
          <option value="scale-in-center">scale-in-center</option>
        </select>
        <button onClick={() => this.showAni(true)}>开始动画</button>
        <button onClick={() => this.showAni(false)}>结束动画</button>
      </div>
    )
  }
}