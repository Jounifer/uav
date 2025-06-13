import { Feature } from 'ol'
import { MultiLineString } from 'ol/geom'
import featuretype from './featuretype'
import getDistance from './getdistance'
import getRotation from './getrotation'

export default function addOrSetGroupConnect(node, group) {

  const {
    center, state, parentId, target,
  } = node
  if (state !== 4) {

    let feature = group.getFeatureById(`g_${parentId}`)
    if (feature) {

      feature.setProperties({
        geometry: new MultiLineString([
          center,
          target,
        ]),
        label: getDistance(center, target),
        rotation: getRotation(center, target),
        type: featuretype.Line,
      })

    } else {

      feature = new Feature({
        geometry: new MultiLineString([
          center,
          target,
        ]),
        type: featuretype.Line,
        label: getDistance(center, target),
        rotation: getRotation(center, target),
      })
      feature.setId(`g_${parentId}`)
      group.addFeature(feature)

    }

  }

}
