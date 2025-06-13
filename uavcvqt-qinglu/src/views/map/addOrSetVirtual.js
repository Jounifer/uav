import { Feature } from 'ol'
import { Point } from 'ol/geom'
import featuretype from './featuretype'
import virtualIcon from '@/assets/virtual.png'

/*
 * vector: 矢量图层
 * map: 地图
 * data: 节点数据
 */
export default function addOrSetVirtual(vector, data = [], visible = true) {

  const {
    virtual,
  } = vector
  if (data.length > 0) {

    data.forEach((item) => {

      const station = virtual.getFeatureById(item.name)
      const {
        longitude, latitude, name,
      } = item

      if (longitude && latitude) {

        const pt = [
          longitude,
          latitude,
        ]
        const opt = {
          type: featuretype.Virtual,
          icon: virtualIcon,
        }
        if (!station) {

          const feature = new Feature({
            geometry: new Point(pt),
            name,
            data: item,
            visible,
            ...opt,
          })
          feature.setId(name)
          virtual.addFeature(feature)

        } else {

          station.setProperties({
            geometry: new Point(pt),
            name,
            data: item,
            visible,
            ...opt,
          })

        }

      }


    })

  }

}
