import featuretype from '../featuretype'
import beaconIcon from '@/assets/beacon.png'
import beaconFaultIcon from '@/assets/beacon-fault.png'
import addOrSetBeacon from '../addOrSetBeacon'
import addOrSetInfo from '../addOrSetInfo'

/*
 * square: 选中框
 * vector: 矢量图层
 * map: 地图
 * data: 节点数据
 */
export default function autoBeacon(vector, square, map, style, data = [], alarmStatus = false) {

  const {
    beacon,
  } = vector
  if (data.length > 0) {

    data.forEach((item) => {

      const icBeacon = beacon.getFeatureById(item.id)
      if (icBeacon) {

        style = icBeacon.get('style')

      }
      item.style = style

      addOrSetBeacon(item, {
        type: featuretype.Beacon,
        icon: item.state === 0 || alarmStatus ? beaconIcon : beaconFaultIcon,
      }, square, beacon)

      addOrSetInfo(item, map)

    })

  }

}
