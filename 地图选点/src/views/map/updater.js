import { Feature } from 'ol'
import { Point, Polygon } from 'ol/geom'
import { log } from '@/utils'
import featuretype from './featuretype'
import createSector from './createsector'
import createSectorPoint from './createsectorpoint'

export default class Updater {
  constructor(relay, fixed, rotor, sector) {
    this._relay = relay
    this._fixed = fixed
    this._rotor = rotor
    this._sector = sector
  }

  get Type() {
    return {
      Center: '演示中心"',
      Ground: '地面',
      Relay: '中继飞机',
      Fixed: '群头飞机',
      Rotor: '小无人机'
    }
  }

  setNodeState(data = []) {
    data.forEach(node => {
      if (node.nodeType === this.Type.Relay) {
        this.setRelay(node)
      } else if (node.nodeType === this.Type.Fixed) {
        this.setFixed(node)
      } else if (node.nodeType === this.Type.Rotor) {
        this.setRotor(node)
      }
    })
  }

  setNode(caller, node, type) {
    let feature = this[`_${caller}`].getFeatureById(node.id)
    const properties = {
      geometry: new Point([
        node.longitude,
        node.latitude,
      ]),
      type,
      nodeType: node.nodeType,
      state: node.state,
      code: node.nodeCode,
      name: node.nodeName,
      altitude: node.height,
      pitch: node.pitch,
      roll: node.roll,
      angle: node.angle,
      yaw: node.yaw,
      icon: `/assets/${caller}.png`,
      roation: node.yaw
    }
    if (!feature) {
      feature = new Feature(properties)
      feature.setId(node.id)
      this[`_${caller}`].addFeature(feature)
    } else {
      feature.setProperties(properties)
    }

  }

  setRelay(relay) {
    this.setNode('relay', relay, featuretype.Relay)
    this.setSector(relay)
  }

  setFixed(fixed) {
    this.setNode('fixed', fixed, featuretype.Fixed)
    this.setSector(fixed)
  }

  setRotor(rotor) {
    this.setNode('rotor', rotor, featuretype.Rotor)
  }

  setSector(node) {
    let feature = this._sector.getFeatureById(node.id)
    if (!feature) {
      this._sector.addFeature(createSector([node.longitude, node.latitude], 120, node.angle, 30, {id: node.id, type: featuretype.Sector}))
    } else {
      feature.setProperties({
        geometry: new Polygon(createSectorPoint([node.longitude, node.latitude], 120, node.angle, 30))
      })
    }
  }
}