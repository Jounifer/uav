import { LineString } from 'ol/geom'
import { Feature } from 'ol'

export default function addOrSetTrack(node, plane, vector) {

  const {
    style, id, nodeType, longitude, latitude, trackStatus, state,
  } = node
  const n = trackStatus.length - 1
  let color
  if (trackStatus[n]) {

    if (nodeType === '群头飞机') {

      color = '#0DD58B'

    } else if (nodeType === '小无人机') {

      color = '#D09D39'

    } else {

      color = '#6DA4FF'

    }

  } else {

    color = '#DC5038'

  }
  const feat = vector.getFeatureById(n + id)
  const pt = [
    longitude,
    latitude,
  ]
  if (state !== 4 && style.enTrack) {

    if (!feat) {

      const feature = new Feature({
        geometry: new LineString([pt]),
        color,
      })
      feature.setId(n + id)
      vector.addFeature(feature)

      // 修复轨迹点没有连上的问题
      if (n > 0) {

        const lastFeat = vector.getFeatureById((n - 1) + id)
        if (lastFeat) {

          const ls = lastFeat.getGeometry()
          ls.appendCoordinate(pt)
          lastFeat.setGeometry(ls)

        }

      }

    } else {

      /*
       * const list = feat.get('list')
       * list.push(pt)
       * feat.setProperties({
       *     geometry: new MultiLineString([list]),
       *     color,
       *     list,
       * })
       */
      const ls = feat.getGeometry()
      ls.appendCoordinate(pt)
      feat.setGeometry(ls)

    }

  } else {

    const trackLen = trackStatus.length
    trackStatus.forEach((i, index) => {

      const trackFeat = vector.getFeatureById(index + id)
      if (trackFeat) {

        vector.removeFeature(trackFeat)

      }
      if (index === trackLen - 1) {

        plane.setProperties({ trackStatus: [] })

      }

    })

  }

}
