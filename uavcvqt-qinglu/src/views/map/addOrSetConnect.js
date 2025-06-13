import { Feature } from 'ol'
import { LineString } from 'ol/geom'
import { customCodes } from './gisconfig'
import featuretype from './featuretype'
import getDistance from './getdistance'
import getRotation from './getrotation'

export default function addOrSetConnect(node, lineVector, isPlane) {


  const {
    state, longitude, latitude, id, parentLongitude, parentLatitude, style, nodeCode,
  } = node
  const line = lineVector.getFeatureById(id)
  if ((!isPlane && longitude && latitude) || (isPlane && state !== 4 && longitude && latitude)) {

    if (parentLongitude && parentLatitude) {

      const target = [
        longitude,
        latitude,
      ]
      const source = [
        parentLongitude,
        parentLatitude,
      ]
      const hasOffset = customCodes.indexOf(nodeCode) > -1
      if (line) {

        line.setProperties({
          geometry: new LineString([
            target,
            source,
          ]),
          label: getDistance(target, source),
          rotation: getRotation(target, source),
          style,
          state,
          flush: line.get('flush'),
          hasOffset,
        })

      } else {

        const lf = new Feature({
          type: featuretype.Line,
          geometry: new LineString([
            target,
            [
              parentLongitude,
              parentLatitude,
            ],
          ]),
          label: getDistance(target, source),
          rotation: getRotation(target, source),
          style,
          state,
          flush: false,
          hasOffset,
        })
        lf.setId(id)
        lineVector.addFeature(lf)

      }

    } else if (line) {

      lineVector.removeFeature(line)

    }

  } else if (line) {

    lineVector.removeFeature(line)

  }

}
