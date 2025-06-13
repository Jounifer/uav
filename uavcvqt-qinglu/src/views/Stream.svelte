<script>
  import {
    store, source, querystring,
} from '@/utils'
  import { submit } from '@/channel'
  import {
    createToken, hanleError,
} from '@/api'
  import {
    onMount, onDestroy,
} from 'svelte'
  import client from '@/client'
  import { subscribeStream } from '@/medium'
  
  let _video = null
  let streamId = ''
  let subscribe = null
  let unhandleMsgFromStore = null

  function init() {

    // todo

  }

  function ondblclick() {

    submit({
      request: 'doubleClick',
      data: 'msg',
    })

  }

  function release(msg) {

    if (!msg || msg.response === 'release') {

      if (unhandleMsgFromStore) {

        unhandleMsgFromStore()
  
      }
  
      if (client && !!client.info) {

        client.leave()
  
      }
  
      if (subscribe) {

        subscribe.stop()
  
      }
  
    }

  }


  function subscribeSingleStream(config) {

    streamId = querystring('stream')
    const stream = client.info.remoteStreams.find((n) => n.id === streamId)
    subscribeStream(client, stream, _video).then((sub) => {

      subscribe = sub
      sub.addEventListener('error', (err) => console.warn('OWT.Client.subscribe', JSON.stringify(err)))
      sub.addEventListener('ended', () => setTimeout(() => subscribeSingleStream(config), 5000))
  
    })
      .catch(() => setTimeout(() => subscribeSingleStream(config), 5000))

  }

  function readyToStartStream(msg) {

    if (msg.response === 'show') {

      // todo
      const config = source.getConfig()
      createToken({
        room: config.roomId,
        user: config.user[1],
        role: config.role,
      }).then((token) => {

        client.join(token).then(() => subscribeSingleStream(config))
          .catch((err) => console.warn('OWT.Client.Login', JSON.stringify(err)))
  
      })
        .catch(hanleError)
  
    }

  }

  if (!unhandleMsgFromStore) {

    unhandleMsgFromStore = store.subscribe((data) => {

      // todo
      if (data) {

        readyToStartStream(data.message)
        release(data.message)
  
      }
  
    })

  }

  onMount(init)
  onDestroy(release)
</script>
<div class="container">
  <video on:dblclick="{ondblclick}" bind:this="{_video}" class="stream" autoplay>
    <track kind="captions"/>
    this browser does not supported video tag
  </video>
</div>