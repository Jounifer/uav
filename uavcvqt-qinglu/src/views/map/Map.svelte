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
  import { Polygon, Point } from 'ol/geom'
  import { Projection, get, METERS_PER_UNIT, transform } from 'ol/proj'
  import { WMTS } from 'ol/source'
  import GeoJSON from 'ol/format/GeoJSON.js'
  import WMTSTileGrid from 'ol/tilegrid/WMTS'
  import { getWidth, getTopLeft, getCenter } from 'ol/extent'
  import { projOption, wmtsOption, wmsOption } from './mapoption'
  import fromatrm from './formatrm'
  import {
    Style as OlStyle, Icon as OlIcon, Text as OlText, Fill, Stroke,
  } from 'ol/style'
  import { defaults as ControlsDefaults, ScaleLine } from 'ol/control'
  import { DoubleClickZoom } from 'ol/interaction'
  import {wgs84togcj02, gcj02towgs84} from './gisTranslate'
  import {
    onMount, onDestroy,
  } from 'svelte'
  import storeLegacy from "store"
  
  import setRatorInfo from "./setratorinfo";
  import setRelayInfo from "./setrelayinfo";
  import featuretype from './featuretype'
  import createSectorPoint from './createsectorpoint'
  import { gisConfig } from './gisconfig'


