/**
 * 创建与Qt通信的通道
 */
import {
  isQtEnv, store, log,
} from '@/utils'

export const req = {
  GIS: 0,
  Ping: 1,
  Pong: 2,
  Ready: 3,
  Monitor: 4,
  Home: 5,
  BtnTop: 6,
  BtnMiddle: 7,
  BtnDown: 8,
  Media: 9,
  Camera: 10,
  Opened: 11,
  Closed: 12,
  Message: 13
}

/**
 * 处理来自Qt的实时数据
 */
const _handleMessage = (message) => {

  store.set(message)

}

export const createChannel = () => new Promise((resolve, reject) => {

  if (isQtEnv()) {

    window.qt.channel = new QWebChannel(window.qt.webChannelTransport, (obj) => {

      window.qt.bridge = obj.objects.bridge
      window.qt.bridge.message.connect(_handleMessage)
      resolve()

    })

  } else {

    reject()

  }

})

/**
 * 向Qt提交数据
 * @param { Any } param
 */
export const submit = (param) => {

  if (isQtEnv() && !!window.qt.bridge) {

    window.qt.bridge.submit(param)

  }

}
