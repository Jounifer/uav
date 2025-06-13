<script>
  import {
    View, Map, Feature, Overlay,
  } from 'ol'
  import {
    Image as TileImage, Vector as Vectors, Tile
  } from 'ol/layer'
  import {
    ImageWMS, Vector, Cluster
  } from 'ol/source'
  import { Projection, get, METERS_PER_UNIT } from 'ol/proj'
  import { WMTS } from 'ol/source'
  import WMTSTileGrid from 'ol/tilegrid/WMTS'
  import { getWidth, getTopLeft, getCenter } from 'ol/extent'
  import { projOption, wmtsOption, wmsOption } from './mapoption'
  import fromatrm from './formatrm'
  import {
    Style as OlStyle, Icon as OlIcon, Text as OlText, Fill, Stroke, Circle as CircleStyle,
  } from 'ol/style'
  import { defaults as ControlsDefaults, ScaleLine } from 'ol/control'
  import { DoubleClickZoom } from 'ol/interaction'
  import {
    onMount, onDestroy,
  } from 'svelte'
  import storeLegacy from "store"
  
  import { gisConfig } from './gisconfig'

  import ChannelLayer from './channellayer'
  import mapSource from './mapSource'

  let unsubscribe = null
  let map = null
  let scaleZoomVisible = false
  let scaleText = ''
  let currentZoom = 0
  let currentFeature = null
  let channelType = 'RSSI'
  let offlineBaseLayer = null // 离线地图图层

  const channelLayer = new ChannelLayer()


  let _option = {}
  let gis = {}
  let chanelList = {
    eauList: [],
    gpsList: [],
  }
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
      const maxZoom = max || 26
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
          channelLayer.rssiLayer,
          channelLayer.snrLayer,
          channelLayer.tamLayer,
          channelLayer.flowLayer,
          // ...controller.layers()
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

      function addOrSetInfo(node, pixel, map) {

        const channelData = node.get('data')
        if (currentFeature && currentFeature.getId() !== channelData.id) {
            map.getOverlayContainer().removeChild(currentFeature.infoDiv)
        }
        currentFeature = node
        if (document.getElementById(channelData.id)) {
            node.infoDiv = document.getElementById(channelData.id)
        } else {
            node.infoDiv = document.createElement('DIV')
            node.infoDiv.id = channelData.id
            node.infoDiv.className = 'info'
        }
        node.infoDiv.innerHTML = `<p style="display: flex;min-width: max-content;"><span>时间：</span><span style='display: block; width: max-content;'>${channelData.timeStamp || ''}</span></p>
          <p style="display: flex;min-width: max-content;"><span>经纬度：</span><span style='display: block; width: max-content;'>(${channelData.longitude}，${channelData.latitude})</span></p>
          <p style="display: flex;min-width: max-content;"><span>高度：</span><span style='display: block; width: max-content;'>${channelData.height != null ? channelData.height : ''}</span></p>
          <p style="display: flex;min-width: max-content;"><span>RSSI(dBm)：</span><span style='display: block; width: max-content;'>${channelData.rssi != null ? channelData.rssi : ''}</span></p>
          <p style="display: flex;min-width: max-content;"><span>SNR(dB)：</span><span style='display: block; width: max-content;'>${channelData.snr != null ? channelData.snr : ''}</span></p>
          <p style="display: flex;min-width: max-content;"><span>TA：</span><span style='display: block; width: max-content;'>${channelData.ta != null ? channelData.ta : ''}</span></p>
          <p style="display: flex;min-width: max-content;"><span>TA_m(m)：</span><span style='display: block; width: max-content;'>${channelData.ta_m != null ? channelData.ta_m : ''}</span></p>
          <p style="display: flex;min-width: max-content;"><span>距离百花山(m)：</span><span style='display: block; width: max-content;'>${channelData.distance != null ? channelData.distance : ''}</span></p>
          <p style="display: flex;min-width: max-content;"><span>距离误差(m)：</span><span style='display: block; width: max-content;'>${channelData.distanceDiff != null ? `${channelData.distanceDiff}` : ''}</span></p>
          <p style="display: flex;min-width: max-content;"><span>流量(Mb)：</span><span style='display: block; width: max-content;'>${channelData.flow != null ? `${channelData.flow}` : ''}</span></p>`
        if (pixel[0] + 10 + node.infoDiv.clientWidth > window.innerWidth) {
          node.infoDiv.style.left = window.innerWidth - node.infoDiv.clientWidth + "px"
        } else {
          node.infoDiv.style.left = pixel[0] + 10 + "px"
        }
        if (pixel[1] + 10 + node.infoDiv.clientHeight > window.innerHeight) {
          node.infoDiv.style.top = window.innerHeight - node.infoDiv.clientHeight + "px"
        } else {
          node.infoDiv.style.top = pixel[1] + 10 + "px"
        }
        map.getOverlayContainer().appendChild(node.infoDiv)

      }

      map.on('pointermove', (evt) => {

        const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f)
        if (feature) {

          const channel = feature.get('channel')
          if (channel) {
            addOrSetInfo(feature, evt.pixel, map)
          } 

        } else {

          if (currentFeature && currentFeature.infoDiv) {
            map.getOverlayContainer().removeChild(currentFeature.infoDiv)
            currentFeature = null
          }

        }

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

  }


    // window.parent.postMessage({
    //   message: 'detailnode',
    //   node,
    // }, '*');

  onMount(() => {

    gis = {
      gis: {
        min: 7,
        level: 10,
        bounds: [ 
          // 114.00093573536981,
          // 38.201404296593836,
          // 117.76879114156612,
          // 41.64300371909803
          110.38311674955514,
          22.49805345392602,
          114.28466232396835,
          24.68014910392982
        ],
        center: [113.340280,23.009],
        scalezoom: true,
        wms: 'http://172.16.51.89:9099/geoserver/gwc/service/wmts',
        gisCoordinate: 'GCJ02',
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

      // 添加更新轨迹
      if (e.data.message === 'addOrSetHeat' && e.data.list) {

        chanelList = e.data.list
        channelLayer.clear()
        if (channelType === 'SNR') {
          channelLayer.loadSNRData(chanelList)
        } else if (channelType === 'TAM') {
          channelLayer.loadTAMData(chanelList)
        }  else if (channelType === 'FLOW') {
          channelLayer.loadFLOWData(chanelList)
        } else {
          channelLayer.loadRSSIData(chanelList)
        }

      }
      // 切换类型
      if (e.data.message === 'setHeatType') {

        channelType = e.data.type
        if (channelType === 'SNR') {
          channelLayer.loadSNRData(chanelList)
        } else if (channelType === 'TAM') {
          channelLayer.loadTAMData(chanelList)
        }  else if (channelType === 'FLOW') {
          channelLayer.loadFLOWData(chanelList)
        } else {
          channelLayer.loadRSSIData(chanelList)
        }

      }
      // 清除所有轨迹
      if (e.data.message === 'clearTrack') {

        vector.track.clear()

      }
      // 获取地图初始配置
      if (e.data.message === 'initMap') {

        const { wms, gisCoordinate, center, bounds, min, max, layer, mapOnlineStatus = false, mapOnlineStyle } = e.data.config
        if (wms) {
          gis.gis.wms = wms
        }
        if (gisCoordinate) {
          gis.gis.gisCoordinate = gisCoordinate
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