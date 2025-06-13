import {
  store, source, contains, log, isQtEnv,
} from '@/utils'
import {
  createToken, hanleError, getStreams, startStreamingIn, mixStream, deleteStream, clearStreams,
} from '@/api'

import client from '@/client'
import {
  subscribeStream, setStitchLayout, Resource,
} from '@/medium'

export default class StitchStream {

  constructor(eleDom) {

    this._video = eleDom
    this.sub = null
    this.timeId = null
    this.unhandleMsgFromStore = null
    this.tryCount = 0

  }

  /**
   * 重新载入
   */
  reloadStreamingIn() {

    const config = source.getConfig()
    const faileds = source.resource.getData().filter((n) => n.pull === Resource.state.Failed)
    log.debug('reloadStreamingIn', JSON.stringify(faileds))

    faileds.forEach((node, index) => {

      startStreamingIn({
        room: config.roomId,
        index: node.index,
        url: node[config.stream],
      }).then((res) => {

        source.resource.setItem(node.stream, { pull: Resource.state.Success })
        mixStream({
          room: config.roomId,
          stream: res.id,
          view: config.view,
        }).then(() => {

          faileds.splice(index, 1)
          this._video.pause()
          setStitchLayout().then(() => this._video.play())
            .catch(hanleError)
          deleteStream({
            room: config.roomId,
            stream: node.sid,
          }).catch(hanleError)

        })
          .catch(hanleError)

      })
        .catch(() => {

          this.tryToReaddStream()

        })

    })

  }

  /**
   * 加流失败后，失败的重试
   */
  tryToReaddStream() {

    clearTimeout(this.timeId)
    this.timeId = setTimeout(() => this.reloadStreamingIn(), 5000)

  }

  static releaseRemoteStream() {

    if (isQtEnv()) {

      const config = source.getConfig()

      if (config.roomId) {

        clearStreams(config.roomId).catch(hanleError)

      }

    }

  }

  release(msg) {

    return new Promise((resolve) => {

      clearTimeout(this.timeId)
      StitchStream.releaseRemoteStream()
      if (!msg || msg.res === 'release') {

        if (this.unhandleMsgFromStore) {

          this.unhandleMsgFromStore()

        }

        if (client && !!client.info) {

          log.debug('client.leave ')
          client.leave()

        }

        if (this.sub) {

          this.sub.stop()
          this.sub = null

        }

      }

      setTimeout(() => resolve(), 300)

    })

  }

  /**
   * 添加流失败则提供一个默认流进行占位
   */
  addErrorStream(config, stream) {

    // 失败的流暂存，后启动任务去轮询重试
    this.tryToReaddStream(config, stream)

    return new Promise((resolve) => {

      startStreamingIn({
        room: config.roomId,
        index: stream.index,
        url: 'file:///home/streaming_agent/disconnect_video.h264',
      }).then((res) => {

        source.resource.setItem(stream.stream, { pull: Resource.state.Failed })
        mixStream({
          room: config.roomId,
          stream: res.id,
          view: config.view,
        }).then(resolve)
          .catch(hanleError)

      })
        .catch(hanleError)

    })

  }

  /**
   * 从配置里读取，逐条添加
   */
  localStitchStreamIn() {

    return new Promise((resolve) => {

      const config = source.getConfig()
      let fnId = null
      log.debug('localStitchStreamIn', JSON.stringify(config))

      getStreams(config.roomId).then((data) => {

        const streams = data.filter((node) => node.type === 'forward')
        const streamSources = source.resource.getData()

        /** Qt下不支持的处理方式 */
        const resolves = []
        streamSources.forEach((node, index) => {

          log.debug('stream.contains-in', contains(streams, node.stream), contains(streams, node.sid))
          const func = new Promise((resolve) => {

            if (!contains(streams, node.stream) && !contains(streams, node.sid)) {

              startStreamingIn({
                room: config.roomId,
                url: node[config.stream],
                index,
              }).then((res) => {

                source.resource.setItem(node.stream, { pull: Resource.state.Success })
                mixStream({
                  room: config.roomId,
                  stream: res.id,
                  view: config.view,
                }).then(resolve)
                  .catch(hanleError)

              })
                .catch(() => this.addErrorStream(config, node).then(resolve))

            } else {

              if (contains(streams, node.stream)) {

                source.resource.setItem(node.stream, { pull: Resource.state.Failed })

              }
              if (contains(streams, node.sid)) {

                this.tryToReaddStream()

              }
              resolve()

            }

          })
          resolves.push(func)

        })

        Promise.all(resolves).then(() => {

          clearTimeout(fnId)
          fnId = setTimeout(() => resolve(), 200)

        })
          .catch((err) => {

            console.warn('all', err)

          })

      })
        .catch(() => setTimeout(() => this.readyToStartStitch({ res: 'show' }), 5000))

    })

  }

