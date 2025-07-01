import querystring from './querystring'
import isQtEnv from './isqtenv'
import store from './store'
import source from './source'
import log from './log'
import state from './state'
import degreeToRadian from './degreetoradian'
import radianToDegree from './radiantodegree'

const contains = (sources, stream) => sources.filter((node) => node.id === stream).length > 0

export {
  querystring,
  isQtEnv,
  store,
  contains,
  source,
  log,
  state,
  degreeToRadian,
  radianToDegree
}
