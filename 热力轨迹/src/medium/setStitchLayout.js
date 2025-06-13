import {
  log, source,
} from '@/utils'
import { setLayout } from '@/api'
import client from '@/client'

/**
 * 设置融屏流整体布局
 */

const setStitchLayout = () => new Promise((resolve, reject) => {

  if (source.resource.isFinished()) {

    if (client && client.info) {

      const config = source.getConfig()
      const layouts = source.resource.formatLayout()

      if (layouts.length > 1) {

        setLayout({
          room: config.roomId,
          stream: config.roomStream,
          view: layouts,
        }).then(resolve)
          .catch(reject)

      }

      log.debug('setStitchLayout', JSON.stringify(layouts))

    }

  } else {

    setTimeout(() => setStitchLayout(), 300)

  }

})
export default setStitchLayout
