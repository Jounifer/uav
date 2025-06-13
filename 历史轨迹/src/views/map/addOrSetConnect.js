import { Feature } from 'ol'
import { LineString } from 'ol/geom'
import featuretype from './featuretype'
import getDistance from './getdistance'
import getRotation from './getrotation'

export default function addOrSetConnect(node, lineVector) {

    const {longitude, latitude, id, parentState, parentLongitude, parentLatitude} = node
    const line = lineVector.getFeatureById("line" + id)
    if (parentState >= 0 && parentState < 4 && parentLongitude && parentLatitude) {
        const target = [longitude, latitude]
        const source = [parentLongitude, parentLatitude]
        if (line) {
            line.setProperties({
                geometry: new LineString([
                    target,
                    source,
                ]),
                label: getDistance(target, source),
                rotation: getRotation(target, source),
            })
        } else {
            const lf = new Feature({
                type: featuretype.Line,
                geometry: new LineString([
                    target,
                    [parentLongitude, parentLatitude],
                ]),
                label: getDistance(target, source),
                rotation: getRotation(target, source),
            })
            lf.setId("line" + id)
            lineVector.addFeature(lf)
        }
    } else {
        if (line) {
            lineVector.removeFeature(line)
        }
    }

}