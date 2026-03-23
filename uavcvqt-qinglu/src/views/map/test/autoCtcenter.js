import featuretype from '../featuretype'
import ctcenterIcon from '@/assets/ct-center.png'
import addOrSetSector from '../addOrSetSector'
import addOrSetStation from '../addOrSetStation'
import addOrSetInfo from '../addOrSetInfo'

/*
 * square: 选中框
 * vector: 矢量图层
 * map: 地图
 * data: 节点数据
 */
export default function autoCtcenter(vector, square, map, style, data = []) {

  const {
    sector, ctCenter,
  } = vector
  if (data.length > 0) {

    data.forEach((item) => {

      const station = ctCenter.getFeatureById(item.id)
      item.style = station ? station.get('style') : style

      addOrSetSector(item, sector)

      addOrSetStation(item, {
        type: featuretype.ctCenter,
        icon: ctcenterIcon,
      }, square, ctCenter)

      addOrSetInfo(item, map)

    })

  }

}
