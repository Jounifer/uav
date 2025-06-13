import { Vector } from 'ol/source'
import { Vector as Vectors } from 'ol/layer'
import { Feature } from 'ol'
import { LineString } from 'ol/geom'
import {
  Fill, Stroke, Style as OlStyle,
} from 'ol/style'
import lines from '../../../../test/line.json'
import featuretype from '../featuretype'

/**
 * @description 单轨迹
 */
export default () => {

  const line = new Vector()
  const feature = new Feature({
    type: featuretype.Line,
    geometry: new LineString(lines),
  })
  feature.setStyle(new OlStyle({
    fill: new Fill({ color: '#ff0000' }),
    stroke: new Stroke({
      width: 6,
      color: '#ff0000',
    }),
    zIndex: 99,
  }))
  line.addFeature(feature)
  const layer = new Vectors({ source: line })

  return layer

}
