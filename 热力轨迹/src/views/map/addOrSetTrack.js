import { Point } from 'ol/geom'
import { Feature } from 'ol'

export default function addOrSetTrack(list, vector) {

  list.forEach((item) => {

    const {
      time, longitude, latitude, rssi, snr,
    } = item

    const feature = new Feature({
      geometry: new Point([
        longitude,
        latitude,
      ]),
      rssi,
      snr,
    })
    feature.setId(time)
    vector.addFeature(feature)
    console.log(vector, feature)

  })

}
