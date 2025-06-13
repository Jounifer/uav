<script>
  import { submit, req } from '@/channel'
  import StitchStream from '@/medium/stitchstream'
  import {
    onMount, onDestroy,
  } from 'svelte'
  import { log, state, store } from '@/utils'
  
  import StitchGrid from './StitchGrid.svelte'
  
  let _video = null
  let stream = null
  let loaded = false

  function ondblclick() {

    submit({
      req: 'doubleclick',
      data: 'msg',
    })

  }

  const unsubState = state.subscribe(data => {
    loaded = data.loaded
    if (data.loaded) {
      stream.ready()
    } else {
      stream.release()
    }
  })

  // const unsubStore = store.subscribe(data => {
  //   if (!!data && data.res === req.Monitor) {
  //     if (data.data === req.Closed) {
  //       stream.release()
  //     }
  //   }
  // })

  onMount(() => {

    stream = new StitchStream(_video)

  })
  onDestroy(() => {

    // unsubStore()
    unsubState()
    stream.release()

  })
</script>
<div class="container">
  <video on:dblclick="{ondblclick}" bind:this="{_video}" class="stream" autoplay>
    <track kind="captions"/>
    this browser does not supported video tag
  </video>
  {#if loaded}
    <StitchGrid/>
  {/if}
</div>