// rotorGroupIcon 无人机组icon
  import rotorGroupIcon from '@/assets/ic-rotor-group.png'
  import enableIcon from '@/assets/enable.png'
  import mousePoint from '@/assets/mouse-point.png'
  import rightIcon from '@/assets/right.png'

  import autoSector from './test/autosector'
  import autoFixed from './test/autofixed'
  import autoSquare from './test/autosquare'
  import autoUav from './test/autouav'
  import autoCeliang from './test/autoceliang'
  import autoGround from './test/autoGround'
  import autoCenter from './test/autocenter'
  import autoCtcenter from './test/autoCtcenter'
  import autoBeacon from './test/autoBeacon'
  import addOrSetVirtual from './addOrSetVirtual'
  import mapSource from './mapSource';
  //import Controller from './controller'
  // import layerJson from './test/areaJson.json'

  let beaconList = []
  const screenPixel = window.innerWidth > 3000 && window.innerHeight > 1800 ? 2 : 1

  // const bounds = [
  //   114.00093573536981,
  //   38.201404296593836,
  //   117.76879114156612,
  //   41.64300371909803,
  // ]

  // 飞行点行政区
  // const vectorSource = new Vector({
  //   features: new GeoJSON().readFeatures(layerJson),
  // });
  // const vectorLayer = new Vectors({
  //   source: vectorSource,
  //   style(feature) {
  //     return new OlStyle({
  //       stroke: new Stroke({
  //         color: '#2589D5',
  //         lineCap: 'butt',
  //         lineDash: [15, 10],
  //         width: 2,
  //       }),
  //       fill: new Fill({
  //         color: '#2589D500',
  //       }),
  //       text: new OlText({
  //         textAlign: 'center',
  //         textBaseline: 'middle',
  //         font: 'normal 12pt 微软雅黑',
  //         fill: new Fill({ color: '#ffffff' }),
  //         text: feature.values_.name,
  //         padding: [2, 2, 2, 2]
  //       })
  //     })
  //   }
  // });

  // 虚拟点区域
  const virtualAreaLayer = new Vectors({
    source: null,
    style(feature) {
      return new OlStyle({
        stroke: new Stroke({
          color: '#2589D500',
          lineCap: 'butt',
          lineDash: [15, 10],
          width: 2,
        }),
        fill: new Fill({
          color: '#759bff80',
        }),
        text: new OlText({
          textAlign: 'center',
          textBaseline: 'middle',
          font: 'normal 12pt 微软雅黑',
          fill: new Fill({ color: '#ffffff' }),
          text: feature.values_.name,
          padding: [2, 2, 2, 2]
        })
      })
    }
  });

  let unsubscribe = null
  const vector = {
    connect: new Vector(),
    sector: new Vector(),
    square: new Vector(),
    ctCenter: new Vector(),
    center: new Vector(),
    celiang: new Vector(),
    ground: new Vector(),
    relay: new Vector(),
    fixed: new Vector(),
    rotor: new Vector(),
    track: new Vector(),
    group: new Vector(),
    beacon: new Vector(),
    virtual: new Vector(),
  }
  const layer = {
    ctCenter: null,
    center: null,
    celiang: null,
    ground: null,
    relay: null,
    fixed: null,
    rotor: null,
    connect: null,
    sector: null,
    square: null,
    track: null,
    group: null,
    beacon: null,
    virtual: null,
  }
  let contextmenu = null
  let map = null
  let activeFeature = null
  let menuFeature = null
  let square = null
  let currentFeature = null
  let radius = 0.001
  let scaleZoomVisible = false
  let scaleText = ''
  let currentZoom = 0
  let lastTime = null
  let frameId = null
  let style = {
    color: '',
    enInfo: false,
    enLink: true,
    enSector: true,
    enTrack: false,
    enFixPoint: 0, // 定点模式开关 0：已关闭， 1：待开启， 2：待确认，3：已开启
    enBeaconPoint: null, // 自动跟踪模式
  }
  let mapAlarmStatus = false // 告警开关
  let offlineBaseLayer = null // 离线地图图层

  function closeContextMenu() {

    map.removeOverlay(contextmenu)

  }

  function resetSectors() {

    vector.sector.getFeatures().forEach(node => {
      const { pt, rotationAngleH } = node.getProperties()
      const p = new Polygon(createSectorPoint(pt, radius, (rotationAngleH || 0) + 15, 30))
      node.setProperties({ geometry: p })
    })

  }

  function addOrSetInfo(node, pixel, map) {

    const data = node.values_.data
    if (currentFeature && currentFeature.getId() !== data.id) {
        map.getOverlayContainer().removeChild(currentFeature.infoDiv)
    }
    if (!gisConfig.infoAble) {
      return false;
    }
    currentFeature = node
    if (document.getElementById(data.id)) {
        node.infoDiv = document.getElementById(data.id)
    } else {
        node.infoDiv = document.createElement('DIV')
        node.infoDiv.id = data.id
        node.infoDiv.className = 'info'
    }
    data.treeLevel === '5' ? setRatorInfo(node.infoDiv, data) : setRelayInfo(node.infoDiv, data)
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

    /**
     * 图层
     */
    function toFixed(n, len) {
      if (String(n).indexOf('.') > 0 && String(n).substr(String(n).indexOf('.')+1).length > len) {
        return n.toFixed(len)
      } else {
        return n;
      }
    }
    /**
     * 矩阵转换 a, b, c, d, e, f
     * θ: 旋转角
     * a   c    e         cos(θ)  -sin(θ)   e //e:偏移量
     * b   d    f   ==>   sin(θ)   cos(θ)   f //f:偏移量
     * 0   0    1         0        0        1
     *
     * 旋转坐标计算: 给定点(x1,y1)，沿着点(x2,y2)旋转θ度，旋转后坐标为(x,y)
     * x = (x1 - x2) * cosθ - (y1 - y2) * sinθ + x2
     * y = (y1 - y2) * cosθ + (x1 - x2) * sinθ + y2
     *
     * 在echarts中旋转角是绕着原点转，旋转后坐标为(x,y)
     * x = x1 * cosθ - y1 * sinθ
     * y = y1 * cosθ + x1 * sinθ
     *
     * 求旋转角：线路名称根据走向取得旋转角θ，给定线路的两个点(x1,y1)、(x2,y2)
     * θ = atan((y2 - y1)/(x2 - x1))
     *
     * 偏移量计算：给定起始坐标点(x1,y1)
     * e = x1 - x // x: 旋转后的横坐标
     * f = y1 - y // y: 旋转后的纵坐标
     */
    function transform(x1, y1, x2, y2) {
      const dy = y2 - y1
      const dx = x2 - x1
      const A = Math.atan(dy / dx)
      const B = A < Math.PI / 2 ? A : A - Math.PI / 2
      const a = Math.cos(B)
      const b = Math.sin(B)
      const c = -b
      const d = a
      const e = x1 - x1 * Math.cos(B) + y1 * Math.sin(B)
      const f = y1 - y1 * Math.cos(B) - x1 * Math.sin(B)
      return { a, b, c, d, e, f }
    }
    function Vector(vector, config, visible) {

      return new Vectors({
        source: vector,
        style(feature) {

          const data = feature.get('data')
          const isPlane = data.treeLevel === '3' || data.treeLevel === '4' || data.treeLevel === '5'
          return new OlStyle({
            image: new OlIcon({
              src: feature.get('icon'),
              rotation: feature.get('rotation'),
              width: 64 * screenPixel,
              height: 64 * screenPixel,
            }),
            text: new OlText({
              textAlign: 'center',
              textBaseline: 'middle',
              font: `normal ${15 * screenPixel}px 微软雅黑`,
              text: config[visible] ? (isPlane ? 
                `${feature.get('code')}${(data.height !== null && data.height !== undefined) ||(data.relativeAlt !== null && data.relativeAlt !== undefined) ? ':' : ''}${data.height !== null && data.height !== undefined ? ` A${toFixed(data.height, 3)}米` : ''}${data.relativeAlt !== null && data.relativeAlt !== undefined ? ` R${toFixed(data.relativeAlt, 3)}米` : ''}`
                : feature.get('name')) : '',
              offsetY: 48 * screenPixel,
              fill: new Fill({ color: '#ffffff' }),
              backgroundFill: new Fill({ color: /*isPlane ? 'rgba(7, 27, 24, 0.6)' : */'transparent' }),
              padding: screenPixel === 2 ? [12, 24, 6, 24] : [6, 12, 3, 12],
            }),
          })
    
        },
        zIndex: 9,
      })

    }
    function celiangVector(vector, config, visible) {

      return new Vectors({
        source: vector,
        style(feature) {

          const hasOffset = feature.get('hasOffset')
          return config[visible] ? new OlStyle({
            image: new OlIcon({
              src: feature.get('icon'),
              rotation: feature.get('rotation'),
              width: 64 * screenPixel,
              height: 64 * screenPixel,
            }),
            text: new OlText({
              textAlign: 'center',
              textBaseline: 'middle',
              font: `normal ${15 * screenPixel}px 微软雅黑`,
              text: config.celiangVisible ? feature.get('name') : '',
              offsetY: (hasOffset ? 68 : 48) * screenPixel,
              fill: new Fill({ color: '#ffffff' }),
            }),
          }) : null

        },
        zIndex: 9,
      })

    }

    layer.ctCenter = Vector(vector.ctCenter, gisConfig, 'ctcenterVisible')
    layer.center = Vector(vector.center, gisConfig, 'centerVisible')
    layer.celiang = celiangVector(vector.celiang, gisConfig, 'celiangAble')
    layer.ground = Vector(vector.ground, gisConfig, 'bhsVisible')
    layer.relay = Vector(vector.relay, gisConfig, 'relayVisible')
    layer.fixed = Vector(vector.fixed, gisConfig, 'fixedVisible')
    layer.beacon = Vector(vector.beacon, gisConfig, 'beaconVisible')

    /**
     * 旋翼无人机图层
     */
    layer.rotor = new Vectors({
      source: new Cluster({
        distance: 24,
        source: vector.rotor,
      }),
      style(feature) {

        const features = feature.get('features')
        const len = features.length
        const data = features[0].get('data')
        const child = features[0].values_
        const r = child.relativeAlt||''
        let text = ''
        if (len > 1) {
          text = `${len}架`
        } else {
          text = `${child.code}${(!!r)?': ' + r + '米':''}`
        }
        // 处理高亮框没有居中显示问题
        if (activeFeature && square) {
          const actData = activeFeature.get('data')
          if (actData) {
            let hasFeature = false
            let lng = 0
            let lat = 0
            features.forEach(i => {
              const iData = i.get('data')
              lng += iData.longitude
              lat += iData.latitude
              if (i.id_ === actData.id) {
                hasFeature = true
              }
            })
            if (hasFeature) {
              square.setProperties({
                geometry: new Point([lng / len, lat / len]),
              })
            }
          }
        }

        return new OlStyle({
          image: new OlIcon({
            src: len > 1 ? rotorGroupIcon : child.icon,
            rotation: len > 1 ? 0 : child.rotation,
            width: 64 * screenPixel,
            height: 64 * screenPixel,
          }),
          text: new OlText({
            // 对齐方式
            textAlign: 'center',
  
            // 文本基线
            textBaseline: 'middle',
  
            // 字体样式
            font: `normal ${15 * screenPixel}px 微软雅黑`,
  
            // 文本内容
            text: gisConfig.uavVisible ? text : '',
  
            // Y轴偏置
            offsetY: 36 * screenPixel,

            // 填充样式
            fill: new Fill({ color: r > 2 ? (child.flush ? '#FFFFFF' : '#FFFFFF') : '#FFFFFF'}),
            padding: screenPixel === 2 ? [4,4,4,8] : [2,2,2,4],
            backgroundFill: new Fill({color: 'rgba(0,0,0,0.35)'})
          }),
        })
  
      },
      zIndex: 9,
    })
    /**
     * 连接线图层
     */
    layer.connect = new Vectors({
      source: vector.connect,
      type: 'connect',
      style(feature) {

        const style = feature.get('style')
        const state = feature.get('state')
        const flush = feature.get('flush')
        const hasOffset = feature.get('hasOffset')
        let color = '#DC5038'
        if (state === 4) {
          color = '#999999'
        } else if (state === 0) {
          color = '#81DBFB'
        } else {
          color = flush && !mapAlarmStatus ? '#DC5038' : '#81DBFB'
        }
        return gisConfig.lineVisible && style.enLink ? new OlStyle({
          // fill: new Fill({ color: '#ff0000' }),
          // stroke: new Stroke({
          //   width: 2 * screenPixel,
          //   color: gisConfig.lineVisible && style.enLink ? (state === 4 ? '#999999' : '#81DBFB') : 'transparent',
          // }),
          // text: new OlText({
          //   textAlign: 'center',
          //   textBaseline: 'middle',
          //   font: `normal ${10 * screenPixel}pt 微软雅黑`,
          //   text: gisConfig.lineVisible && style.enLink ? feature.get('label') : '',
          //   rotation: feature.get('rotation'),
          //   fill: new Fill({ color: '#0E2A5B' }),
          //   backgroundFill: new Fill({ color: (state === 4 ? '#999999' : '#81DBFB') }),
          //   padding: screenPixel === 2 ? [12, 4, 4, 4] : [
          //     6,
          //     2,
          //     2,
          //     2,
          //   ],
          // }),
          /**
           * @description 使用renderer后，其它所有样式均不会生效，需自行处理
           * @param { Array<Array<Number,Number>>} coordinates 
           * @param { Object } pointer 
           */
           renderer(coordinates, pointer) {
            const [[x1, y1], [x2, y2]] = coordinates
            const ctx = pointer.context
            const dx = x2 - x1
            const dy = y2 - y1
            const radius = Math.sqrt(dx * dx + dy * dy)
            /**
             * 两节点间太近就不显示
             */
            if (radius >= 70) {
              let cx = (x2 + x1)/2
              let cy = (y2 + y1)/2
              if (hasOffset) {
                cx = (cx + x2)/2
                cy = (cy + y2)/2
              }

              /**
               * 高版本浏览器中已实现roundRect可以直接使用，
               * 在QWebEngineView和低版本中需要加入以下方法
               * 解决版本兼容问题
               */
              ctx.roundedRect = (x, y, w, h, r) => {
                ctx.beginPath()
                ctx.moveTo(x + r, y)
                ctx.arcTo(x + w, y, x + w, y + h, r)
                ctx.arcTo(x + w, y + h, x, y + h, r)
                ctx.arcTo(x, y + h, x, y, r)
                ctx.arcTo(x, y, x + w, y, r)
                ctx.closePath();
              }

              /**
               * 计算旋转矩阵，文本背景和文本旋转所需的转换
               */
              const { a, b, c, d, e, f } = transform(cx, cy, x1, y1)

              /**
               * 开始绘制前先保护状态，以免旋转后造成其它异常，
               * 绘制结束后再恢复状态
               */
              ctx.save()
              ctx.font = 'bold 20pt 微软雅黑'
              const label = hasOffset ? (x1 < cx ? '《《（远端）' + feature.get('label') : feature.get('label') + '（近端）》》') : feature.get('label')
              const metrics = ctx.measureText(label)
              const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + 8
              const textWidth = metrics.width + 12

              ctx.beginPath()
              ctx.fillStyle = color
              ctx.lineWidth = 2
              ctx.strokeStyle = color
              ctx.moveTo(x1, y1)
              ctx.lineTo(x2, y2)
              ctx.fill()
              ctx.stroke()
              ctx.closePath()

              ctx.beginPath()
              ctx.moveTo(cx, cy)
              ctx.fillStyle = color
              ctx.strokeStyle = color
              ctx.transform(a, b, c, d, e, f)
              if (hasOffset) {
                ctx.roundedRect(cx - textWidth/2, (x1 < cx ? cy - textHeight : cy), textWidth, textHeight, 6)
              } else {
                ctx.roundedRect(cx - textWidth/2, cy - textHeight/2, textWidth, textHeight, 6)
              }
              ctx.fill()
              ctx.stroke()
              ctx.closePath()

              ctx.beginPath()
              ctx.fillStyle = '#0E2A5B'
              ctx.textBaseline = 'middle'
              /**
               * metrics 高度有1-2像素误差，根据实际效果调整
               */
              ctx.fillText(label, cx - textWidth/2 + 6, cy + (hasOffset ? (x1 < cx ? -textHeight/2 : +textHeight/2) : 1))
              ctx.fill()
              ctx.closePath()
              ctx.restore()
            }
          }
        }) : null
  
      },
      zIndex: 6,
      visible: gisConfig.lineVisible && style.enLink,
    })

    /**
     * custom layer
     */
    layer.sector = new Vectors({
      source: vector.sector,
      style(feature) {
        const style = feature.get('style')
        return new OlStyle({
          fill: gisConfig.sectorVisible && style.enSector ? new Fill({ color: gisConfig.wholeColor || (feature.get('color') || 'rgba(68, 174, 254, .5)') }) : null,
          // stroke: new Stroke({
          //   width: 6,
          //   color: 'rgba(233, 57, 85, .35)',
          // })
          text: new OlText({
            textAlign: 'center',
            textBaseline: 'middle',
            font: 'normal 15px 微软雅黑',
            text: feature.get('name'),
            offsetY: 36,
            fill: new Fill({ color: '#ffffff' }),
          }),
          
        })
      },
      zIndex: 3,
    })

    /**
     * 虚拟点 layer
     */
    layer.virtual = new Vectors({
      source: vector.virtual,
      style(feature) {

        const visible = feature.get('visible')
        return visible ? new OlStyle({
          image: new OlIcon({
            src: feature.get('icon'),
            width: 24 * screenPixel,
            height: 24 * screenPixel,
          }),
          text: new OlText({
            textAlign: 'center',
            textBaseline: 'middle',
            font: `normal ${12 * screenPixel}px 微软雅黑`,
            text: feature.get('name'),
            offsetY: -1 * screenPixel,
            fill: new Fill({ color: '#ffffff' }),
          }),
        }) : null

      },
      zIndex: 8,
    })

    /**
     * square layer
     */
    layer.square = new Vectors({
      source: vector.square,
      style(feature) {
        const size = feature.get('size')
        return new OlStyle({
          image: new OlIcon({
            src: feature.get('icon'),
            width: size[0] * screenPixel,
            height: size[1] * screenPixel,
            opacity: (feature.get('state') ? 1 : 0),
          }),
        })
      },
      zIndex: 9,
    })

    /**
     * track layer
     */
    layer.track = new Vectors({
      source: vector.track,
      style(feature) {
        //console.log(gisConfig.wholeColor || feature.get('color') || 'rgba(109, 164, 255, 1)')
        return new OlStyle({
          stroke: new Stroke({
            width: 3 * screenPixel,
            color: gisConfig.wholeColor || feature.get('color') || '#1DCD47',
          }),
          text: new OlText({
            textAlign: 'center',
            textBaseline: 'middle',
            font: `normal ${15 * screenPixel}px 微软雅黑`,
            text: feature.get('name'),
            offsetY: 36 * screenPixel,
            fill: new Fill({ color: '#ffffff' }),
          }),
          
        })
      },
      zIndex: 5,
    })

    /**
     * 小无人机分组图层初始化
     */
    layer.group = new Vectors({
      source: vector.group,
      style(feature) {
        if (feature.get('type') === featuretype.Group) {
          return new OlStyle({
            renderer(coordinates, state) {
              const [[x, y], [x1, y1]] = coordinates
              const ctx = state.context
              const dx = x1 - x
              const dy = y1 - y
              const radius = Math.sqrt(dx * dx + dy * dy)
  
              ctx.beginPath()
              ctx.arc(x, y, radius, 0, 2 * Math.PI, true)
              ctx.fillStyle = feature.get('color')
              ctx.fill()
              ctx.strokeStyle = feature.get('stroke')
              ctx.lineWidth = 2
              ctx.stroke()
              ctx.closePath()
            }
          })
        }
        return new OlStyle({
          fill: new Fill({ color: '#81DBFB' }),
          stroke: new Stroke({
            width: 2,
            color: '#81DBFB',
          }),
          text: new Text({
            textAlign: 'center',
            textBaseline: 'middle',
            font: 'normal 10pt 微软雅黑',
            text: feature.get('label'),
            rotation: feature.get('rotation'),
            fill: new Fill({ color: '#0E2A5B' }),
            backgroundFill: new Fill({ color: '#81DBFB' }),
            padding: [2, 2, 2, 2]
          })
        })
      }
    })

    const overlay = new Overlay({
      element: document.getElementById('overlay'),
      positioning: 'bottom-center',
      autoPan: true,
      offset: [
        4,
        4,
      ],
    })

    contextmenu = new Overlay({
      element: document.getElementById('contextmenu'),
      positioning: 'bottom-center',
      autoPan: true,
      offset: [
        4,
        4,
      ],
    })

    square = autoSquare(vector.square, [66, 66])

    // const controller = new Controller()

    
    //const projection = new Projection(projOption(params))

    //const tiles = new TileImage({ source: new ImageWMS(wmsOption(params)) })
    // mapOnlineStatus:地图在线服务开关 mapOnlineStyle:地图在线地图样式
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
          virtualAreaLayer,
          // vectorLayer,
          // ...controller.layers()
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

      requestFrame()

    } else {
      if (_option.wms !== wms || _option.layer !== params.gis.layer) {
        map.dispose()
        map = null
        return init(params)
      } else {
        setMapOption(params.gis)
      }
    }

    // map.getView().on('change', () => {
    //   const zoom = 21 - map.getView().getZoom()
    //   // radius = 0.001 0.1
    //   radius = zoom > 8 ? zoom * zoom /1000 : zoom / 1000
    //   resetSectors()
    // })

    map.on('click', (evt) => {
  
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f)
      console.info('singleclick', feature)
      if (feature && !feature.values_.level) {

        if (feature.get('features')) {

          const node = feature.get('features')[0]
          const pt = feature.get('geometry')
          const nodeId =  node.id_
          if (square) {

            square.setProperties({
              state: true,
              geometry: pt,
              nodeId,
            })

          }
          activeFeature = node

        } else if (feature.get('type') === featuretype.Relay || feature.get('type') === featuretype.Fixed || feature.get('type') === featuretype.Ground ||
        feature.get('type') === featuretype.Celiang || feature.get('type') === featuretype.Center || feature.get('type') === featuretype.ctCenter ||
        feature.get('type') === featuretype.Beacon) {

          const type = feature.get('type')
          const pt = feature.values_.geometry
          const nodeId = feature.id_
          if (square) {

            square.setProperties({
              state: true,
              geometry: pt,
              nodeId,
            })

          }
          activeFeature = feature

        }
  
      } else {

        if (activeFeature) {

          square.setProperties({
            state: false,
          })
          activeFeature = null;

        }
        map.removeOverlay(contextmenu)
        if (style.enFixPoint !== 1) {
          menuFeature = null
        }
  
      }
      window.parent.postMessage({
        message: 'clicknode',
        node: activeFeature ? activeFeature.values_.data : null,
      }, '*');
      if (style.enFixPoint === 1) {
        // const geometry = vectorSource.getFeatures()[0]?.get('geometry')
        // const isInside = geometry.intersectsExtent(evt.coordinate)
        // if (isInside) {
          style.enFixPoint = 2
          setTimeout(() => {
            const point = _option.gisCoordinate === 'WGS84' ? evt.coordinate : wgs84togcj02(evt.coordinate[0], evt.coordinate[1])
            document.getElementById("confirm").querySelector("p").innerHTML = `当前点的经纬度为：(${point[0].toFixed(3)}，${point[1].toFixed(3)})，确定是否选取该定点？`
            const bodyHeight = document.getElementById("confirm").clientHeight
            const bodyWidth = document.getElementById("confirm").clientWidth / 2
            document.getElementById("confirm").style.left = `${evt.pixel[0] + bodyWidth >= window.innerWidth ? window.innerWidth - bodyWidth : (evt.pixel[0] < bodyWidth ? bodyWidth : evt.pixel[0])}px`
            document.getElementById("confirm").style.top = `${evt.pixel[1] + bodyHeight >= window.innerHeight ? window.innerHeight - bodyHeight : evt.pixel[1]}px`
            const btnConfirm = document.querySelector(".btnConfirm");
            if (btnConfirm) {
              btnConfirm.onclick = function() {
                document.getElementById("map").style.cursor = ''
                style.enFixPoint = 1
                const treeNodeData = menuFeature.get('data')
                window.parent.postMessage({
                  message: 'fixPoint',
                  data: {
                    treeNodeId: treeNodeData.id,
                    targetType: 2,
                    longitude: point[0],
                    latitude: point[1],
                  },
                }, '*');
              }
            }
          }, 100)
        // } else {
        //   style.enFixPoint = 0
        //   document.getElementById("map").style.cursor = ''
        //   window.parent.postMessage({
        //     message: 'message',
        //     msg: '定点失败，请在有效范围内定点',
        //   }, '*');
        // }
      }
  
    })

    // map.on('dblclick', (evt) => {
  
    //   const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f)
    //   console.info('dblclick', feature)
    //   if (feature) {

    //     if (feature.get('features')) {
    //       const features = feature.get('features')
    //       const node = features[0]
    //       window.parent.postMessage({
    //         message: 'dblclicknode',
    //         node,
    //       }, '*');
    //     } else {
    //       const node = feature.values_.data
    //       window.parent.postMessage({
    //         message: 'dblclicknode',
    //         node,
    //       }, '*');
    //     }

    //   }

    // })

    map.on('pointermove', (evt) => {

      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f)
      if (feature) {

        /*if (feature.get('features')) {

          const features = feature.get('features')
          const node = features[0]
          if (node && node.get('type') === featuretype.Rotor) {

            addOrSetInfo(node, evt.pixel, map)
  
          }
  
        } else */if (feature.get('type') === featuretype.Relay || feature.get('type') === featuretype.Fixed || feature.get('type') === featuretype.Ground ||
        feature.get('type') === featuretype.Celiang || feature.get('type') === featuretype.Center || feature.get('type') === featuretype.ctCenter) {

          const { enInfo } = feature.get('style')
          if (enInfo) {
            return false
          }
          addOrSetInfo(feature, evt.pixel, map)

        } else {

          if (currentFeature && currentFeature.infoDiv) {
            map.getOverlayContainer().removeChild(currentFeature.infoDiv)
            currentFeature = null
          }

        }
  
      } else {

        if (currentFeature && currentFeature.infoDiv) {
          map.getOverlayContainer().removeChild(currentFeature.infoDiv)
          currentFeature = null
        }
  
      }
  
    })

    map.on('contextmenu', (evt) => {

      evt.preventDefault();
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f)
      if (feature) {

        if (feature.get('features')) {
          const features = feature.get('features')
          const fStyle = features[0].get('style')
          style = fStyle || style
          menuFeature = features[0]
        } else if (feature.get('type') === featuretype.Relay || feature.get('type') === featuretype.Fixed || feature.get('type') === featuretype.Ground ||
        feature.get('type') === featuretype.Celiang || feature.get('type') === featuretype.Center || feature.get('type') === featuretype.ctCenter ||
        feature.get('type') === featuretype.Beacon) {
          const fStyle = feature.get('style')
          style = fStyle || style
          menuFeature = feature
        } else {
          return
        }
        map.addOverlay(contextmenu)
        contextmenu.setPosition(evt.coordinate)

      } else {

        map.removeOverlay(contextmenu)
        menuFeature = null

      }

    })

  }

  function onStateClick(param) {

    closeContextMenu()
    const style = menuFeature.get('style')
    if (style) {

      style[param] = !style[param]
      if (param === 'enInfo') {
        style['infoAble'] = gisConfig.infoAble
      }

    }
    menuFeature.setProperties({
      style,
    })

  }

  function onPointClick() {

    closeContextMenu()
    style.enFixPoint = 1
    document.getElementById("map").style.cursor = `url(${mousePoint}), auto`
    document.getElementById("map").style.cursorSize = '12px'

  }

  function onBeaconClick(id) {

    closeContextMenu()
    style.enBeaconPoint = id
    const treeNodeData = menuFeature.get('data')
    window.parent.postMessage({
      message: 'beacon',
      data: {
        treeNodeId: treeNodeData.id,
        targetId: id,
        targetType: 1,
      },
    }, '*');

  }

  function onPointConfirm() {
    document.getElementById("map").style.cursor = ''
  }

  function onDetailClick() {

    closeContextMenu()
    if (menuFeature) {

      if (menuFeature.get('features')) {
        const features = menuFeature.get('features')
        const node = features[0].values_.data
        window.parent.postMessage({
          message: 'detailnode',
          node,
        }, '*');
      } else {
        const node = menuFeature.values_.data
        window.parent.postMessage({
          message: 'detailnode',
          node,
        }, '*');
      }

    }

  }

  function onColorClick(e) {

    closeContextMenu()
    window.parent.postMessage({
      message: 'selectSingleColor',
      color: style.color,
      left: e.pageX,
      top: e.pageY,
    }, '*')

  }

  function onSetGisClick() {

    window.parent.postMessage({
      message: 'setGis',
      config: {
        base: gisConfig,
        center: gis.gis.center,
        // layer: gis.gis.layer,
      },
    }, '*');

  }

  function onRefreshClick() {

    window.parent.postMessage({
      message: 'refresh',
    }, '*');

  }

  function onToHeatClick() {

    window.parent.postMessage({
      message: 'toHeat',
    }, '*');

  }

  function onUpdateTarget(data) {

    Object.values(vector).forEach(item => {
      data.forEach(target => {
        if (target.treeNodeId) {
          return false;
        }
        const feature = item.getFeatureById(target.treeNodeId)
        if (feature) {
          const targetStyle = feature.get('style')
          if (target.targetType === '2' || target.targetType === 2) {
            targetStyle.enFixPoint = 3
            targetStyle.enBeaconPoint = null
          } else {
            targetStyle.enBeaconPoint = target.targetId
            targetStyle.enFixPoint = 0
          }
        }
      })
    })

  }

  function onDrawVirtual(data, visible) {
    addOrSetVirtual(vector, data, visible)
  }

  function onTrackClick() {

    closeContextMenu()
    if (menuFeature) {

      if (menuFeature.get('features')) {
        const features = menuFeature.get('features')
        const node = features[0]
        window.parent.postMessage({
          message: 'hisTrack',
          node,
        }, '*');
      } else {
        const node = menuFeature.values_.data
        window.parent.postMessage({
          message: 'hisTrack',
          node,
        }, '*');
      }

    }

  }

  function requestFrame() {
    lastTime = new Date().getTime()
    frameId = null
    const animateFn = () => {
      const current = new Date().getTime()
      const dt = current - lastTime
      if (dt >= 500) {
        cancelAnimationFrame(frameId)
        lastTime = current
        // vector.rotor.getFeatures().forEach(feature => { feature.set('flush', !feature.get('flush')) })
        
        vector.connect.getFeatures().forEach(feature => {feature.set('flush', !feature.get('flush')) })
        requestFrame()
      } else {
        requestAnimationFrame(animateFn)
      }
    }
    frameId = requestAnimationFrame(animateFn)
  }

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

      // 点击拓扑树节点的联动
      if (e.data.message === 'clickTreeNode' && e.data.node) {

        const nodeId = e.data.node.id
        const level = e.data.node.level
        let node = null
        if (level === '0') {

          node = vector.ctCenter.getFeatureById(nodeId)

        } else if (level === '1') {

          node = vector.center.getFeatureById(nodeId)

        }  else if (level === '6') {

          node = vector.celiang.getFeatureById(nodeId)

        } else if (level === '2') {

          node = vector.ground.getFeatureById(nodeId)

        } else if (level === '3') {

          node = vector.relay.getFeatureById(nodeId)

        } else if (level === '4') {

          node = vector.fixed.getFeatureById(nodeId)

        } else if (level === '5') {

          node = vector.rotor.getFeatureById(nodeId)

        } else if (level === '11') {

          node = vector.beacon.getFeatureById(nodeId)

        }
        if (node && square) {

          const pt = node.get('geometry')
          square.setProperties({
            state: true,
            geometry: pt,
            nodeId,
          })
          activeFeature = node
          //map.getView().setCenter(pt.flatCoordinates) // 设置视图中心
          //map.getView().setZoom(18) // 设置视图层级
          map.getView().animate({ // 只设置需要的属性即可
              center: pt.flatCoordinates, // 中心点
              zoom: 20, // 缩放级别
              rotation: undefined, // 缩放完成view视图旋转弧度
              duration: 1000 // 缩放持续时间，默认不需要设置
          })

        } else if (activeFeature) {

          square.setProperties({
            state: false,
          })
          activeFeature = null;

        }

      }
      // 点击拓扑图图层的联动
      if (e.data.message === 'clickCanvas') {

        if (square) {

          square.setProperties({
            state: false,
          })
          activeFeature = null

        }

      }
      // 全局GIS设置
      if (e.data.message === 'saveConfig') {

        storeLegacy.set('gisConfig', e.data.config)
        const { base, center } = e.data.config;
        Object.keys(base || {}).forEach(k => {
          gisConfig[k] = e.data.config.base[k]
        })
        if (center) {
          gis.gis.center = center
          map.getView().animate({
            center: center,
          })
        }
        // if (e.data.config.layer) {
        //   if (gis.gis.layer !== e.data.config.layer) {
        //     gis.gis.layer = e.data.config.layer
        //     map.dispose()
        //     map = null
        //     return init(gis)
        //   }
          
        // }
        Object.values(layer).forEach(node => {
          
          if (node.get('type') === 'connect') {

            node.setVisible(gisConfig.lineVisible)

          } else {

            node.changed()

          }
        })

      }
      // 获取地图初始配置  alarmStatus: 告警开关
      if (e.data.message === 'initMap') {

        console.log(e.data.config)
        const { wms, gisCoordinate, center, bounds, min, max, layer, alarmStatus = false, mapOnlineStatus = false, mapOnlineStyle } = e.data.config
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
        mapAlarmStatus = alarmStatus;
        init(gis)
        
      }
      // 接收网管socket消息
      if (e.data.message === 'socket' && e.data.list && map) {
        e.data.list.forEach((item) => {
          if (item.longitude && item.latitude) {
            const point = _option.gisCoordinate === 'WGS84' ? [item.longitude, item.latitude] : gcj02towgs84(item.longitude, item.latitude)
            item.longitude = point[0];
            item.latitude = point[1];
          }
          if (item.parentLongitude && item.parentLatitude) {
            const point = _option.gisCoordinate === 'WGS84' ? [item.parentLongitude, item.parentLatitude] : gcj02towgs84(item.parentLongitude, item.parentLatitude)
            item.parentLongitude = point[0];
            item.parentLatitude = point[1];
          }
          if (item.capPlatformList && item.capPlatformList.length > 0) {
            item.capPlatformList.forEach(platform => {
              const { longitude, latitude, oppositeLongitude, oppositeLatitude, platformUploadData } = platform
              if (longitude && latitude) {
                const point = _option.gisCoordinate === 'WGS84' ? [longitude, latitude] : gcj02towgs84(longitude, latitude)
                platform.longitude = point[0];
                platform.latitude = point[1];
              }
              if (oppositeLongitude && oppositeLatitude) {
                const point = _option.gisCoordinate === 'WGS84' ? [oppositeLongitude, oppositeLatitude] : gcj02towgs84(oppositeLongitude, oppositeLatitude)
                platform.oppositeLongitude = point[0];
                platform.oppositeLatitude = point[1];
              }
              // if (platformUploadData && platformUploadData.longitude && platformUploadData.latitude) {
              //   const point = _option.gisCoordinate === 'WGS84' ? [platformUploadData.longitude, platformUploadData.latitude] : gcj02towgs84(platformUploadData.longitude, platformUploadData.latitude)
              //   platformUploadData.longitude = point[0];
              //   platformUploadData.latitude = point[1];
              // }
            })
          }
        })
        const style = {
          enInfo: false,
          infoAble: gisConfig.infoAble,
          enLink: true,
          enSector: true,
          enTrack: false,
          color: '',
          enFixPoint: 0,
          enBeaconPoint: null,
        }
        beaconList = e.data.list.filter((item) => item.nodeType === '信标')
        autoUav(vector, square, JSON.parse(JSON.stringify(style)), e.data.list.filter((item) => item.nodeType === '小无人机'), 0, mapAlarmStatus)
        autoSector(vector, square, map, JSON.parse(JSON.stringify(style)), e.data.list.filter((item) => item.nodeType === '中继飞机'), mapAlarmStatus)
        autoFixed(vector, square, map, JSON.parse(JSON.stringify(style)), e.data.list.filter((item) => item.nodeType === '群头飞机'), mapAlarmStatus)
        autoCeliang(vector, square, map, JSON.parse(JSON.stringify(style)), e.data.list.filter((item) => item.nodeType === '测量站'))
        autoGround(vector, square, map, JSON.parse(JSON.stringify(style)), e.data.list.filter((item) => item.nodeType === '地面站'))
        autoCenter(vector, square, map, JSON.parse(JSON.stringify(style)), e.data.list.filter((item) => item.nodeType === '演示中心'))
        autoCtcenter(vector, square, map, JSON.parse(JSON.stringify(style)), e.data.list.filter((item) => item.nodeType === '控制中心'))
        autoBeacon(vector, square, map, JSON.parse(JSON.stringify(style)), beaconList, mapAlarmStatus)
      }

      // 定点模式回显
      if (e.data.message === 'fixPoint' && menuFeature) {
        const style = menuFeature.get('style')
        if (e.data.success) {
          style.enFixPoint = 3
          style.enBeaconPoint = null
        } else {
          style.enFixPoint = 0
        }
      }

      // 自动跟踪模式回显
      if (e.data.message === 'beacon' && menuFeature) {
        const style = menuFeature.get('style')
        if (e.data.success) {
          style.enFixPoint = 0
          document.getElementById("map").style.cursor = ''
        } else {
          style.enBeaconPoint = null
        }
      }

      // 更新节点定点模式、自动跟踪模式菜单状态
      if (e.data.message === 'updateTarget') {
        onUpdateTarget(e.data.data)
      }

      // 绘制虚拟点测试区域
      // if (e.data.message === 'drawVirtual') {
      //   if (_option.gisCoordinate !== 'WGS84') {
      //     e.data.data.forEach(item => {
      //       if (item.longitude && item.latitude) {
      //         const point = _option.gisCoordinate === 'WGS84' ? [item.longitude, item.latitude] : gcj02towgs84(item.longitude, item.latitude)
      //         item.longitude = point[0];
      //         item.latitude = point[1];
      //       }
      //     })
      //     e.data.area = (e.data.area || []).map(item => gcj02towgs84(item[0], item[1]))
      //   }
      //   onDrawVirtual(e.data.data, e.data.visible)
      //   const areaJson = {
      //     "type": "FeatureCollection",
      //     "features": [
      //       {
      //         "type": "Feature",
      //         "geometry": {
      //           "type": "Polygon",
      //           "coordinates": e.data.visible ? [e.data.area] : []
      //         }
      //       }
      //     ]
      //   }
      //   const vectorSource = new Vector({
      //     features: new GeoJSON().readFeatures(areaJson),
      //   });
      //   virtualAreaLayer.setSource(vectorSource);
      // }

      // 刷新功能
      if (e.data.message === 'refresh') {
        Object.values(vector).forEach(item => {
          item.clear();
        })
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
    const config = storeLegacy.get('gisConfig')
    if (config) {

      Object.keys(config.base).forEach(k => {
        gisConfig[k] = config.base[k]
      })

    }

  })
  
  onDestroy(() => {

    unsubscribe()

  })
