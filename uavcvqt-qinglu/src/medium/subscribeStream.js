import Resource from './resource'
import client from '@/client'

export default (stream, element) => new Promise((resolve, reject) => {

  if (stream) {

    client.subscribe(stream, {
      audio: false,
      video: Resource.formatParam(stream.source.video),
    }).then((subscribe) => {

      if (subscribe) {

        element.id = stream.id
        element.autoplay = true
        element.muted = true
        element.className = 'stream'
        element.srcObject = stream.mediaStream
        resolve(subscribe)

      }

    })
      .catch(reject)

  }

})
