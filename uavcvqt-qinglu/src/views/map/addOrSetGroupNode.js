import { Feature } from 'ol'
import { Circle } from 'ol/geom'
import featuretype from './featuretype'
import addOrSetGroupConnect from './addOrSetGroupConnect'
import Group from './group'

export default function addOrSetGroupNode(node, group) {

  const {
    id, longitude, latitude, state, parentId, parentLongitude, parentLatitude,
  } = node
  const target = [
    parentLongitude,
    parentLatitude,
  ]
  if ((state !== 4) && longitude && latitude && parentLongitude && parentLatitude) {

    let feature = group.getFeatureById(parentId)
    if (feature) {

      const points = feature.get('coordinates')
      const color = feature.get('color')
      const stroke = feature.get('stroke')
      if (!Group.hasNode(points, id)) {

        points.push({
          id,
          lngLat: [
            longitude,
            latitude,
          ],
        })

      }
      const bounds = Group.getBounds(points)
      const center = Group.getCenter(bounds)
      const radius = Group.radius(center, [
        bounds[2],
        bounds[3],
      ])

      // const xy = Group.coordinate(center, target)
      feature.setProperties({
        geometry: new Circle(center, radius),
        coordinates: points,
        type: featuretype.Group,
        color,
        stroke,
      })
      addOrSetGroupConnect({
        center,
        target,
        parentId,
        state,
      }, group)

    } else {

      const points = [
        {
          id,
          lngLat: [
            longitude,
            latitude,
          ],
        },
      ]
      const bounds = Group.getBounds(points)
      const center = Group.getCenter(bounds)
      const radius = Group.radius(center, [
        bounds[2],
        bounds[3],
      ])

      // const xy = Group.coordinate(center, target)
      feature = new Feature({
        geometry: new Circle(center, radius),
        color: 'rgba(38, 181, 228, 0.1)',
        stroke: 'rgba(38, 181, 228, 0.2)',
        coordinates: points,
        type: featuretype.Group,
      })
      feature.setId(parentId)
      group.addFeature(feature)
      addOrSetGroupConnect({
        center,
        target,
        parentId,
        state,
      }, group)

    }

    /*
     * let f = this.vector.sector.getFeatureById('t_'+parentId)
     * if (!!f) {
     *   const points = f.get('coordinates')
     *   if (!Group.hasNode(points, id)) {
     *     points.push({id, lngLat: [longitude, latitude]})
     *   }
     *   const bounds = Group.getBounds(points)
     *   const center = Group.getCenter(bounds)
     *   f.setProperties({
     *     geometry: new Polygon(createSectorPoint(center, target, 0, 360)),
     *     coordinates: points,
     *     color: 'rgba(0,0,255,0.5)'
     *   })
     * } else {
     *   const center = [longitude, latitude]
     *   f = new Feature({
     *     geometry: new Polygon(createSectorPoint(center, target, 0, 360)),
     *     coordinates: [{id, lngLat: [longitude, latitude]}],
     *     color: 'rgba(0,0,255,0.5)'
     *   })
     *   f.setId('t_' + parentId)
     *   this.vector.sector.addFeature(f)
     * }
     */

  }

}
