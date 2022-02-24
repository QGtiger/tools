/**
 * title: debouce
 * desc: 简单的一个 函数防抖，应用场景 下拉刷新 TODO 
 * 注意下面的 persist 方法，因为我这边的 的 debounce 方法是 用setTimeout 方法 去执行的，而这里的用的其实是 React
 * 的合成时间，事件对象会销毁的的，需要用 presist 方法，让它 “滞留下”
 * 当然你可以用 原生的 addEventListener 记得remove
 */

import React from "react";
import { debounce, debounceDecorator, throttleDecorator } from '@lightfish/tools'

interface StateInfer {
  tableData: number[],
  pageIndex: number,
  pageSize: number,
  tableLoading: boolean
}

export default class DebounceScrollPage extends React.Component {
  state: StateInfer = {
    pageIndex: 1,
    pageSize: 10,
    tableData: [],
    tableLoading: false
  }

  constructor(props: any) {
    super(props)
  }

  componentDidMount() {
    this.onGetScrollData()
  }

  @debounceDecorator(1000)
  debounceTest() {
    alert('debouce success')
  }

  @throttleDecorator(1000)
  throttleTest() {
    console.log('throttle')
  }

  onDebounceBottomSroll = debounce((e: any) => {
    const taret = e.target
    const { scrollHeight, offsetHeight, scrollTop } = taret
    const h = scrollHeight - scrollTop - offsetHeight
    console.log(h)
    if (h < 20) {
      this.setState({
        pageIndex: ++this.state.pageIndex
      }, () => {
        this.onGetScrollData()
      })
    }
  }, 400)

  componentWillUnmount() {
    this.onDebounceBottomSroll.cancel()
    // @ts-expect-error
    this.debounceTest.cancel()
  }

  onGetScrollData() {
    const { pageIndex, pageSize, tableData } = this.state
    this.setState({
      tableData: tableData.concat(Array.from(Array(pageSize), (_, index) => {
        return (pageIndex - 1) * pageSize + index
      }))
    })
  }

  render() {
    const { tableData } = this.state
    return (
      <div className="debounce-scroll-page">
        <div className="table-list-cont" style={{
          height: '300px',
          overflow: 'scroll'
        }}
        onClick={this.debounceTest}
        onScroll={(e) => {
          e.persist();
          this.onDebounceBottomSroll(e)
        }}>
          {
            tableData.map((item, index) => {
              return (
                <p className="table-item-cont" key={`item${index}`}>{item}</p>
              )
            })
          }
        </div>
      </div>
    )
  }
}