import {
  LinearRing, Polygon,
} from 'ol/geom'
import { Feature } from 'ol'

function _angle(origin, radius, sides, r, angel) {

  /*
   * const originxy = new Point(origin)
   * const angle = Math.PI * ((1/sides) - (1/2))
   * if(rotation) {
   *   angle += (rotation / 180) * Math.PI
   * }
   */

  /*
   * let rotatedAngle, x, y
   * const points = [];
   */

  /*
   * for(let i = 0 ; i < sides; ++i) {
   *   // 注: 主要是这里
   *     let an = i*((360 - rotation)/360);
   *     rotatedAngle = angle + (an * 2 * Math.PI / sides)
   *     x = originxy.x + (radius * Math.cos(rotatedAngle))
   *     y = originxy.y + (radius * Math.sin(rotatedAngle))
   *     points.push(new Point(x, y))
   * }
   */

  /*
   * 当rotation!=0时,要将圆心与扇形的起点和终点连接起来,构成扇形的两个边
   * if(rotation !=0 ) {
   * points.push(originxy)
   * }
   * // return new Polygon([new LinearRing(points)])
   * return new LinearRing(points)
   */

  const rotation = 360 - r
  let angle = Math.PI * ((1 / sides) - (1 / 2))
  if (rotation) {

    angle += (rotation / 180) * Math.PI

  }
  let rotatedAngle
  let x
  let y
  const points = []
  for (let i = 0; i < sides; ++i) {

    const an = i * ((360 - rotation) / 360)
    rotatedAngle = angle + (an * 2 * Math.PI / sides)
    x = origin[0] + (radius * Math.cos(rotatedAngle))
    y = origin[1] + (radius * Math.sin(rotatedAngle))
    points.push([
      x,
      y,
    ])

  }
  if (rotation !== 0) {

    points.push(origin)

  }
  const ring = new LinearRing(points)
  ring.rotate(angel / 57.3, origin)
  const list = ring.getCoordinates()

  return new Polygon([list])

}

/*
 * export default function createAngle(origin, radius, sides, r, angel) {
 *   const f = new Feature({
 *     geometry: _angle(origin, radius, sides, r, angel),
 *     type: 'Curve'
 *   })
 */

/*
 *   return f;
 * }
 */

function degreeToRadian(degree) {

  return Math.PI * degree / 180

}

export default function createAngle(center, randius, sAngle, angle) {

  const newSAngle = (360 - sAngle + 90) % 360
  const points = []
  points.push(center)
  for (let i = 0; i <= angle; ++i) {

    const x = center[0] + randius * Math.cos(degreeToRadian(newSAngle + i))
    const y = center[1] + randius * Math.sin(degreeToRadian(newSAngle + i))
    points.push([
      x,
      y,
    ])

  }
  points.push(center)

  return new Feature({ geometry: new Polygon([points]) })

}
