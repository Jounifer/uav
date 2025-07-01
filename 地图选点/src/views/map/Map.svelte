<script>
  import {
    View, Map, Feature,
  } from 'ol'
  import {
    Image as TileImage, Vector as Vectors, Tile
  } from 'ol/layer'
  import { Point } from 'ol/geom'
  import {
    ImageWMS
  } from 'ol/source'
  import {
    Vector
  } from 'ol/source'
  import { Projection, get, METERS_PER_UNIT, toLonLat } from 'ol/proj'
  import {
    Style as OlStyle, Icon as OlIcon,
  } from 'ol/style'
  import { WMTS } from 'ol/source'
  import WMTSTileGrid from 'ol/tilegrid/WMTS'
  import { getWidth, getTopLeft, getCenter } from 'ol/extent'
  import { projOption, wmtsOption, wmsOption } from './mapoption'
  import fromatrm from './formatrm'
  import { defaults as ControlsDefaults, ScaleLine } from 'ol/control'
  import {wgs84togcj02, gcj02towgs84} from './gisTranslate'
  import { DoubleClickZoom } from 'ol/interaction'
  import {
    onMount, onDestroy,
  } from 'svelte'
  import storeLegacy from "store"
  
  import { gisConfig } from './gisconfig'
  import mapSource from './mapSource'
  import locationIcon from '@/assets/location.png'

  let unsubscribe = null
  let map = null
  let scaleZoomVisible = false
  let scaleText = ''
  let currentZoom = 0
  let offlineBaseLayer = null // 离线地图图层

  const vector = {
    location: new Vector()
  }
  const layer = {
    location: new Vectors({
      source: vector.location,
      style(feature) {
        return new OlStyle({
          image: new OlIcon({
            src: locationIcon,
            width: 30,
            height: 30,
            opacity: 1,
          }),
        })
      },
      zIndex: 9,
    })
  }


  let _option = {}
  let gis = {}
  function setMapOption(option) {
    const { min, bounds, max, center, level } = option
    const posCenter = center ? center: getCenter(bounds)
    const view = map.getView()
    if (_option.min !== min) {
      view.setMinZoom(minZoom)
    }
    if (_option.max !== max) {
      view.setMaxZoom(maxZoom)
    }
    if (_option.level !== level) {
      view.animate({zoom: level, center: posCenter})
      view.setCenter(posCenter)
    }
    _option = option
  }
  function init(params) {

    // mapOnlineStatus:地图在线服务开关 mapOnlineStyle:地图在线地图样式Add commentMore actions
    const { min, bounds, max, wms, center, level, mapOnlineStatus, mapOnlineStyle } = params.gis
    const posCenter = center ? center: getCenter(bounds)
    if (!map) {

      _option = params.gis
      let projection = new Projection(projOption(params))
      let baseLayer = new TileImage({ source: new ImageWMS(wmsOption({wms, layer: params.gis.layer})) })
      const maxZoom = max || 21
      const minZoom = min

      if (wms.indexOf('/wmts') >= 0) {
        const { code } = projOption()
        projection = get(code)
        const blockSize = 256
        const extent = projection.getExtent();
        const maxResolution = getWidth(extent) / blockSize;
        const { matrixIds, resolutions } = fromatrm(code, maxResolution, maxZoom)
    
        offlineBaseLayer = new Tile({
          source: new WMTS({
            ...wmtsOption({wms, layer: params.gis.layer}),
            projection,
            tileGrid: new WMTSTileGrid({
              tileSize: [blockSize, blockSize],
              extent,
              origin: getTopLeft(extent),
              resolutions,
              matrixIds
            })
          })
        })
        baseLayer = !mapOnlineStatus ? offlineBaseLayer : mapSource[mapOnlineStyle]
      }

      map = new Map({
        target: document.getElementById('map'),
        pixelRatio: 2,
        controls: ControlsDefaults({zoom: false, rotate: false}).extend([
          new ScaleLine({units: 'metric'})
        ]),
        layers: [
          baseLayer,
          ...Object.values(layer),
        ],
        view: new View({
          projection,
          center: posCenter,
          zoom: 2,
          minZoom,
          maxZoom,
          // rotation: Math.PI/2
        })
      })

      map.removeInteraction(map.getInteractions().getArray().find(n => n instanceof DoubleClickZoom))

      if (scaleZoomVisible) {
        map.getView().on('change:resolution', (evt) => {
          const resolution = evt.target.get('resolution');
          const units = map.getView().getProjection().getUnits();
          const dpi = 25.4 / 0.28;
          const mpu = METERS_PER_UNIT[units];
          let scale = resolution * mpu * 39.37 * dpi;
          if (scale >= 9500 && scale <= 950000) {
            scale = Math.round(scale / 1000) + "K";
          } else if (scale >= 950000) {
            scale = Math.round(scale / 1000000) + "M";
          } else {
            scale = Math.round(scale);
          }
          scaleText = scale
          currentZoom = map.getView().getZoom().toFixed(2)
        })
      }

      map.getView().animate({
        zoom: Number(level),
        center: posCenter,
      })

    } else {
      if (_option.wms !== wms) {
        map.dispose()
        map = null
        return init(params)
      } else {
        setMapOption(params.gis)
      }
    }

    map.on('click', (evt) => {

      setTimeout(() => {
        const point = _option.gisCoordinate === 'WGS84' ? evt.coordinate : wgs84togcj02(evt.coordinate[0], evt.coordinate[1])
        console.log(`当前点的经纬度为：(${point[0].toFixed(6)}，${point[1].toFixed(6)})`)
        window.parent.postMessage({
          message: 'position',
          point,
        }, '*');
      })

    })

  }

    // window.parent.postMessage({
    //   message: 'detailnode',
    //   node,
    // }, '*');

  onMount(() => {

    gis = {
      gis: {
        min: 8,
        level: 10,
        bounds: [ 
          // 114.00093573536981,
          // 38.201404296593836,
          // 117.76879114156612,
          // 41.64300371909803
          112.38311674955514,
          22.49805345392602,
          114.28466232396835,
          23.68014910392982
        ],
        center: [113.340307, 23.009168],
        scalezoom: true,
        wms: 'http://172.16.51.89:9099/geoserver/gwc/service/wmts',
        layer: 'maps:view',
        mapOnlineStatus: false,
        mapOnlineStyle: 'streetsV11',
      },
      proj: {
        code: 'EPSG:4326'
      },
    }
    setTimeout(() => {
      if (!map) {
        init(gis)
      }
    }, 3000)
    
    // 监听网管传的事件
    window.addEventListener('message', function(e){
      // 获取地图初始配置
      if (e.data.message === 'initMap') {

        const { wms, center, bounds, min, max, layer, mapOnlineStatus = false, mapOnlineStyle } = e.data.config
        if (wms) {
          gis.gis.wms = wms
        }
        if (center) {
          gis.gis.center = center
        }
        if (bounds) {
          gis.gis.bounds = bounds
        }
        if (min) {
          gis.gis.min = min
        }
        if (max) {
          gis.gis.max = max
        }
        if (layer) {
          gis.gis.layer = layer
        }
        if (mapOnlineStyle) {
          gis.gis.mapOnlineStyle = mapOnlineStyle
        }
        gis.gis.mapOnlineStatus = mapOnlineStatus
        init(gis)

      }

      if (e.data.message === 'drawLocal') {
        const point = _option.gisCoordinate === 'WGS84' ? e.data.lnglat : gcj02towgs84(e.data.lnglat[0], e.data.lnglat[1]);
        vector.location.addFeature(new Feature({
          geometry: new Point(point),
          name: '定位',
        }))
        map.getView().animate({zoom: 12, center: point})
      }

      // 更新地图图层
      if (e.data.message === 'updateMapLayer') {
        map.getLayers().forEach(layer => {
          if (layer.constructor.name === 'TileLayer') {
            map.removeLayer(layer)
            map.addLayer(!e.data.data.mapOnlineStatus ? offlineBaseLayer : mapSource[e.data.data.mapOnlineStyle])
          }
        })
      }
    })

    // 获取gis配置缓存
    const config = storeLegacy.get('gisconfig')
    if (config) {

      Object.keys(config).forEach(k => {
        gisConfig[k] = config[k]
      })

    }

  })
  
  onDestroy(() => {

    unsubscribe()

  })
</script>

<main class="wrapper">
  <section class="map" id="map"></section>
</main>