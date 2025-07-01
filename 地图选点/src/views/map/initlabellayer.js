import { Style, Text, Fill } from 'ol/style'
import { Vector } from "ol/source"
import { Vector as Layer } from "ol/layer"
import { GeoJSON } from 'ol/format'

export default function initLabelLayer(config) {

    const { markVisible, villageVisible, railwayVisible, riversVisible } = config
    const villageLayer = new Layer({
        visible: markVisible && villageVisible,
        source: new Vector({
            format: new GeoJSON(),
            url: 'assets/places.geojson'
        }),
        style(feature, resolution) {
            console.log(feature, resolution)
            const text = resolution > 0.0001 ? '' : feature.get('name')
            return new Style({
            text: new Text({
                font: 'bold 12px "Open Sans", "Arial Unicode MS", "sans-serif"',
                placement: 'point',
                text,
                fill: new Fill({
                    color: '#8DC2EC',
                }),
            }),
            })
        },
        declutter: true
    })
  
    const railwayLayer = new Layer({
        visible: markVisible && railwayVisible,
        source: new Vector({
            format: new GeoJSON(),
            url: 'assets/railways.geojson'
        }),
        style(feature, resolution) {
            const text = resolution > 0.0003 ? '' : feature.get('name')
            return new Style({
            text: new Text({
                font: 'bold 12px "Open Sans", "Arial Unicode MS", "sans-serif"',
                placement: 'line',
                text,
                fill: new Fill({
                    color: '#6DB1E6',
                }),
            }),
            })
        },
        declutter: true
    })
  
    const waterwayLayer = new Layer({
        visible: markVisible && riversVisible,
        source: new Vector({
            format: new GeoJSON(),
            url: 'assets/waterways.geojson'
        }),
        style(feature, resolution) {
            const text = resolution > 0.0002 ? '' : feature.get('name')
            return new Style({
            text: new Text({
                font: 'bold 12px "Open Sans", "Arial Unicode MS", "sans-serif"',
                placement: 'line',
                text,
                fill: new Fill({
                    color: '#76B6E8',
                }),
            }),
            })
        },
        declutter: true
    })

    return [
        villageLayer,
        railwayLayer,
        waterwayLayer,
    ]

}