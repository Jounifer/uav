export default function setRelayInfo(ele, data) {

  function toFixed(n, len) {
    if (String(n).indexOf('.') > 0 && String(n).substr(String(n).indexOf('.')+1).length > len) {
      return n.toFixed(len)
    } else {
      return n;
    }
  }
  if (data.capPlatformList && data.capPlatformList.length) {
    ele.innerHTML = `<div class="relayInfo">
      <div class="title">${ data.nodeName }</div>
      <div class="thead">
        <p><span style="width: 80px;">名称</span>
          ${
            (data.capPlatformList || []).map((item) => {
              return `<span style="width: 140px;">${item.name || ''}</span>`
            }).join('')
          }
        </p>
        <p><span style="width: 80px;">名称</span>
          ${
            (data.capPlatformList || []).map((item) => {
              return `<span style="width: 140px;">${item.name || ''}</span>`
            }).join('')
          }
        </p>
      </div>
      <div class="tbody">
        <p><span style="width: 80px;">状态</span>
          ${
            (data.capPlatformList || []).map((item) => {
              return `${item.state == 0 ? '<span style="width: 140px;color: #28A8FF;">正常</span>' : (item.state == 1 || item.state == 2 || item.state == 3 ? '<span style="width: 140px;color: #dc5038;">故障</span>' : '<span style="width: 140px;color: #999999;">离线</span>')}`
            }).join('')
          }
        </p>
        <p><span style="width: 80px;">航向角</span>
          ${
            (data.capPlatformList || []).map((item) => {
              return `<span style="width: 140px;">${item.state != 4 && item.platformUploadData && item.platformUploadData.angleZ !== null ? `${toFixed(item.platformUploadData.angleZ, 3)}°` : ''}</span>`
            }).join('')
          }
        </p>
        <p><span style="width: 80px;">经度</span>
          ${
            (data.capPlatformList || []).map((item) => {
              return `<span style="width: 140px;">${item.state != 4 && item.platformUploadData && item.platformUploadData.longitude !== null ? `${toFixed(item.platformUploadData.longitude, 6)}°E` : ''}</span>`
            }).join('')
          }
        </p>
        <p><span style="width: 80px;">俯仰角</span>
          ${
            (data.capPlatformList || []).map((item) => {
              return `<span style="width: 140px;">${item.state != 4 && item.platformUploadData && item.platformUploadData.angleX !== null ? `${toFixed(item.platformUploadData.angleX, 3)}°` : ''}</span>`
            }).join('')
          }
        </p>
        <p><span style="width: 80px;">纬度</span>
          ${
            (data.capPlatformList || []).map((item) => {
              return `<span style="width: 140px;">${item.state != 4 && item.platformUploadData && item.platformUploadData.latitude !== null ? `${toFixed(item.platformUploadData.latitude, 6)}°N` : ''}</span>`
            }).join('')
          }
        </p>
        <p><span style="width: 80px;">翻滚角</span>
          ${
            (data.capPlatformList || []).map((item) => {
              return `<span style="width: 140px;">${item.state != 4 && item.platformUploadData && item.platformUploadData.angleY !== null ? `${toFixed(item.platformUploadData.angleY, 3)}°` : ''}</span>`
            }).join('')
          }
        </p>
        <p><span style="width: 80px;">高度</span>
          ${
            (data.capPlatformList || []).map((item) => {
              return `<span style="width: 140px;">${item.state != 4 && item.platformUploadData && item.platformUploadData.height !== null ? `${toFixed(item.platformUploadData.height, 3)}米` : ''}</span>`
            }).join('')
          }
        </p>
        <p><span style="width: 80px;">天线垂直角</span>
          ${
            (data.capPlatformList || []).map((item) => {
              return `<span style="width: 140px;">${item.state != 4 && item.platformUploadData && item.platformUploadData.rotationAngleV !== null ? `${toFixed(item.platformUploadData.rotationAngleV, 3)}°` : ''}</span>`
            }).join('')
          }
        </p>
        <p><span style="width: 80px;"></span style="width: 140px;"><span></span></p>
        <p><span style="width: 80px;">天线水平角</span>
          ${
            (data.capPlatformList || []).map((item) => {
              return `<span style="width: 140px;">${item.state != 4 && item.platformUploadData && item.platformUploadData.rotationAngleH !== null ? `${toFixed(item.platformUploadData.rotationAngleH, 3)}°` : ''}</span>`
            }).join('')
          }
        </p>
      </div>
      <div class="footer">
        <span style="padding: 0 16px;">距离上一跳</span><span style="color: #CEDAEF;padding: 0 16px;">${data.distance1 ? toFixed(data.distance1, 3) : 0}米</span>
      </div>
    </div>`
  } else {
    ele.innerHTML = `<div class="nodevInfo">
      <div class="title">${ data.nodeName }</div>
      <p><span style="width: 140px;color: #CEDAEF;">暂无云台设备</span></p>
      <div class="footer">
        <span style="padding: 0 16px;">距离上一跳</span><span style="color: #CEDAEF;padding: 0 16px;">${data.distance1 ? toFixed(data.distance1, 3) : 0}米</span>
      </div>
    </div>`
  }
  

}