</script>

<main class="wrapper">
  <section class="map" id="map"></section>
  <section id="overlay"></section>
  <section id="contextmenu"> 
    <button class="detail button" on:click={onDetailClick}>详细信息</button>
    {#if menuFeature }
      {#if  menuFeature.get('data').treeLevel !== '5' && menuFeature.get('data').treeLevel !== '11' }
        <div class="line"></div>
        {#if  menuFeature.get('data').treeLevel === '3' || menuFeature.get('data').treeLevel === '4' }
        <button class="button" on:click={() => onPointClick('enSector')}>
          {#if style.enFixPoint === 3 }<img src={enableIcon} alt="" />{/if}定点模式
        </button>
        <div class="beacon-menu">
          <button class="button">自动跟踪模式<img class="right-icon" src={rightIcon} alt="" /></button>
          <ul>
            {#if beaconList.length > 0 }
              {#each beaconList as item}
                <li>
                  <button class="button" on:click={() => onBeaconClick(item.id)}>{#if style.enBeaconPoint === item.id }<img src={enableIcon} alt="" />{/if}{item.nodeName}</button>
                </li>
              {/each}
            {:else}
                <div class="empty">暂无数据</div>
            {/if}
          </ul>
        </div>
        {/if}
        <button class="actual button" on:click={() => onStateClick('enInfo')}>{#if style.enInfo }<img src={enableIcon} alt="" />{/if}伺服天线信息</button>
        {#if menuFeature.get('data').treeLevel !== '0' }
          <button class="link button" on:click={() => onStateClick('enLink')}>{#if style.enLink }<img src={enableIcon} alt="" />{/if}链路</button>
        {/if}
        <button class="button" on:click={() => onStateClick('enSector')}>{#if style.enSector }<img src={enableIcon} alt="" />{/if}覆盖扇区</button>
      {/if}
      {#if menuFeature.get('data').treeLevel === '3' || menuFeature.get('data').treeLevel === '4' || menuFeature.get('data').treeLevel === '5' }
        <button class="button" on:click={() => onStateClick('enTrack')}>{#if style.enTrack }<img src={enableIcon} alt="" />{/if}实时轨迹</button>
        <div class="line"></div>
        <button class="button" on:click={onTrackClick}>历史轨迹</button>
      {/if}
    {/if}
  </section>
  {#if style.enFixPoint === 2 }
    <section id="confirm">
      <p></p>
      <button class="btnConfirm button">确定</button>
      <button class="btnCancel button" on:click={() => style.enFixPoint = 1 }>取消</button>
    </section>
  {/if}
  <picture class="location"></picture>
  <picture class="toHeat" on:click={onToHeatClick}></picture>
  <picture class="setGis" on:click={onSetGisClick}></picture>
  <picture class="refresh" on:click={onRefreshClick}></picture>
</main>
<!-- {#if scaleZoomVisible}
<span class="scale-text">Scale = 1 : {scaleText} &nbsp;&nbsp;&nbsp;&nbsp; Zoom = {currentZoom}</span>
{/if} -->