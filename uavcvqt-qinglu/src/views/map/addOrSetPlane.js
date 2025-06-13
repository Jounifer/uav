import { Feature } from 'ol'
import { Point } from 'ol/geom'
import { degreeToRadian } from '@/utils'
import addOrSetTrack from './addOrSetTrack'

export default function addOrSetPlane(node, opt, square, track, vector) {

  const {
    state, longitude, latitude, id, nodeName, nodeCode, angleZ, style, normal, treeLevel,
  } = node
  const plane = vector.getFeatureById(id)
  if (state !== 4 && longitude && latitude) {

    const pt = [
      longitude,
      latitude,
    ]
    const rotation = angleZ || 0
    if (!plane) {

      const properties = {
        geometry: new Point(pt),
        name: nodeName,
        code: nodeCode,
        rotation: degreeToRadian(rotation),
        data: node,
        style,
        trackStatus: [],
        ...opt,
      }
      if (treeLevel === '5') {

        properties.flush = false

      }
      const feature = new Feature(properties)
      feature.setId(id)
      vector.addFeature(feature)

    } else {

      const state = square.get('state')
      const nodeId = square.get('nodeId')
      const trackStatus = plane.get('trackStatus')

      // 更新节点高亮框的位置
      if (state && nodeId === id) {

        square.setProperties({ geometry: new Point(pt) })

      }

      // 存储轨迹异常记录
      if (normal !== null && style.enTrack && (trackStatus.length === 0 || normal !== trackStatus[trackStatus.length - 1])) {

        trackStatus.push(normal)

      }
      node.trackStatus = trackStatus

      // 更新节点数据
      const properties = {
        geometry: new Point(pt),
        name: nodeName,
        rotation: degreeToRadian(rotation),
        data: node,
        trackStatus,
        ...opt,
      }
      if (treeLevel === '5') {

        properties.flush = plane.get('flush')

      }
      plane.setProperties(properties)

      addOrSetTrack(node, plane, track)

    }

  } else if (plane) {

    vector.removeFeature(plane)

  }

}
