import setRelayInfo from './setrelayinfo'

export default function addOrSetInfo(node, map) {

  const {
    state, longitude, latitude, id, style,
  } = node
  const info = document.getElementById(`info${id}`)
  if (state !== 4 && longitude && latitude) {

    const Pixel = map.getPixelFromCoordinate([
      longitude,
      latitude,
    ])
    if (!Pixel) {

      return false

    }
    if (info) {

      setRelayInfo(info, node)
      info.style.left = `${Pixel[0] + 10 - info.clientWidth / 2}px`
      info.style.top = `${Pixel[1] + 25}px`
      if (!style.enInfo || !style.infoAble) {

        map.getOverlayContainer().removeChild(info)

      }

    } else {

      if (!style.enInfo || !style.infoAble) {

        return false

      }
      const infoDiv = document.createElement('DIV')
      infoDiv.id = `info${id}`
      infoDiv.className = 'info fixed'
      setRelayInfo(infoDiv, node)
      map.getOverlayContainer().appendChild(infoDiv)
      infoDiv.style.left = `${Pixel[0] + 10 - infoDiv.clientWidth / 2}px`
      infoDiv.style.top = `${Pixel[1] + 25}px`

    }

  } else if (info) {

    map.getOverlayContainer().removeChild(info)

  }

  return true

}
