import { getDistance as olGetDistance } from 'ol/sphere'

export default function getDistance(start = [], end = []) {

  const len = olGetDistance(start, end)

  return len < 1000 ? `${len.toFixed(3)}米` : `${(len / 1000).toFixed(3)}公里`

}
