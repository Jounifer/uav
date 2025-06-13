import featuretype from '../featuretype'
import celiangIcon from '@/assets/celiang.png'
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
export default function autoCeliang(vector, square, map, style, data = []) {

  const {
    sector, celiang, connect,
  } = vector
  if (data.length > 0) {

    data.forEach((item) => {

      const station = celiang.getFeatureById(item.id)
      if (station) {

        style = station.get('style')

      }
      item.style = style

      addOrSetSector(item, sector)

      addOrSetConnect(item, connect)

      addOrSetStation(item, {
        type: featuretype.Celiang,
        icon: celiangIcon,
      }, square, celiang)

      addOrSetInfo(item, map)

    })

  }

}
