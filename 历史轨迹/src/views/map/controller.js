import { Feature } from "ol"
import { Vector, Cluster } from "ol/source"
import { Style, Icon, Fill, Stroke, Text } from "ol/style"
import { Point, LineString } from 'ol/geom'
import { Vector as Layer } from "ol/layer"
import { getDistance as olGetDistance } from 'ol/sphere'

import createSector from "./createsector"
import createSectorPoint from "./createsectorpoint"

import centerSrc from '@/assets/center.png'
import sceneSrc from '@/assets/bhs.png'
import relaySrc from '@/assets/ic-relay.png'

/**
 * GIS图节点业务处理类
 */
export default class Controller {
  constructor() {
    this.distance = 80
    this.center = [116.23390019475585, 40.04188204472351]
    this.scene = [115.83855062360146, 39.67107593957752]
    this.bounds = [
      114.00093573536981,
      38.201404296593836,
      117.76879114156612,
      41.64300371909803,
    ]
    this.vector = {
      region: null,
      connect: null,
      sector: null,
      relay: null,
      fixed: null,
      rotor: null,
    }
    this.layer = {
      region: null,
      connect: null,
      sector: null,
      relay: null,
      fixed: null,
      rotor: null,
    }
    this.initVector()
    this.initLayer()
    this.createFixedFeature()
  }

  /**
   * 定义节点类型
   */
  static get Type() {
    return {
      Center: 0,
      Ground: 1,
      Relay: 2,
      Fixed: 3,
      Rotor: 4,
      Connect: 5,
      Sector: 6,
      Region: 7
    }
  }

  /**
   * 服务端定义的节点类型
   */
  static get Remote() {
    return  {
      Center: '演示中心"',
      Ground: '地面',
      Relay: '中继飞机',
      Fixed: '群头飞机',
      Rotor: '小无人机'
    }
  }

  /**
   * @description 计算两点间距离
   * @param { Array<Number> } start 
   * @param { Array<Number> } end 
   * @returns { String }
   */
  static distance(start, end) {
    const len = olGetDistance(start, end)
    return len < 1000 ? `${Math.ceil(len)}米` : `${Math.ceil(len / 1000)}公里`
  }

  /**
   * @description 计算偏转角度
   * @param { Array<Number> } start 
   * @param { Array<Number> } end 
   * @returns { Number }
   */
  static rotation(start, end) {
    const rotation = Math.atan2((end[1] - start[1]), end[0] - start[0])
    if (rotation >= 0) {
      return -rotation
    }
  
    return Math.PI - rotation
  }

  /**
   * 初始化Feature容器
   */
  initVector() {
    Object.keys(this.vector).forEach(key => {
      this.vector[key] = new Vector()
    })
  }

  /**
   * 初始化图层容器
   */
  initLayer() {
    this.initRegionLayer()
    this.initConnectLayer()
    this.initSectorLayer()
    this.initRelayLayer()
    this.initFixedLayer()
    this.initRotorLayer()
  }

  initRegionLayer() {
    this.layer.region = new Layer({
      source: this.vector.region,
      style(feature) {
        return new Style({
          image: new Icon({ src: feature.get('icon')})
        })
      }
    })
  }

  initConnectLayer() {
    this.layer.connect = new Layer({
      source: this.vector.connect,
      style(feature) {
        return new Style({
          fill: new Fill({ color: '#81DBFB' }),
          stroke: new Stroke({
            width: 2,
            color: '#81DBFB',
          }),
          text: new Text({
            textAlign: 'center',
            textBaseline: 'middle',
            font: 'normal 10pt 微软雅黑',
            text: feature.get('label'),
            rotation: feature.get('rotation'),
            fill: new Fill({ color: '#0E2A5B' }),
            backgroundFill: new Fill({ color: '#81DBFB' }),
            padding: [2, 2, 2, 2]
          })
        })
      }
    })
  }

  initSectorLayer() {
    this.layer.sector = new Layer({
      source: this.vector.sector,
      style(feature) {
        return new Style({
          fill: new Fill({ color: 'rgba(233, 57, 85, .55)' })
        })
      }
    })
  }

  initRelayLayer() {
    this.layer.relay = new Layer({
      source: this.vector.relay,
      style(feature) {
        return new Style({
          image: new Icon({ 
            src: feature.get('icon'), 
            rotation: feature.get('rotation'),
            // anchor: [10, 10],
            // anchorXUnits: 'pixels',
            // anchorYUnits: 'pixels'
          })
        })
      }
    })
  }

