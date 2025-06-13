import featuretype from '../featuretype'
import addOrSetPlane from '../addOrSetPlane'

// import addOrSetGroupNode from '../addOrSetGroupNode'
import uavIcon from '@/assets/ic-rotor.png'
import uavFaultIcon from '@/assets/ic-rotor-fault.png'

export default function autoUav(vector, square, style, data = [], pos = 0, alarmStatus = false) {

  let index = pos
  const {
    rotor, track,
  } = vector
  const p = data[index]
  if (index < data.length) {

    const uav = rotor.getFeatureById(p.id)
    p.style = style
    if (uav) {

      p.style = uav.get('style')

    }

    addOrSetPlane(p, {
      type: featuretype.Rotor,
      icon: p.state === 0 || alarmStatus ? uavIcon : uavFaultIcon,
    }, square, track, rotor)

    // addOrSetGroupNode(p, group)

    index += 1

    setTimeout(() => {

      autoUav(vector, square, style, data, index)

    }, 100)

  }

}
