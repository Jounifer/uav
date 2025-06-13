import { degreeToRadian } from '@/utils'

function getRadius(p1, p2) {

  const a = p1[0] - p2[0]
  const b = p1[1] - p2[1]

  return Math.sqrt(a * a + b * b)

}

/**
 * @description 创建扇区
 * @param { Array<Number> } center 中心坐标[0,0]
 * @param { Array<Number> } target 目标坐标
 * @param { Number } startAngle  起始角度，Y轴方向为起始位置，逆时针为负，顺时针为正
 * @param { Number } angle 扇区角度
 * @param { Number } config 自定义属性
 */
export default function createSectorPoint(center, target, startAngle, angle) {

  const points = []
  const sa = (360 - startAngle - (angle / 2) + 90) % 360
  const radius = getRadius(center, target)

  points.push(center)
  for (let i = 0; i <= angle; i++) {

    const x = center[0] + (target[0] ? radius : 0.01) * Math.cos(degreeToRadian(sa + i))
    const y = center[1] + (target[1] ? radius : 0.01) * Math.sin(degreeToRadian(sa + i))
    points.push([
      x,
      y,
    ])

  }
  points.push(center)

  return [points]

}
