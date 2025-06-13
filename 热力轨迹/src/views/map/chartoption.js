export default function chartOption(up = [], down = []) {

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: { color: '#999' },
      },
    },
    legend: {
      right: '5%',
      top: '2%',
      data: [
        {
          name: '上行',
          textStyle: { color: '#87CAFF' },
        },
        {
          name: '下行',
          textStyle: { color: '#A2B7D1' },
        },
      ],
    },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: [
      {
        splitLine: { show: false },
        type: 'category',
        data: [
          '地面站',
          '中继飞机',
          '群头飞机',
        ],
        axisPointer: { type: 'shadow' },
        axisLabel: { color: '#B5C5D4' },
      },
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed',
            dashOffset: 1,
            color: '#263D67',
          },
        },
        axisLabel: { color: '#B5C5D4' },
      },
    ],
    series: [
      {
        name: '上行',
        type: 'bar',
        barWidth: 12,
        itemStyle: { color: '#87CAFF' },
        data: up,
      },
      {
        name: '下行',
        type: 'bar',
        barWidth: 12,
        itemStyle: { color: '#A2B7D1' },
        data: down,
      },
    ],
  }

}
