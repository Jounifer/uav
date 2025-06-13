import {
  Vector as Source,
} from 'ol/source'
import { Vector as Layer } from 'ol/layer'
import {
  Style, Icon, Stroke,
} from 'ol/style'
import { GeoJSON } from 'ol/format'
import GeoJson from './geojson'
import arrowIcon from '@/assets/arrow.png'
import { Point } from 'ol/geom'

export default class ChannelLayer {

  constructor() {

    this.rssiSource = new Source()
    this.snrSource = new Source()
    this.tamSource = new Source()
    this.flowSource = new Source()
    this.rssiLayer = new Layer({
      source: this.rssiSource,
      style: ChannelLayer.featureStyle,
    })
    this.snrLayer = new Layer({
      source: this.snrSource,
      style: ChannelLayer.featureStyle,
    })
    this.tamLayer = new Layer({
      source: this.tamSource,
      style: ChannelLayer.featureStyle,
    })
    this.flowLayer = new Layer({
      source: this.flowSource,
      style: ChannelLayer.featureStyle,
    })
    this.filter = true

  }

  static arrowPoint([
    [
      x1,
      y1,
    ],
    [
      x2,
      y2,
    ],
  ] = coordinates, headlen = 9, theta = 45) {

    const angle = Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI
    const angle1 = (angle + theta) * Math.PI / 180
    const angle2 = (angle - theta) * Math.PI / 180

    return {
      top: [
        x2 + headlen * Math.cos(angle1),
        y2 + headlen * Math.sin(angle1),
      ],
      bottom: [
        x2 + headlen * Math.cos(angle2),
        y2 + headlen * Math.sin(angle2),
      ],
    }

  }

  static featureStyle(feature) {

    if (feature.getGeometry() instanceof Point) {

      return new Style({
        image: new Icon({
          src: arrowIcon,
          width: 8,
          height: 8,
          rotation: feature.get('rotation') || 0,
        }),
      })

    }

    return new Style({
      stroke: new Stroke({
        width: 8,
        color: feature.get('stroke'),
      }),

      /*
       * renderer(coordinates, pointer) {
       *   const [[x1, y1], [x2, y2]] = coordinates
       *   const color = feature.get('stroke')
       *   const ctx = pointer.context
       *   const {top, bottom} = ChannelLayer.arrowPoint(coordinates, 5, 60)
       */

      /*
       *   ctx.save()
       *   ctx.beginPath()
       *   ctx.fillStyle = color
       *   ctx.lineWidth = 10
       *   ctx.strokeStyle = color
       *   ctx.moveTo(x1, y1)
       *   ctx.lineTo(x2, y2)
       *   ctx.fill()
       *   ctx.stroke()
       *   ctx.closePath()
       *   ctx.restore()
       */

      /*
       *   ctx.save()
       *   ctx.beginPath()
       *   ctx.fillStyle = '#ff0000'
       *   ctx.lineWidth = 9
       *   ctx.strokeStyle = '#ff0000'
       *   ctx.moveTo(top[0], top[1])
       *   ctx.lineTo(x2, y2)
       *   ctx.moveTo(bottom[0], bottom[1])
       *   ctx.lineTo(x2, y2)
       *   ctx.fill()
       *   ctx.stroke()
       *   ctx.closePath()
       *   ctx.restore()
       * }
       */
    })

  }

  loadRSSIData(rssi = {}) {

    this.clear()
    const node = GeoJson.json(rssi, GeoJson.Type.RSSI, this.filter)
    const features = new GeoJSON().readFeatures(node)
    this.rssiSource.addFeatures(features)

  }

  loadRSSIJSON(json = {}) {

    this.clear()
    const features = new GeoJSON().readFeatures(json)
    this.rssiSource.addFeatures(features)

  }

  loadSNRData(snr = {}) {

    this.clear()
    const node = GeoJson.json(snr, GeoJson.Type.SNR, this.filter)
    const features = new GeoJSON().readFeatures(node)
    this.rssiSource.addFeatures(features)

  }

  loadSNRJSON(json = {}) {

    this.clear()
    const features = new GeoJSON().readFeatures(json)
    this.rssiSource.addFeatures(features)

  }

  loadTAMData(snr = {}) {

    this.clear()
    const node = GeoJson.json(snr, GeoJson.Type.TAM, this.filter)
    const features = new GeoJSON().readFeatures(node)
    this.tamSource.addFeatures(features)

  }

  loadTAMJSON(json = {}) {

    this.clear()
    const features = new GeoJSON().readFeatures(json)
    this.tamSource.addFeatures(features)

  }

  loadFLOWData(snr = {}) {

    this.clear()
    const node = GeoJson.json(snr, GeoJson.Type.FLOW, this.filter)
    const features = new GeoJSON().readFeatures(node)
    this.flowSource.addFeatures(features)

  }

  loadFLOWJSON(json = {}) {

    this.clear()
    const features = new GeoJSON().readFeatures(json)
    this.flowSource.addFeatures(features)

  }

  clear() {

    this.rssiSource.clear()
    this.snrSource.clear()
    this.tamSource.clear()
    this.flowSource.clear()

  }

  get Layers() {

    return [
      this.snrLayer,
      this,
      this.rssiLayer,
      this.tamLayer,
      this.flowLayer,
    ]

  }

}
