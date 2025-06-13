import { Feature } from 'ol'
import { Point } from 'ol/geom'
import squareIcon from '@/assets/square.png'

export default function autoSquare(square, size = [
  64,
  64,
]) {

  const feature = new Feature({
    icon: squareIcon,
    size,
    geometry: new Point([
      0,
      0,
    ]),
    state: false,
  })
  square.addFeature(feature)

  return feature

}
