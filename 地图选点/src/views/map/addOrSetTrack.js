import { MultiLineString } from 'ol/geom'
import { Feature } from 'ol'

export default function addOrSetTrack(id, list, vector) {

    const feat = vector.getFeatureById(id)
    if (!feat) {

        const feature = new Feature({
            geometry: new MultiLineString([list.map((i) => [
                i.longitude,
                i.latitude,
            ])]),
        });
        feature.setId(id)
        vector.addFeature(feature)

    } else {

        feat.setProperties({
            geometry: new MultiLineString([list.map((i) => [
                i.longitude,
                i.latitude,
            ])]),
        })

    }

}