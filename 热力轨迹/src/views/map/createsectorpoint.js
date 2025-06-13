import { degreeToRadian } from '@/utils'

/**
 * @description 创建扇区
 * @param { Array<Number> } center 中心坐标[0,0]
 * @param { Number } radius 半径
 * @param { Number } startAngle  起始角度，Y轴方向为起始位置，逆时针为负，顺时针为正
 * @param { Number } angle 扇区角度
 * @param { Number } config 自定义属性
 */
export default function createSectorPoint(center, radius, startAngle, angle) {
  const points = []
  const sa = (360 - startAngle + 90) % 360
  const r = radius //radius/1000
  points.push(center)
  for(let i = 0; i <= angle; i++) {
    const x = center[0] + r * Math.cos(degreeToRadian(sa + i))
    const y = center[1] + r * Math.sin(degreeToRadian(sa + i))
    points.push([x, y])
  }
  points.push(center)

  return [ points ]
}