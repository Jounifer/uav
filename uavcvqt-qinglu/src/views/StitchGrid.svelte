<script>
  import {
    log, source,
} from '@/utils'
  import { onMount } from 'svelte'
  import { submit } from '@/channel'
  import { setStitchLayout } from '@/medium'
  

  let style = ''
  let current = null
  let streams = []

  /**
   * 拖拽结束后更新stream信息
   */
  function updateStream(fromId, toId) {

    return new Promise((resolve) => {

      const sources = source.resource.getData()
      const from = sources.find((n) => n.stream === fromId)
      const to = sources.find((n) => n.stream === toId)
  
      if (from && to) {
  
        const {
          pos,
        } = from
        from.pos = to.pos
        to.pos = pos
        source.resource.setItem(from.stream, { pos: from.pos })
        source.resource.setItem(to.stream, { pos: to.pos })
  
      }
      resolve()
  
    })

  }

  function preventDefault(evt) {

    evt.preventDefault()
  
    // current.toggleAttribute('enter', false)
    evt.target.toggleAttribute('over', false)

  }

  function onstart(evt, data) {

    current = evt.target
    current.toggleAttribute('enter', true)
    evt.dataTransfer.setData('text', JSON.stringify(data))

  }

  function onDragend(evt) {

    evt.target.toggleAttribute('over', false)

  }

  function onenter(evt) {

    current.toggleAttribute('enter', false)
    evt.target.toggleAttribute('over', true)

  }

  function onleave(evt) {

    evt.target.toggleAttribute('over', false)

  }

  function onover(evt) {

    evt.preventDefault()

  }

  function ondrop(evt) {

    evt.preventDefault()
    const tonode = evt.target.parentNode
    const tochild = tonode.children[0]
    const prenode = current.parentNode
    tonode.appendChild(current)
    prenode.appendChild(tochild)
    tochild.toggleAttribute('over', false)
    updateStream(current.id, tochild.id).then(() => setStitchLayout())
    current.toggleAttribute('enter', false)

  }

  function formatScale(scale) {

    return [
      (100 / scale).toFixed(2),
      '%',
    ].join('')

  }

  function init() {

    streams = source.resource.getData()

    log.debug('Init grid view', JSON.stringify(streams))

    if (streams.length > 0) {

      const scale = Math.ceil(Math.sqrt(streams.length))
      style = []
      for (let i = 0; i < scale; i++) {

        style.push(formatScale(scale))

      }

      style = `grid-template-rows: ${style.join(' ')};grid-template-columns: ${style.join(' ')}`

    } else {

      setTimeout(() => init(), 600)
  
    }

  }

  function onItemDblClick(item) {

    log.debug('OnItemDoubleClick', JSON.stringify(item))
    submit({
      request: 'doubleClick',
      ...item,
    })

  }

  onMount(init)
</script>
<section class="stitch" {style}>
  {#each streams as item}
    <div
      class="child-grid" 
      on:drop="{ondrop}" 
      on:dragover="{onover}" 
      on:dragenter="{onenter}" 
      on:dragleave="{onleave}">
      <div
        id="{item.stream}" 
        class="child" 
        draggable="true" 
        on:dblclick="{() => onItemDblClick(item)}"
        on:dragstart="{(evt) => onstart(evt, item)}" 
        on:dragend="{(evt) => onDragend(evt)}"
        on:dragleave="{preventDefault}">
        {item.title}
      </div>
    </div>
  {/each}
</section>