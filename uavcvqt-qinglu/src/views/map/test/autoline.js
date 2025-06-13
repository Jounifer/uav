import { Feature } from 'ol'
import { LineString } from 'ol/geom'
import lines from '../../../../test/line.json'
import getDistance from '../getdistance'
import getRotation from '../getrotation'
import featuretype from '../featuretype'

export default function autoLine(vector, pos = [], p = 0) {

  let index = p
  if (index < lines.length) {

    const pt = lines[index]
    const feat = vector.getFeatureById(1)
    const properties = {
      type: featuretype.Line,
      geometry: new LineString([
        pt,
        pos,
      ]),
      label: getDistance(pt, pos),
      rotation: getRotation(pt, pos),
    }
    if (!feat) {

      const feature = new Feature(properties)
      feature.setId(1)
      vector.addFeature(feature)

    } else {

      feat.setProperties(properties)

    }
    index += 1
    setTimeout(() => {

      autoLine(vector, pos, index)

    }, 2000)

  }

}
