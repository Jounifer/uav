<script>
  import { getDistance } from 'ol/sphere'
  import * as echarts from 'echarts/core'
  import {
    TooltipComponent,
    GridComponent,
    LegendComponent,
    MarkLineComponent,
  } from 'echarts/components'
  import { BarChart } from 'echarts/charts'
  import { CanvasRenderer } from 'echarts/renderers'
  import { onMount, onDestroy } from 'svelte'
  import chartOption from './chartoption'
  import { store, log } from '@/utils'
  import { req } from '@/channel'

  echarts.use([
    TooltipComponent,
    GridComponent,
    LegendComponent,
    MarkLineComponent,
    BarChart,
    CanvasRenderer,
  ])

  const center = [
    116.23390019475585,
    40.04188204472351,
]
  const bhs = [
    115.8044931092299,
    39.73082431697159,
]
  const by = [
    115.44114865224566,
    38.50073061192106,
]
  
  function counterLen(start = [], middle = [], end = []) {

    let len = getDistance(start, middle)
    len += getDistance(middle, end)

    return len < 1000 ? `${Math.floor(len)}<span class="unit">米</span>` : `${Math.floor(len / 1000)}<span class="unit">公里</span>`

  }


  const bcLen = counterLen(center, bhs, by)
  let chartBox = null
  let chart = null
  let relays = 0
  let fixeds = 0
  let rotors = 0

  function updateStatistics(data) {
    relays = data.relayDrone.totalNumber
    fixeds = data.fixedWingDrone.totalNumber
    rotors = data.rotaryWingDrone.totalNumber
  }

  function updatePerformance(data) {
    const up = []
    const down = []
    up.push(data.groundStation.upTotal)
    down.push(data.groundStation.downTotal)
    up.push(data.relayDrone.upTotal)
    down.push(data.relayDrone.downTotal)
    up.push(data.fixedWingDrone.upTotal)
    down.push(data.fixedWingDrone.downTotal)
    if (chart) {
      chart.setOption(chartOption(up, down))
    }
  }

  const unsubscribe = store.subscribe(data => {
    if (!!data && data.res === req.Message) {
      if (data.event === 'statistics') {
        updateStatistics(data.data)
      } else if (data.event === 'performance') {
        updatePerformance(data.data)
      }
    }
  })


  onMount(() => {

    chart = echarts.init(chartBox)
    chart.setOption(chartOption([0,0,0], [0,0,0]))

  })

  onDestroy(() => {
    unsubscribe()
  })
</script>
<section class="statistic">
  <section class="kilometre">
    <header class="kilometre-header"></header>
    <main class="kilometre-main">
      <picture class="dis"/>
      <section class="block">
        <header class="title"></header>
        <main class="text">{@html bcLen}</main>
      </section>
    </main>
  </section>

  <section class="device">
    <header class="device-header"></header>
    <main class="device-main">
      <section class="panel relay">
        <i class="icon"></i>
        <span class="title"></span>
        <span class="text">{relays}<span class="unit">架</span></span>
      </section>
      <section class="panel fixed">
        <i class="icon"></i>
        <span class="title"></span>
        <span class="text">{fixeds}<span class="unit">架</span></span>
      </section>
      <section class="panel rotor">
        <i class="icon"></i>
        <span class="title"></span>
        <span class="text">{rotors}<span class="unit">架</span></span>
      </section>
    </main>
  </section>

  <section class="flow">
    <header class="flow-header"></header>
    <main class="flow-main">
      <div class="chart" bind:this={chartBox}></div>
    </main>
  </section>
</section>