  initFixedLayer() {
    this.layer.fixed = new Layer({
      source: this.vector.fixed,
      style(feature) {
        return new Style({
          image: new Icon({ src: feature.get('icon'), rotation: feature.get('rotation') })
        })
      }
    })
  }

  initRotorLayer() {
    this.layer.rotor = new Layer({
      source: new Cluster({
        source: this.vector.rotor,
        distance: this.distance
      }),
      style(feature) {
        return new Style({
          image: new Icon({ src: feature.getProperties().features[0].values_.icon }),
          text: new Text({
            textAlign: 'center',
            textBaseline: 'middle',
            font: 'normal 12pt 微软雅黑',
            text: feature.getProperties().features[0].values_.name,
            offsetY: 32,
            fill: new Fill({ color: '#FFFFFF' }),
          })
        })
      }
    })
  }
  
  layers() {
    return Object.values(this.layer)
  }

  vectors() {
    return Object.values(this.vector)
  }

  /**
   * @description 创建百花山等固定节点
   */
  createFixedFeature() {
    this.vector.region.addFeature(new Feature({
      geometry: new Point(this.center),
      type: Controller.Type.Region,
      name: '演示中心',
      icon: centerSrc,
    }))

    this.vector.region.addFeature(new Feature({
      geometry: new Point(this.scene),
      type: Controller.Type.Region,
      name: '百花山',
      icon: sceneSrc
    }))

    this.vector.connect.addFeature(new Feature({
      geometry: new LineString([this.center, this.scene]),
      type: Controller.Type.Connect,
      label: Controller.distance(this.center, this.scene),
      rotation: Controller.rotation(this.center, this.scene)
    }))
  }

  /**
   * @description 中继飞机
   * @param { Object } node 
   */
  addOrSetRelay(node) {
    const { height, id, longitude, latitude, ...options } = node
    let feature = this.vector.relay.getFeatureById(id)
    const properties = {
      geometry: new Point([longitude, latitude]),
      type: Controller.Type.Relay,
      altitude: height,
      lng: longitude,
      lat: latitude,
      icon: relaySrc,
      ...options
    }
    if (!!feature) {
      feature.setProperties(properties)
    } else {
      feature = new Feature(properties)
      feature.setId(id)
      this.vector.relay.addFeature(feature)
    }
  }

  /**
   * @description 固定翼无人机
   * @param { Object } node 
   */
  addOrSetFixed(node) {
    const { height, id, longitude, latitude, ...options } = node
    let feature = this.vector.fixed.getFeatureById(id)
    const properties = {
      geometry: new Point([longitude, latitude]),
      type: Controller.Type.Fixed,
      altitude: height,
      lng: longitude,
      lat: latitude,
      icon: relaySrc,
      ...options
    }
    if (!!feature) {
      feature.setProperties(properties)
    } else {
      feature = new Feature(properties)
      feature.setId(id)
      this.vector.fixed.addFeature(feature)
    }
  }

  /**
   * @description 旋翼无人机
   * @param { Object } node 
   */
  addOrSetRotor(node) {
    const { height, id, longitude, latitude, ...options } = node
    let feature = this.vector.rotor.getFeatureById(id)
    const properties = {
      geometry: new Point([longitude, latitude]),
      type: Controller.Type.Rotor,
      altitude: height,
      lng: longitude,
      lat: latitude,
      icon: relaySrc,
      ...options
    }
    if (!!feature) {
      feature.setProperties(properties)
    } else {
      feature = new Feature(properties)
      feature.setId(id)
      this.vector.rotor.addFeature(feature)
    }
  }

  /**
   * @description 扇区
   * @param { Object } node 
   */
  addOrSetSector(node) {
    const { id, longitude, latitude, angle } = node
    let feature = this.vector.sector.getFeatureById(id)
    if (!!feature) {
      feature.setProperties({
        geometry: new Polygon(createSectorPoint([longitude, latitude], 120, angle, 30))
      })
    } else {
      this.vector.sector.addFeature(createSector([longitude, latitude], 120, angle, 30, {id, type: Controller.Type.Sector}))
    }
  }

  /**
   * @description 载入或更新节点数据
   * @param { Array<Object> } data 
   */
  handleNodeFromRemote(data) {
    const { Remote } = this
    data.forEach(node => {
      if (node.nodeType === Remote.Relay) {
        this.addOrSetRelay(node)
        this.addOrSetSector(node)
      } else if (node.nodeType === Remote.Fixed) {
        this.addOrSetFixed(node)
        this.addOrSetSector(node)
      } else if (node.nodeType === Remote.Rotor) {
        this.addOrSetRotor(node)
      }
    })
  }
}