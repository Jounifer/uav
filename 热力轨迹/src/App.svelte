<script>
	// import StitchStream from './views/StitchStream.svelte'
	// import Stream from './views/Stream.svelte'
	import Map from '@/views/map/Map.svelte'
	
	// import {
	//   createChannel, req
	// } from '@/channel'
	// import {
	//   querystring, log, store, source, state

	// } from '@/utils'

	// log.setLevel('debug')

	// const view = querystring('view')

	// window.setInfo = (param) => {
	// 	if (param.res === req.Camera) {
	// 		source.resource.load(param.data)
	// 	} else  if (param.res === req.Media) {
	// 		source.setConfig(param.data)
	// 	} else if (param.res === req.Monitor) {
	// 		state.set({loaded: true})
	// 	} else if (param.res === req.Closed) {
	// 		state.set({loaded: false})
	// 	} else {

	// 		store.set(param)
	// 	}
	// }
	
	// createChannel().catch(() => log.debug('Is not Qt environment'))
</script>

<!-- {#if view === 'stitch'}
	<StitchStream/>
{/if}

{#if view === 'single'}
	<Stream/>
{/if}

{#if view === 'map'} -->
	<Map/>
<!-- {/if} -->
