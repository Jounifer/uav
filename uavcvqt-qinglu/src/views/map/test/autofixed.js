import featuretype from '../featuretype'
import fixedIcon from '@/assets/ic-fixed.png'
import fixedFaultIcon from '@/assets/ic-fixed-fault.png'
import addOrSetConnect from '../addOrSetConnect'
import addOrSetSector from '../addOrSetSector'
import addOrSetPlane from '../addOrSetPlane'
import addOrSetInfo from '../addOrSetInfo'

// function getRadian(start, end) {

//   return Math.atan2((end[1] - start[1]), end[0] - start[0])

// }

/*
 * alarmStatus: 告警状态
 * square: 选中框
 * vector: 矢量图层
 * map: 地图
 * data: 节点数据
 */
export default function autoFixed(vector, square, map, style, data = [], alarmStatus = false) {

  const {
    sector, fixed, connect, track,
  } = vector
  if (data.length > 0) {

    data.forEach((item) => {

      const plane = fixed.getFeatureById(item.id)
      item.style = plane ? plane.get('style') : style

      addOrSetSector(item, sector)

      addOrSetConnect(item, connect, true)

      addOrSetPlane(item, {
        type: featuretype.Fixed,
        icon: item.state === 0 || alarmStatus ? fixedIcon : fixedFaultIcon,
      }, square, track, fixed)

      addOrSetInfo(item, map)

    })

  }

}
