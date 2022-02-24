/**
 * title: 新手引导
 * desc: 
 */

import React from "react";
import { NewGuide } from "@lightfish/tools";
import '../newGuy.less'

export default class NewGuy extends React.Component {
  componentDidMount() {
    const GuideIns = new NewGuide(0, 3)
    GuideIns.focusDomList([
      {
        ele: document.querySelector('#t1')!,
        events: {
          click: {
            isStopPropagation: true,
            handler() {
              console.log('??')
              setTimeout(() => {
                GuideIns.focusDomList([
                  {
                    ele: document.querySelector('#t0')!
                  }
                ], true)
              })
            }
          }
        }
      }
    ])

  }

  render() {
    return (
      <div className="guy">
        {
          Array(20).fill(1).map((item, index) => {
            return (
              <div id={`t${index}`} key={`item${index}`} style={{
                backgroundColor: index < 1 ? 'red' : 'blue'
              }} onClick={() => {
                console.log(index)
              }}>{index}</div>
            )
          })
        }
      </div>
    )
  }
}