import featuretype from '../featuretype'
import centerIcon from '@/assets/center.png'
import addOrSetConnect from '../addOrSetConnect'
import addOrSetSector from '../addOrSetSector'
import addOrSetStation from '../addOrSetStation'
import addOrSetInfo from '../addOrSetInfo'

/*
 * square: 选中框
 * vector: 矢量图层
 * map: 地图
 * data: 节点数据
 */
export default function autoCenter(vector, square, map, style, data = []) {

  const {
    sector, center, connect,
  } = vector
  if (data.length > 0) {

    data.forEach((item) => {

      const station = center.getFeatureById(item.id)
      if (station) {

        style = station.get('style')

      }
      item.style = style

      addOrSetSector(item, sector)

      addOrSetConnect(item, connect)

      addOrSetStation(item, {
        type: featuretype.Center,
        icon: centerIcon,
      }, square, center)

      addOrSetInfo(item, map)

    })

  }

}
