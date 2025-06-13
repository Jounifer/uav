/**
 * API for owt client
 */
import request from './request'

export const hanleError = (err) => err

/**
 * @method createRoom
 * @param { Object } data
 * @param { String } data.name room name
 * @param { Object } data.options room options
 * @returns { Promise }
 */
export const createRoom = (data) => request.post('/rooms', data)

/**
 * @method updateRoom
 * @param { Object } data
 * @param { String } data.name room name
 * @param { String } data.rooms
 * @param { Object } data.options room options
 * @returns { Promise }
 */
export const updateRoom = (data) => {

  const {
    rooms, ...options
  } = data

  return request.put([
    '/rooms',
    rooms,
  ].join('/'), options)

}

/**
 * @method deleteRoom
 * @param { String } room 房间号
 * @returns { Promise }
 */
export const deleteRoom = (room) => request.delete([
  '/rooms',
  room,
].join('/'))

/**
 * @method getParticipants
 * @param { String } room
 * @returns { Promise }
 */
export const getParticipants = (room) => request.get([
  '/rooms',
  room,
  'participants',
].join('/'))

/**
 * @method permissionUpdate
 * @param { Object } data
 * @param { String } data.room 房间号
 * @param { String } data.participant
 * @param { Object } data.options
 * @returns { Promise }
 */
export const permissionUpdate = (data) => {

  const {
    room, participant, ...options
  } = data

  return request.patch([
    '/rooms',
    room,
    'participants',
    participant,
  ].join('/'), {
    op: 'replace',
    path: '/permission/publish',
    value: options,
  })

}

/**
 * @method deleteParticipants
 * @param { Object } data
 * @param { String } data.room
 * @param { String } data.participant
 * @returns
 */
export const deleteParticipants = (data) => request.delete([
  '/rooms',
  data.room,
  'participants',
  data.participant,
].join('/'))

/**
 * @method mixStream
 * @param { Object } data
 * @param { String } data.room
 * @param { String } data.stream
 * @param { String } data.view
 * @returns { Promise }
 */
export const mixStream = (data) => {

  const {
    room, stream, view,
  } = data

  return request.patch([
    '/rooms',
    room,
    'streams',
    stream,
  ].join('/'), [
    {
      op: 'add',
      path: '/info/inViews',
      value: view,
    },
  ])

}

export const unmixStream = (data) => {

  const {
    room, stream, view,
  } = data

  return request.patch([
    '/rooms',
    room,
    'streams',
    stream,
  ].join('/'), {
    op: 'remove',
    path: '/info/inViews',
    value: view,
  })

}

/**
 * @method getStreams
 * @param { String } room
 * @returns { Promise }
 */
export const getStreams = (room) => request.get([
  '/rooms',
  room,
  'streams',
].join('/'))

/**
 * @method deleteStream
 * @param { Object } data
 * @param { String } data.room
 * @param { String } data.stream
 * @returns { Promise }
 */
export const deleteStream = (data) => {

  const {
    room, stream,
  } = data

  return request.delete([
    '/rooms',
    room,
    'streams',
    stream,
  ].join('/'))

}

/**
 * @method setLayout
 * @param { Object } data
 * @param { String } data.room
 * @param { String } data.stream
 * @param { Array<Object> } data.view
 * @returns { Promise }
 */
export const setLayout = (data) => {

  const {
    room, stream, view,
  } = data

  return request.patch([
    '/rooms',
    room,
    'streams',
    stream,
  ].join('/'), [
    {
      op: 'replace',
      path: '/info/layout',
      value: view,
    },
  ])

}

/**
 * @method activeLayout
 * @param { Object } data
 * @param { String } data.room
 * @param { String } data.mixedStream
 * @param { Number } data.pos
 * @param { String } data.subStream
 * @returns { Promise }
 */
export const activeLayout = (data) => {

  const {
    room, mixedStream, subStream, pos,
  } = data

  return request.patch([
    '/rooms',
    room,
    'streams',
    mixedStream,
  ].join('/'), {
    op: 'replace',
    path: `/info/layout/${pos}/stream`,
    value: subStream,
  })

}

