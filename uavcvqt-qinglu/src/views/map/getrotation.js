import {
  degreeToRadian, radianToDegree,
} from '@/utils'

export default function getRotation(start = [], end = []) {

  let dg = radianToDegree(Math.atan2((start[1] - end[1]), start[0] - end[0]))
  dg = (360 - dg) % 360
  dg = (dg >= 90 && dg <= 270) ? (180 + dg) : dg

  return degreeToRadian(dg)

}