  /**
   * 订阅流失败或中断后重试
   */
  tryToReopenStream() {

    try {

      this.release()

    } catch (e) {

      log.info(e)

    } finally {

      const config = source.getConfig()
      this.tryCount += 1
      log.info('tryToReopenStream', this.tryCount)
      getStreams(config.roomId).then((data) => {

        // client = new Owt.Conference.ConferenceClient()
        const streams = data.filter((node) => node.type === 'forward')

        if (streams.length === 0) {

          this.localStitchStreamIn().then(() => this.startStitchStream().then(() => setStitchLayout()))
          log.info('reload-localStitchStreamIn')

        } else {

          this.startStitchStream()
          this.tryCount = 0
          log.info('tryToReopenStream-startStitchStream')

        }

      })
        .catch(() => setTimeout(() => this.tryToReopenStream(), 5000))

    }

  }

  /**
   * @description 订阅流
   * @param { Object } remoteStreams
   * @param { Object } config
   */
  subscribeStitchStream(remoteStreams, config) {

    const stream = remoteStreams.find((n) => String(n.id).includes(config.view))
    log.debug('subscribeStitchStream-start', JSON.stringify(stream))
    if (stream) {

      source.setConfig({ roomStream: stream.id })

    }

    if (this.sub) {

      this.sub.stop()

    }
    subscribeStream(stream, this._video).then((sub) => {

      this.sub = sub
      sub.addEventListener('error', (err) => {

        log.warn('OWT.Client.subscribe', JSON.stringify(err))
        setTimeout(() => this.tryToReopenStream(), 5000)

      })

      // sub.addEventListener('ended', () => setTimeout(() => subscribeStitchStream(remoteStreams, config), 5000))

    })
      .catch((err) => {

        log.error('subscribeStitchStream', err)
        setTimeout(() => this.subscribeStitchStream(remoteStreams, config), 5000)

      })

  }

  startStitchStream() {

    const config = source.getConfig()
    log.debug('startStitchStream', JSON.stringify(config))

    return createToken({
      room: config.roomId,
      user: config.user[0],
      role: config.role,
    }).then(async (token) => {

      log.debug('createtoken', token)
      await client.join(token).then(({
        remoteStreams,
      }) => this.subscribeStitchStream(remoteStreams, config))
        .catch((err) => log.warn('OWT.Client.Login', JSON.stringify(err)))

    })
      .catch(hanleError)

  }

  readyToStartStitch(msg) {

    log.debug('Handle message from Qt', JSON.stringify(msg))
    if (msg.res === 'show') {

      this.localStitchStreamIn().then(() => this.startStitchStream().then(() => setStitchLayout()))

    }

    if (msg.res === 'close') {

      this.release()

    }

  }

  ready() {

    if (!this.unhandleMsgFromStore) {

      this.unhandleMsgFromStore = store.subscribe((data) => {

        if (data) {

          log.debug('subscribe msg from Qt', JSON.stringify(data))
          this.release(data.message)
          this.readyToStartStitch(data.message)

        }

      })

    }

    if (source.resource.getData().length === 0) {
      setTimeout(() => {
        this.ready()
      }, 500)
    } else {
      log.debug('Init is ready')
      store.set({ message: { res: 'show' } })
    }
  }

}
