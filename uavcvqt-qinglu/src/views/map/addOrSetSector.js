import { Polygon } from 'ol/geom'
import { getAngle } from '@/utils/index'
import createSector from './createsector'
import createSectorPoint from './createsectorpoint'

export default function addOrSetSector(node, vector) {

  const {
    state, capPlatformList, nodeType, style,
  } = node
  if (state !== 4) {

    const pLng = node.longitude;
    const pLat = node.latitude;
    (capPlatformList || []).forEach((i) => {

      const {
        id, online, oppositeLongitude, oppositeLatitude, sector,
      } = i
      let { longitude, latitude } = i
      const feat = vector.getFeatureById(id)
      if (i.state !== 4 && i.platformUploadData && longitude && latitude && i.platformUploadData.rotationAngleH !== null && i.platformUploadData.rotationAngleH !== undefined) {
        if (pLng && pLat && oppositeLongitude && oppositeLatitude) {
          longitude = pLng
          latitude = pLat
          i.platformUploadData.rotationAngleH = getAngle(longitude, latitude, oppositeLongitude, oppositeLatitude)
        }
        const color = nodeType === '群头飞机' ? 'rgba(136, 255, 69, .3)' : 'rgba(68, 174, 254, .5)'
        const p1 = [
          longitude,
          latitude,
        ]
        const p2 = [
          oppositeLongitude,
          oppositeLatitude,
        ]
        if (!feat) {

          vector.addFeature(createSector(p1, p2, (i.platformUploadData.rotationAngleH || 0), sector || 24, {
            color,
            type: nodeType,
            id,
            rotationAngleH: i.platformUploadData.rotationAngleH,
            online,
            p1,
            style,
            flush: false,
          }))

        } else {

          const p = new Polygon(createSectorPoint(p1, p2, (i.platformUploadData.rotationAngleH || 0), sector || 24))
          feat.setProperties({
            geometry: p,
            color,
            id,
            rotationAngleH: i.platformUploadData.rotationAngleH,
            online,
            p1,
            style,
          })

        }

      } else if (feat) {

        vector.removeFeature(feat)

      }

    })

  } else {

    (capPlatformList || []).forEach((i) => {

      const feat = vector.getFeatureById(i.id)
      if (feat) {

        vector.removeFeature(feat)

      }

    })

  }

}
