/**
 * @description 小无人机分组
 */

export default class Group {

  static radius(p1, p2) {

    const a = p1[0] - p2[0]
    const b = p1[1] - p2[1]
    const r = Math.sqrt(a * a + b * b)

    return r > 0 ? r : 0.0002

  }

  static point(center, radius, index) {

    const x = center[0] + radius * Math.cos(index)
    const y = center[1] + radius * Math.sin(index)

    return [
      x,
      y,
    ]

  }

  static distance(p1, p2) {

    const a = p1[0] - p2[0]
    const b = p1[1] - p2[1]

    return a * a + b * b

  }

  static coordinate(center = [], target = []) {

    let x = 0
    let y = 0
    const radius = Group.radius(center, target)
    let d1 = Group.distance(Group.point(center, radius, 0), target)
    for (let i = 0; i < 360; i++) {

      const [
        px,
        py,
      ] = Group.point(center, radius, i)

      // const d1 = Group.distance([x, y], target)
      const d2 = Group.distance([
        px,
        py,
      ], target)
      if (d2 < d1) {

        d1 = d2
        x = px
        y = py

      }

    }

    return [
      x,
      y,
    ]

  }

  static points(center = [], target = []) {

    const p = []
    const radius = Group.radius(center, target)
    for (let i = 0; i < 360; i++) {

      p.push(Group.point(center, radius, i))

    }

    return p

  }

  static getBounds(data = []) {

    if (data.length === 0) {

      return [
        0,
        0,
        0,
        0,
      ]

    }
    const [
      lng,
      lat,
    ] = data[0].lngLat
    let minLng = lng
    let maxLng = lng
    let minLat = lat
    let maxLat = lat
    for (let i = 0, len = data.length; i < len; i++) {

      const [
        nLng,
        nLat,
      ] = data[i].lngLat
      maxLng = nLng > maxLng ? nLng : maxLng
      minLng = nLng < minLng ? nLng : minLng
      maxLat = nLat > maxLat ? nLat : maxLat
      minLat = nLat < minLat ? nLat : minLat

    }

    return [
      minLng - 0.00002,
      minLat - 0.00002,
      maxLng + 0.00002,
      maxLat + 0.00002,
    ]

  }

  static getCenter(extent = []) {

    return [
      (extent[0] + extent[2]) / 2,
      (extent[1] + extent[3]) / 2,
    ]

  }

  static hasNode(data = [], id) {

    return !!data.find((n) => n.id === id)

  }

}