/**
 * @method getRecording
 * @param { String } room
 * @returns { Promise }
 */
export const getRecording = (room) => request.get([
  '/rooms',
  room,
  'recordings',
].join('/'))

/**
 * @method startRecording
 * @param { Object } data
 * @param { String } data.room
 * @param { String } data.audioFrom
 * @param { String } data.videoFrom
 * @param { String } data.filename
 * @param { String } data.container
 * @returns { Promise }
 */
export const startRecording = (data) => {

  const {
    room, audioFrom, videoFrom, container, filename,
  } = data

  return request.post([
    '/rooms',
    room,
    'recordings',
  ].join('/'), {
    media: {
      audio: { from: audioFrom },
      video: { from: videoFrom },
      container: container || 'auto',
      filename,
    },
  })

}

/**
 * @method  stopRecording
 * @param { Object } data
 * @param { String } data.room
 * @param { String } data.id
 * @returns { Promise }
 */
export const stopRecording = (data) => {

  const {
    room, id,
  } = data

  return request.delete([
    '/rooms',
    room,
    'recordings',
    id,
  ].join('/'))

}

/**
 * @method getStreamingOuts
 * @param { String } room
 * @returns { Promise }
 */
export const getStreamingOuts = (room) => request.get([
  '/rooms',
  room,
  'streaming-outs',
].join('/'))

/**
 * @method startStreamingOut
 * @param { Object } data
 * @param { String } data.room
 * @param { string } data.protocol
 * @param { String } data.url
 * @param { Object } data.media
 * @param { Boolean } data.media.audio
 * @param { Object } data.media.video
 * @param { String } data.media.video.from streamId
 * @param { Object } data.media.video.format codec: h264, profile: CB
 * @param { Object } data.media.video.parameters keyFrameInterval:30 resolution:{width:640,height:480}, framerate:24
 * @returns { Promise }
 */
export const startStreamingOut = (data) => {

  const {
    room, protocol, url, media,
  } = data

  return request.post([
    '/rooms',
    room,
    'streaming-outs',
  ].join('/'), {
    protocol,
    url,
    media,
  })

}

/**
 * @method stopStreamingOut
 * @param { Object } data
 * @param { String } data.room
 * @param { String } data.outId
 * @returns { Promise }
 */
export const stopStreamingOut = (data) => {

  const {
    room, outId,
  } = data

  return request.delete([
    '/rooms',
    room,
    'streaming-outs',
    outId,
  ].join('/'))

}

/**
 * @method startStreamingIn
 * @param { Object } data
 * @param { String } data.room
 * @param { String } data.url
 * @param { Number } data.index
 * @param { String } data.protocol
 * @param { Number } data.bufferSize
 * @returns
 */
export const startStreamingIn = (data) => {

  const {
    room, url, protocol, bufferSize, index,
  } = data

  return request.post([
    '/rooms',
    room,
    'streaming-ins',
  ].join('/'), {
    url,
    index,
    media: {
      audio: 'auto',
      video: true,
    },
    transport: {
      protocol: protocol || 'tcp',
      bufferSize: bufferSize || 2048,
    },
  })

}

/**
 * @method stopStreamingIn
 * @param { Object } data
 * @param { String } data.room
 * @param { String } data.streamId
 * @returns
 */
export const stopStreamingIn = (data) => {

  const {
    room, streamId,
  } = data

  return request.delete([
    '/rooms',
    room,
    'streaming-ins',
    streamId,
  ].join('/'))

}

/**
 * @method createToken
 * @param { Object } data
 * @param { String } data.room
 * @param { String } data.user
 * @param { String } data.role
 * @returns { Promise }
 */
export const createToken = (data) => {

  const {
    room, user, role,
  } = data

  return request.post('/tokens', {
    room,
    user,
    role: role || 'presenter',
  })

}

/**
 * @method clearStreams
 * @param { String } room 房间号
 * @returns { Promise }
 * @description 清空房间里流
 */
export const clearStreams = (room) => request.delete(`/rooms/${room}/streams`)
