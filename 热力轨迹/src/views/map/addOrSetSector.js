import { Polygon } from 'ol/geom'
import createSector from './createsector'
import createSectorPoint from './createsectorpoint'

export default function addOrSetSector(node, vector, radius) {

    const { longitude, latitude,capPlatformList, nodeType } = node;
    (capPlatformList || []).forEach((i) => {

        const feat = vector.getFeatureById(i.id)
        if (i.state !== 4 && i.platformUploadData && i.platformUploadData.rotationAngleH !== null && i.platformUploadData.rotationAngleH !== undefined) {
            const { id, online, platformUploadData: { rotationAngleH} } = i
            const color = nodeType === '群头飞机' ? 'rgba(91, 253, 67, .45)' : 'rgba(233, 57, 85, .45)'
            const pt = [longitude, latitude]
            if (!feat) {
  
                vector.addFeature(createSector(pt, radius, (i.platformUploadData.rotationAngleH || 0) + 15, 30, {
                    color,
                    type: nodeType,
                    id,
                    rotationAngleH,
                    online,
                    pt,
                }))
    
            } else {
    
                const p = new Polygon(createSectorPoint(pt, radius, (rotationAngleH || 0) + 15, 30))
                feat.setProperties({
                    geometry: p,
                    color,
                    id,
                    rotationAngleH,
                    online,
                    pt,
                })
    
            }
        } else {

            if (feat) {
                vector.removeFeature(feat)
            }

        }

    })

}