import { Tile } from 'ol/layer'
import { XYZ } from 'ol/source'
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoiam91bmlmZXIiLCJhIjoiY21icHlva2VsMDloMzJpcTQ5b2EzMmVtaSJ9.Zc5eUr9gFbZd1-KwDHjhgw'

export default {
  satellite: new Tile({
    source: new XYZ({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attributions: 'Tiles © Esri',
    }),
    title: '卫星影像',
  }),
  terrain: new Tile({
    source: new XYZ({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
      attributions: 'Tiles © Esri',
    }),
    title: '地形图',
  }),
  osmHumanitarian: new Tile({
    source: new XYZ({ url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png' }),
    title: 'OSM 人道主义风格',
  }),
  gaode: new Tile({
    source: new XYZ({
      title: '高德',
      url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
    }),
  }),
  imgTianditu: new Tile({
    title: '天地图影像图层',
    source: new XYZ({
      url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=2a890fe711a79cafebca446a5447cfb2',
      attibutions: '天地图注记描述',
      crossOrigin: 'anoymous',
      wrapX: false,
    }),
  }),
  ciaTianditu: new Tile({
    title: '天地图影像注记图层',
    source: new XYZ({
      url: 'http://t0.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=2a890fe711a79cafebca446a5447cfb2',
      attibutions: '天地图注记描述',
      crossOrigin: 'anoymous',
      wrapX: false,
    }),
  }),
  streetsV11: new Tile({
    title: '街道地图',
    source: new XYZ({
      name: '街道地图',
      url: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`,
      attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }),
  }),
  outdoorsV11: new Tile({
    title: '户外地图',
    source: new XYZ({
      name: '户外地图',
      url: `https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`,
      attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }),
  }),
  lightV10: new Tile({
    title: '浅色地图',
    source: new XYZ({
      name: '浅色地图',
      url: `https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`,
      attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }),
  }),
  darkV10: new Tile({
    title: '深色地图',
    source: new XYZ({
      name: '深色地图',
      url: `https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`,
      attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }),
  }),
  satelliteStreetsV11: new Tile({
    title: '卫星混合',
    source: new XYZ({
      name: '卫星混合',
      url: `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`,
      attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }),
  }),
  satelliteV9: new Tile({
    title: '纯卫星图',
    source: new XYZ({
      name: '纯卫星图',
      url: `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`,
      attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }),
  }),
}
