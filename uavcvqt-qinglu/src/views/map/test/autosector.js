import addOrSetConnect from '../addOrSetConnect'
import addOrSetSector from '../addOrSetSector'
import addOrSetPlane from '../addOrSetPlane'
import addOrSetInfo from '../addOrSetInfo'
import featuretype from '../featuretype'
import relayIcon from '@/assets/ic-relay.png'
import relayFaultIcon from '@/assets/ic-relay-fault.png'

/*
 * alarmStatus: 告警状态
 * square: 选中框
 * vector: 矢量图层
 * map: 地图
 * data: 节点数据
 */
export default function autoSector(vector, square, map, style, data = [], alarmStatus = false) {

  const {
    sector, relay, connect, track,
  } = vector
  if (data.length > 0) {

    data.forEach((item) => {

      const plane = relay.getFeatureById(item.id)
      if (plane) {

        style = plane.get('style')

      }
      item.style = style

      addOrSetSector(item, sector)

      addOrSetConnect(item, connect, true)

      addOrSetPlane(item, {
        type: featuretype.Relay,
        icon: item.state === 0 || alarmStatus ? relayIcon : relayFaultIcon,
      }, square, track, relay)

      addOrSetInfo(item, map)

    })

  }

}
