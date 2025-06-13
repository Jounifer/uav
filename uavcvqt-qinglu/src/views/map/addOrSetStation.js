import { Feature } from 'ol'
import { Point } from 'ol/geom'
import { customCodes } from './gisconfig'

export default function addOrSetStation(node, opt, square, vector) {

  const {
    longitude, latitude, id, nodeName, style, nodeCode,
  } = node
  const station = vector.getFeatureById(id)
  if (longitude && latitude) {

    const pt = [
      longitude,
      latitude,
    ]
    const hasOffset = customCodes.indexOf(nodeCode) > -1
    if (!station) {

      const feature = new Feature({
        geometry: new Point(pt),
        name: nodeName,
        data: node,
        style,
        hasOffset,
        ...opt,
      })
      feature.setId(id)
      vector.addFeature(feature)

    } else {

      const state = square.get('state')
      const nodeId = square.get('nodeId')
      if (state && nodeId === id) {

        square.setProperties({ geometry: new Point(pt) })

      }
      station.setProperties({
        geometry: new Point(pt),
        name: nodeName,
        data: node,
        hasOffset,
        ...opt,
      })

    }

  } else if (station) {

    vector.removeFeature(station)

  }

}
