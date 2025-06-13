import { isQtEnv } from "@/utils"
export function projOption() {
  return {
    code: 'EPSG:4326',
    units: 'degrees',
    axisOrientation: 'neu',
    global: false,
  }
}

export function wmsOption(params) {
  const { wms, layer } = params

  return {
    ratio: 1,
    url: wms || 'http://172.16.51.89:9099/geoserver/uavcv/wms',
    params: {
      STYLES: '',
      tiled: true,
      FORMAT: 'image/png',
      VERSION: '1.1.1',
      LAYERS: layer || 'uavcv:gis',
      exceptions: 'application/vnd.ogc.se_inimage',
    },
    serverType: 'geoserver'
  }

}

export function wmtsOption(params) {
  const { wms, layer } = params 
  return {
    url: wms || 'http://172.16.51.89:9099/geoserver/gwc/service/wmts',
    layer: layer || 'uavcv:gis',
    matrixSet: 'EPSG:4326',
    format: 'image/png',
    style: '',
    wrapX: true
  }
}