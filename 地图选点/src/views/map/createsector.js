import { Polygon } from 'ol/geom'
import { Feature } from 'ol'
import createSectorPoint from './createsectorpoint'

/**
 * @description 创建扇区
 * @param { Array<Number> } center 中心坐标[0,0]
 * @param { Number } radius 半径
 * @param { Number } startAngle  起始角度，Y轴方向为起始位置，逆时针为负，顺时针为正
 * @param { Number } angle 扇区角度
 * @param { Number } config 自定义属性
 */
export default function createSector(center, radius, startAngle, angle, config) {

  const {id, ...options} = config
  
  const feature = new Feature({
    geometry: new Polygon(createSectorPoint(center, radius, startAngle, angle)),
    ...options
  });

  feature.setId(id)

  return feature
}