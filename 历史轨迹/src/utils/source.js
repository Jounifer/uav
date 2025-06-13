import {
  writable, get,
} from 'svelte/store'
import { Resource } from '@/medium'
import streams from '@/assets/streams'
import querystring from './querystring'


const config = writable({
  user: [
    'stitch',
    'single',
  ],
  mediaService: 'http://172.16.34.31:3001/',
  roomId: querystring('roomId') || '62762a3e23c325070124a3bf',
  role: 'presenter',
  view: 'common',
  stream: querystring('stream') || 'sub',
  roomStream: '',
})

const resource = new Resource()

function getConfig() {

  return get(config)

}

function setConfig(data) {

  config.set(Object.assign(getConfig(), data || {}))

}

resource.load(streams)

export default {
  setConfig,
  getConfig,
  resource,
}
