/**
 * 简单的栈
 */
 export class Stack<T> {
  private items: T[]
  constructor() {
    this.items = [];
  }

  /**
   * 入栈
   * @param {*} item 
   */
  push(item: T) {
    this.items.push(item)
  }

  /**
   * 出栈
   * @returns item
   */
  pop(): T | undefined {
    return this.items.pop()
  }

  /**
   * 获取栈顶数据
   * @returns item
   */
  top() {
    return this.items[this.items.length - 1]
  }

  /**
   * 获取栈的大小
   * @returns 
   */
  size() {
    return this.items.length
  }

  /**
   * 判断当前栈是否为空
   * @returns boolean
   */
  isEmpty() {
    return this.items.length === 0
  }
}

/**
 * 队列
 */
export class Queue<T > {
  private items: T[]
  constructor() {
    // 存储数据
    this.items = [];
  }

  enqueue(item: T) {
    // 入队
    this.items.push(item);
  }

  dequeue(): T | undefined {
    // 出队
    return this.items.shift();
  }

  head() {
    // 获取队首的元素
    return this.items[0];
  }

  tail() {
    // 获取队尾的元素
    return this.items[this.items.length - 1];
  }

  clear() {
    // 清空队列
    this.items = [];
  }

  size() {
    // 获取队列的长度
    return this.items.length;
  }

  isEmpty() {
    // 判断队列是否为空
    return this.items.length === 0;
  }
}

/**
 * 简单的一个链表节点
 */
export class Node {
  value: any
  next: any

  constructor(value:any, next=null) {
    this.value = value
    this.next = next
  }
}

/**
 * 单向链表
 */
export class SingleNodeList {
  head: Node | null //头节点
  constructor(value?: any) {
    this.head = value ? new Node(value) : null
  }

  /**
   * 查找对应的链表节点, 一般的链表遍历就用 while吧
   * @param value 
   */
  findNode(value: any) {
    let currNode = this.head
    while(currNode && currNode.value !== value) {
      currNode = currNode.next
    }
    // currNode Maybe the last for null
    if (!currNode) return null
    return currNode
  }

  /**
   * 插入元素到 链表中的哪一个
   * @param value 插入元素
   * @param newValue 被插入元素
   */
  insertAfter(value:any, newValue:any) {
    const currNode = this.findNode(value)
    if (!currNode) {
      throw new Error('no match item for '+value)
    }
    const targetNode = new Node(newValue)
    targetNode.next = currNode.next
    currNode.next = targetNode
  }

  /**
   * 向单向链表插入元素
   * @param value 插入元素
   */
  append(value:any) {
    const newNode = new Node(value)
    let currNode = this.head
    if (!currNode) {
      this.head = newNode
      return
    }
    while(currNode!.next) { // 找尾结点
      currNode = currNode!.next
    }
    currNode!.next = newNode
  }

  /**
   * 向单向链表 头元素前插入
   * @param value 插入元素
   */
  prepend(value: any) {
    const newNode = new Node(value)
    if (!this.head) {
      this.head = newNode
      return
    }
    newNode.next = this.head
    this.head = newNode
  }
  
  /**
   * 清空
   */
  empty() {
    this.head = null
  }

  /**
   * 清除单向链表的 某个节点
   * @param value 
   * @returns 
   */
  remove(value: any) {
    let currNode = this.head
    if (!currNode) {
      return
    }
    let previousNode = null // 当前节点的前置节点
    while(currNode && currNode.value !== value) {
      previousNode = currNode
      currNode = currNode.next
    }
    if (!currNode) {
      throw new Error('no match item')
    } else if (!previousNode) {// 头结点
      this.head = currNode.next
    } else {
      previousNode.next = currNode.next
    }

  }

  /**
   * 清除头元素
   * @returns 
   */
  removeHead() {
    if (!this.head) return
    this.head = this.head.next
  }

  /**
   * 清除尾元素
   */
  removeTail() {
    if (!this.head) return
    let currNode = this.head // 用当前节点来找 尾结点
    let previousNode = null // 前置节点
    while(currNode.next) { // 找尾结点
      previousNode = currNode
      currNode = currNode.next
    }
    // 没有前置节点
    if (currNode === this.head) {
      this.head = null
    } else {
      previousNode!.next = null
    }
  }

  /**
   * 简单的遍历
   * @param func 
   */
  traverse(func: Function) {
    if (!this.head) return
    let currNode = this.head
    while(currNode) {
      func(currNode.value)
      currNode = currNode.next
    }
  }
}


// 双向链表
export class LoopNodeList {
  head: Node | null
  constructor(value?: any) {
    this.head = value ? new Node(value) : null
  }

  findNode(value: any) {
    let currNode = this.head
    while(currNode && currNode.value !== value) {
      currNode = currNode.next
      // 重新到头
      if (currNode === this.head) {
        return null
      }
    }
    if (!currNode) return null
    return currNode
  }

  insertAfter(value: any, newValue:any) {
    const currNode = this.findNode(value)
    if (!currNode) {
      throw new Error('not mactch item' + value)
    }
    const newNode = new Node(newValue)
    newNode.next = currNode.next
    currNode.next = newNode
  }

  /**
   * 设置尾结点
   * @param value 
   * @param loop 是否设置成循环链表
   */
  setTail(value: any, loop: boolean = true) {
    const node = this.findNode(value)
    node && (node.next = loop ? this.head : null)
  }

  /**
   * 添加元素
   * @param {*} value 
   * @param {*} isTail 是否是尾节点
   */
  append(value: any, isTail: boolean=false) {
    const newNode = new Node(value)
    let currNode = this.head

    // 如果没有头元素
    if (!currNode) {
      this.head = newNode
      return
    }
    while(currNode!.next && currNode!.next !== this.head) {
      currNode = currNode!.next
    }
    currNode!.next = newNode
    if (isTail) {
      newNode.next = this.head
    }
  }

  prepend(value: any) {
    const newNode = new Node(value)
    newNode.next = this.head
    this.head = newNode
  }

  empty() {
    this.head = null
  }

  remove(value:any) {
    let currNode = this.head
    let previousNode = null

    while(currNode && currNode.value !== value) {
      previousNode = currNode
      currNode = currNode.next

      // 重新到头
      if (currNode === this.head) {
        return null
      }
    }

    if (!currNode) {
      throw new Error('not mactch item ' + value)
    } else if (!previousNode) {
      this.head = currNode.next
    } else {
      previousNode.next = currNode.next
    }
  }

  size() {
    let count = 0
    let currNode = this.head
    if (currNode) {
      count ++
    } else {
      return 0
    }
    while(currNode && currNode.next && currNode.next !== this.head) {
      count++
      currNode = currNode.next
    }
    return count
  }

  removeHead() {
    if (!this.head) return
    this.head = this.head.next
  }

  removeTail() {
    // TODO
  }

  traverse(cb: Function) {
    let currNode = this.head

    // 如果没有头元素
    if (!currNode) {
      return
    }
    while(currNode && currNode.next !== this.head) {
      cb && cb(currNode.value)
      currNode = currNode.next
    }
    cb(currNode)
  }
}