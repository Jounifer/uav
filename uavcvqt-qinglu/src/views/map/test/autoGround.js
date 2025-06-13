import featuretype from '../featuretype'
import groundIcon from '@/assets/ground.png'
import groundServoIcon from '@/assets/ground-servo.png'
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
export default function autoGround(vector, square, map, style, data = []) {

  const {
    sector, ground, connect,
  } = vector
  if (data.length > 0) {

    data.forEach((item) => {

      const station = ground.getFeatureById(item.id)
      if (station) {

        style = station.get('style')

      }
      item.style = style

      addOrSetSector(item, sector)

      addOrSetConnect(item, connect)

      addOrSetStation(item, {
        type: featuretype.Ground,
        icon: item.capPlatformList?.length > 0 ? groundServoIcon : groundIcon,
      }, square, ground)

      addOrSetInfo(item, map)

    })

  }

}
