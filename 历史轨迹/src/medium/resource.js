/**
 * 流信息、业务处理类
 */
export default class Resource {

  constructor() {

    this.data = []
    this.defaultIp = '255.255.255.255'

  }

  /**
   * @method formatParam
   * @param { Any } param
   * @returns { Object }
   * @description 参数格式化
   */
  static formatParam(param) {

    const def = {
      resolution: {
        width: 1920,
        height: 1080,
      },
    }

    if (Object.prototype.toString.call(param) === '[object Object]') {

      return {
        ...param,
        ...def,
      }

    }

    return def

  }

  /**
   * @method getStreamIp
   * @param { String } str
   * @returns { String }
   * @description 取出流地址中的IP地址
   */
  static getStreamIp(str) {

    const data = String(str).match(/@(.+?):/)

    return data ? data[1] : null

  }

  /**
   * @method formatStreamId
   * @param { String } ip 流地址IP
   * @param { Number } index 序号
   * @returns { String }
   * @description 将IP地址转换为数值并在前面加上序号作为流ID
   */
  static formatStreamId(ip, index) {

    if (ip) {

      const str = String(ip).split('.')
        .map((n) => Number(n))
      const id = ((str[0] << 24) | (str[1] << 16) | (str[2] << 8) | str[3]) >>> 0

      return `${index}-${id}`

    }

    return null

  }

  /**
   * @method coefficient
   * @param { Number } total
   * @returns { Number }
   * @description 根据总数计算网格布局
   */
  static coefficient(total) {

    return Math.ceil(Math.sqrt(total))

  }

  /**
   * @method indexToPos
   * @param { Number } index 索引值
   * @param { Number } total 总数
   * @return { Object }
   * @description 索引值转换为网格坐标值
   * @example { 1, 2, 3, 4, 5, 6, 7, 8, 9} =>
   * | 00 | 01 | 02 |
   * | 10 | 11 | 12 |
   * | 20 | 21 | 22 |
   */
  static indexToArea(index, total) {

    const c = Resource.coefficient(total)
    const pos = index - 1

    return {
      width: `1/${c}`,
      height: `1/${c}`,
      top: `${Math.floor(pos / c)}/${c}`,
      left: `${pos % c}/${c}`,
    }

  }

  /**
   * @method posToIndex
   * @param { Number } row 行坐标
   * @param { Number } col 列坐标
   * @param { Number } span 列高3*3网格则为3
   * @returns { Number }
   * @description 网格坐标转换为索引值
   * @example
   * | 00 | 01 | 02 |
   * | 10 | 11 | 12 | => {1,2,3,4,5,6,7,8,9}
   * | 20 | 21 | 22 |
   */
  static posToIndex(row, col, span) {

    return col * span + row + 1

  }

  /**
   * @method formatRegion
   * @param { String } stream
   * @param { Number } index
   * @param { Number } total
   * @returns { Object }
   * @description 格式化流信息
   */
  static formatRegion(stream, index, total) {

    if (stream && index && total) {

      return {
        region: {
          id: String(index),
          area: Resource.indexToArea(index, total),
          shape: 'rectangle',
        },
        stream,
      }

    }

    return null

  }

  /**
   * @method sort
   * @param { Array } data
   * @returns { Array }
   * @description layout信息排序
   */
  static sort(data = []) {

    const len = data.length
    let temp = null
    for (let i = 0, j = i + 1; j < len; j++, i++) {

      const pre = data[i]
      const next = data[j]
      if (Number(pre.region.id) > Number(next.region.id)) {

        temp = pre
        data[i] = next
        data[j] = temp

      }

    }

    return data

  }

  static get state() {

    return {
      Default: 0,
      Success: 1,
      Failed: 2,
    }

  }

  isFinished() {

    return this.data.every((n) => n.pull > Resource.state.Default)

  }

  /**
   * @method load
   * @param { Array } data
   */
  load(data = []) {

    this.data = data.map((node, index) => {

      node.stream = Resource.formatStreamId(Resource.getStreamIp(node.main), index)
      node.index = index
      node.sid = Resource.formatStreamId(this.defaultIp, index)
      node.pos = Number(node.pos)
      node.pull = Resource.state.Default

      return node

    })

  }

  /**
   * @method getData
   * @returns { Array }
   */
  getData() {

    const [...data] = this.data

    return data

  }

  /**
   * @method setItem
   * @param { String } stream
   * @param { Object } data
   */
  setItem(stream, data = {}) {

    let node = this.data.find((n) => n.stream === stream)
    if (node) {

      const index = this.data.findIndex((n) => n.stream === stream)
      node = Object.assign(node, data)
      this.data.splice(index, 1, node)

    }

  }

  /**
   * @method formatLayout
   * @returns { Array }
   */
  formatLayout() {

    const layouts = []
    this.data.map((node) => {

      const stream = node.pull ? node.stream : node.sid
      const region = Resource.formatRegion(stream, node.pos, this.data.length)
      if (region) {

        layouts.push(region)

      }

      return node

    })

    return Resource.sort(layouts)

  }

}
