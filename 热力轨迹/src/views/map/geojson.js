export default class GeoJson {

  static RSSIColors = [
    '#21cc3d',
    '#5fe20d',
    '#b1ed0f',
    '#dced0f',
    '#feda0f',
    '#fca800',
    '#fc5500',
    '#e2312b',
    '#b30600',
    '#800400',
  ]

  static SNRColors = [
    '#800400',
    '#e2312b',
    '#fca800',
    '#feda0f',
    '#dced0f',
    '#b1ed0f',
    '#5fe20d',
    '#21cc3d',
  ]

  static TAMColors = [
    '#21cc3d',
    '#5fe20d',
    '#b1ed0f',
    '#dced0f',
    '#feda0f',
    '#fca800',
    '#fc5500',
    '#e2312b',
    '#b30600',
    '#800400',
  ]

  static FLOWColors = [
    '#21cc3d',
    '#5fe20d',
    '#b1ed0f',
    '#dced0f',
    '#feda0f',
    '#fca800',
    '#fc5500',
    '#e2312b',
    '#b30600',
    '#800400',
  ]

  static Type = {
    Unuse: 0,
    RSSI: 1,
    SNR: 2,
    TAM: 3,
    FLOW: 4,
  }

  /*
   * @description 百花山经纬度
   */
  static bhsPoint = [
    115.61062058,
    39.85622248,
  ]

  static arrowNum = 0

  static defaultColor = '#21cc3d'

  /**
   * The mean Earth radius (1/3 * (2a + b)) for the WGS84 ellipsoid.
   * https://en.wikipedia.org/wiki/Earth_radius#Mean_radius
   * @type {number}
   */
  static DEFAULT_RADIUS = 6371008.8

  /**
   * 从60km/h时速1秒内提升到120km/h
   */
  static dx = 100

  static dt = 50

  static toFixed(n, len) {

    if (String(n).indexOf('.') > 0 && String(n).substr(String(n).indexOf('.') + 1).length > len) {

      return n.toFixed(len)

    }

    return n

  }

  /**
   * @description 计算两点间距离
   * @param { Array } c1
   * @param { Array } c2
   * @param { Number } radius
   * @returns { Number }
   */
  static distance(c1, c2, radius) {

    radius = radius || GeoJson.DEFAULT_RADIUS
    const lat1 = GeoJson.degreeToRadian(c1[1])
    const lat2 = GeoJson.degreeToRadian(c2[1])
    const deltaLatBy2 = (lat2 - lat1) / 2
    const deltaLonBy2 = GeoJson.degreeToRadian(c2[0] - c1[0]) / 2
    const a = Math.sin(deltaLatBy2) * Math.sin(deltaLatBy2)
      + Math.sin(deltaLonBy2)
      * Math.sin(deltaLonBy2)
      * Math.cos(lat1)
      * Math.cos(lat2)

    return 2 * radius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  }

  /**
   * @description 时间差，单位秒
   * @param { any } start
   * @param { any } end
   * @returns { Number }
   */
  static deltaTime(start, end) {

    const delta = new Date(end && end.indexOf('-') === -1 ? `2024-09-25 ${end}` : end).getTime() - new Date(start && start.indexOf('-') === -1 ? `2024-09-25 ${start}` : start).getTime()

    return Math.floor(delta / 1000)

  }

  /**
   * @description 弧度转角度
   * @param { Number } radian
   * @returns { Number }
   */
  static radianToDegree(radian) {

    return radian * 180 / Math.PI

  }

  /**
   * @description 角度转弧度
   * @param { Number } degree
   * @returns
   */
  static degreeToRadian(degree) {

    return Math.PI * degree / 180

  }

  /**
   * @description 计算两点间弧度
   * @param { Array } p1
   * @param { Array } p2
   * @returns { Number }
   */
  static rotation([
    x1,
    y1,
  ] = [], [
    x2,
    y2,
  ] = []) {

    const dg = GeoJson.radianToDegree(Math.atan2(y2 - y1, x2 - x1))

    // dg = (90 + dg) % 360
    return GeoJson.degreeToRadian(-dg)

  }

  static formatSNRColor(value) {

    if (value === null || value === undefined) {

      return GeoJson.defaultColor

    }
    if (value >= 28) {

      return GeoJson.SNRColors[7]

    }
    if (value >= 23 && value < 28) {

      return GeoJson.SNRColors[6]

    }
    if (value >= 18 && value < 23) {

      return GeoJson.SNRColors[5]

    }
    if (value >= 13 && value < 18) {

      return GeoJson.SNRColors[4]

    }
    if (value >= 8 && value < 13) {

      return GeoJson.SNRColors[3]

    }
    if (value >= 3 && value < 8) {

      return GeoJson.SNRColors[2]

    }
    if (value >= -2 && value < 3) {

      return GeoJson.SNRColors[1]

    }

    return GeoJson.SNRColors[0]

  }

  static formatRSSIColor(value) {

    if (value === null || value === undefined) {

      return GeoJson.defaultColor

    }
    if (value >= -55) {

      return GeoJson.RSSIColors[9]

    }
    if (value >= -60 && value < -55) {

      return GeoJson.RSSIColors[8]

    }
    if (value >= -65 && value < -60) {

      return GeoJson.RSSIColors[7]

    }
    if (value >= -70 && value < -65) {

      return GeoJson.RSSIColors[6]

    }
    if (value >= -75 && value < -70) {

      return GeoJson.RSSIColors[5]

    }
    if (value >= -80 && value < -75) {

      return GeoJson.RSSIColors[4]

    }
    if (value >= -85 && value < -80) {

      return GeoJson.RSSIColors[3]

    }
    if (value >= -90 && value < -85) {

      return GeoJson.RSSIColors[2]

    }
    if (value >= -95 && value < -90) {

      return GeoJson.RSSIColors[1]

    }

    return GeoJson.RSSIColors[0]

    // return GeoJson.RSSIColors[Math.floor((100+value)/5)]

  }

  static formatTAMColor(value) {

    if (value === null || value === undefined) {

      return GeoJson.defaultColor

    }
    if (value >= 900) {

      return GeoJson.TAMColors[9]

    }
    if (value >= 800 && value < 900) {

      return GeoJson.TAMColors[8]

    }
    if (value >= 700 && value < 800) {

      return GeoJson.TAMColors[7]

    }
    if (value >= 600 && value < 700) {

      return GeoJson.TAMColors[6]

    }
    if (value >= 500 && value < 600) {

      return GeoJson.TAMColors[5]

    }
    if (value >= 400 && value < 500) {

      return GeoJson.TAMColors[4]

    }
    if (value >= 300 && value < 400) {

      return GeoJson.TAMColors[3]

    }
    if (value >= 200 && value < 300) {

      return GeoJson.TAMColors[2]

    }
    if (value >= 100 && value < 200) {

      return GeoJson.TAMColors[1]

    }

    return GeoJson.TAMColors[0]

  }

  static formatFLOWColor(value) {

    if (value === null || value === undefined) {

      return GeoJson.defaultColor

    }
    if (value >= 90) {

      return GeoJson.FLOWColors[9]

    }
    if (value >= 80 && value < 90) {

      return GeoJson.FLOWColors[8]

    }
    if (value >= 70 && value < 80) {

      return GeoJson.FLOWColors[7]

    }
    if (value >= 60 && value < 70) {

      return GeoJson.FLOWColors[6]

    }
    if (value >= 50 && value < 60) {

      return GeoJson.FLOWColors[5]

    }
    if (value >= 40 && value < 50) {

      return GeoJson.FLOWColors[4]

    }
    if (value >= 30 && value < 40) {

      return GeoJson.FLOWColors[3]

    }
    if (value >= 20 && value < 30) {

      return GeoJson.FLOWColors[2]

    }
    if (value >= 10 && value < 20) {

      return GeoJson.FLOWColors[1]

    }

    return GeoJson.FLOWColors[0]

  }

  /**
   * 计算斜率
   * @param { Array } param0
   * @param { Array } param1
   * @returns { Number }
   */
  static slope([
    x1,
    y1,
  ] = p1, [
    x2,
    y2,
  ] = p2) {

    const dy = y2 - y1
    const dx = x2 - x1

    if (dy === 0) {

      return 0

    }

    if (dx === 0) {

      return 1

    }

    return dy / dx

  }

  /**
   * @description 建立新图元
   * @param { Object } from
   * @param { Object } to
   * @returns { Object }
   */
  static newLineFeature(from, to, channel) {

    let stroke = ''
    if (!from.lnglat) {

      from.lnglat = [
        Number(from.longitude),
        Number(from.latitude),
      ]

    }
    if (!to.lnglat) {

      to.lnglat = [
        Number(to.longitude),
        Number(to.latitude),
      ]

    }
    if (channel === GeoJson.Type.RSSI) {

      // if (to.rssi) {

      //   stroke = GeoJson.formatRSSIColor(to.rssi)

      // } else {

      //   stroke = GeoJson.formatRSSIColor(to.value)

      // }
      stroke = GeoJson.formatRSSIColor(to.rssi)

    } else if (channel === GeoJson.Type.SNR) {

      // if (to.snr) {

      //   stroke = GeoJson.formatSNRColor(to.snr)

      // } else {

      //   stroke = GeoJson.formatSNRColor(to.value)

      // }
      stroke = GeoJson.formatSNRColor(to.snr)

    } else if (channel === GeoJson.Type.TAM) {

      stroke = GeoJson.formatTAMColor(to.distanceDiffAbs)

    } else if (channel === GeoJson.Type.FLOW) {

      stroke = GeoJson.formatFLOWColor(to.flow)

    }

    const feature = [
      {
        type: 'Feature',
        properties: {
          stroke,
          channel,
          data: to,
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            from.lnglat,
            to.lnglat,
          ],
        },
      },
    ]
    if (GeoJson.arrowNum === 0) {

      feature.push({
        type: 'Feature',
        properties: {
          stroke,
          rotation: GeoJson.rotation(from.lnglat, to.lnglat),
          channel,
          data: to,
        },
        geometry: {
          type: 'Point',
          coordinates: to.lnglat,
        },
      })

    }
    GeoJson.arrowNum += 1
    if (GeoJson.arrowNum === 100) {

      GeoJson.arrowNum = 0

    }

    return feature

  }

  /**
   * @description 比较两个坐标
   * @param { Array } param0
   * @param { Array } param1
   * @returns { Boolean }
   */
  static isEqualCoordinate([
    x1,
    y1,
  ] = p1, [
    x2,
    y2,
  ] = p2) {

    return x1 === x2 && y1 === y2

  }

  /**
   * 生成热力图数据，根据时间和距离拆分成多段数据：两点间 > 30米，时间 > 5秒
   * @param { Array } data
   * @returns { Array }
   */
  static features(source = [], channel) {

    let normals = []
    const data = []
    let prev = null

    for (let i = 0, len = source.length; i < len; i++) {

      const node = source[i]
      if (!node.lnglat) {

        node.lnglat = [
          Number(node.longitude),
          Number(node.latitude),
        ]

      }
      node.distance = GeoJson.toFixed(GeoJson.distance(node.lnglat, GeoJson.bhsPoint), 1)
      node.distanceDiff = node.ta_m && node.distance ? GeoJson.toFixed(Number(node.distance) - Number(node.ta_m || 0), 1) : null
      node.distanceDiffAbs = node.distanceDiff !== null && node.distanceDiff !== undefined ? Math.abs(node.distanceDiff) : null
      if (prev) {

        if (GeoJson.isEqualCoordinate(prev.lnglat, node.lnglat)) {

          continue

        } else {

          normals[normals.length - 1].push(node)

          /*
           * const distance = GeoJson.distance(prev.lnglat, node.lnglat)
           * const delta = GeoJson.deltaTime(prev.timeStamp, node.timeStamp)
           */

          // if (delta < GeoJson.dt && distance < GeoJson.dx) {

          //   normals[normals.length - 1].push(node)

          // } else {

          //   normals.push([node])

          // }

        }

      } else {

        normals.push([node])

      }
      prev = node

    }

    prev = null
    for (let j = 0, jen = normals.length; j < jen; j++) {

      const nodes = normals[j]
      for (let k = 0, ken = nodes.length; k < ken; k++) {

        const item = nodes[k]
        if (prev) {

          data.push(...GeoJson.newLineFeature(prev, item, channel))

        }
        prev = item

      }
      prev = null

    }

    normals = []

    return data

  }


  /**
   * @description 不过滤、不分段生成热力图数据
   * @param { Array } source
   * @param { Number } channel
   * @returns { Array }
   */
  static createFeature(source = [], channel) {

    const fs = []
    let prevNode = null

    for (let i = 0, len = source.length; i < len; i++) {

      const current = source[i]
      if (!current.lnglat) {

        current.lnglat = [
          Number(current.longitude),
          Number(current.latitude),
        ]

      }
      current.distance = GeoJson.toFixed(GeoJson.distance(current.lnglat, GeoJson.bhsPoint), 1)
      current.distanceDiff = current.ta_m && current.distance ? GeoJson.toFixed(Number(current.distance) - Number(current.ta_m || 0), 1) : null
      current.distanceDiffAbs = current.distanceDiff !== null && current.distanceDiff !== undefined ? Math.abs(current.distanceDiff) : null
      if (prevNode) {

        /**
         * 相同经纬度就只保留一个
         */
        if (GeoJson.isEqualCoordinate(prevNode.lnglat, current.lnglat)) {

          continue

        } else {

          fs.push(GeoJson.newLineFeature(prevNode, current, channel))

        }

      }
      prevNode = current

    }

    return fs

  }

  /**
   * @description 生成GeoJSON
   * @param { Object } node
   * @returns { Object }
   */
  static json(data = [], channel = GeoJson.Type.RSSI, filter = true) {

    const features = filter ? GeoJson.features(data, channel) : GeoJson.createFeature(data, channel)

    return {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: { projection: 'EPSG:4326' },
      },
      features,
    }

  }

}
