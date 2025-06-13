import { Feature } from 'ol'
import { Point } from 'ol/geom'

export default function addOrSetBeacon(node, opt, square, vector) {

  const {
    longitude, latitude, id, nodeName, style,
  } = node
  const beacon = vector.getFeatureById(id)
  if (longitude && latitude) {

    const pt = [
      longitude,
      latitude,
    ]
    if (!beacon) {

      const feature = new Feature({
        geometry: new Point(pt),
        name: nodeName,
        data: node,
        style,
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
      beacon.setProperties({
        geometry: new Point(pt),
        name: nodeName,
        data: node,
        ...opt,
      })

    }

  } else if (beacon) {

    vector.removeFeature(beacon)

  }

}
