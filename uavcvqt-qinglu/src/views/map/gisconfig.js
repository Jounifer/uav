const gisConfig = {
  ctcenterVisible: true, // 控制中心标注显示
  centerVisible: true, // 演示中心标注显示
  celiangVisible: true, // 测量站标注显示
  bhsVisible: true, // 地面站标注显示
  relayVisible: true, // 中继飞机标注显示
  fixedVisible: true, // 固定飞机标注显示
  beaconVisible: true,  // 信标显示
  uavVisible: true, // 无人机标注显示
  infoVisible: false, // 悬浮提示显示
  lineVisible: true,  // 链路显示
  sectorVisible: false, // 扇形显示
  trackVisible: true, // 轨迹显示
  celiangAble: true,  // 测量站显示
  infoAble: false,  // 伺服天线信息提示显示
  wholeColor: '', // 全局颜色
}

const customCodes = [
  'BHSYD',
  'ZYFXD',
]

export {
  gisConfig, customCodes,
}
