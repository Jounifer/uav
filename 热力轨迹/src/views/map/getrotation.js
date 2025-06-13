import { degreeToRadian, radianToDegree } from '@/utils'

export default function getRotation(start = [], end = []) {

  const dg = radianToDegree(Math.atan2((end[1] - start[1]), end[0] - start[0]))
  const rt = (360 - dg) % 360
  return degreeToRadian(dg < 90 ? rt : rt - 180)

}
