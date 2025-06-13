export default function setRelayInfo(ele, data) {

  const screenPixel = window.innerWidth > 3000 && window.innerHeight > 1800 ? 2 : 1
  function toFixed(n, len) {

    if (String(n).indexOf('.') > 0 && String(n).substr(String(n).indexOf('.') + 1).length > len) {

      return n.toFixed(len)

    }

    return n

  }
  function formatHorizontal(angle) {

    const fn = {
      '1': (angle) => `北偏东${toFixed(angle, 3)} °`,
      '2': (angle) => `东偏北${toFixed(90 - angle, 3)} °`,
      '3': (angle) => `东偏南${toFixed(angle - 90, 3)} °`,
      '4': (angle) => `南偏东${toFixed(180 - angle, 3)} °`,
      '5': (angle) => `南偏西${toFixed(angle - 180, 3)} °`,
      '6': (angle) => `西偏南${toFixed(270 - angle, 3)} °`,
      '7': (angle) => `西偏北${toFixed(angle - 270, 3)} °`,
      '8': (angle) => `北偏西${toFixed(360 - angle, 3)} °`,
    }

    const fi = {
      '0': '正北',
      '90': '正东',
      '180': '正南',
      '270': '正西',
      '360': '正北',
    }

    if (angle % 45 === 0) {

      return fi[angle]

    }

    const caller = Math.ceil(angle / 45).toString()

    if (Object.keys(fn).includes(caller)) {

      return fn[caller](angle)

    }

    return '异常值'

  }
  function formatVertical(angle, direction, angleY) {

    if (angleY !== null && angleY !== undefined && angleY < 0) {

      angle = -angle

    }
    if (direction === 1) {

      if (angle === 0) {

        return '水平'

      }
      if (angle > 0) {

        return `下倾${toFixed(angle, 3)} °`

      }

      return `上扬${toFixed(Math.abs(angle), 3)} °`

    }
    if (angle === 0) {

      return '水平'

    }
    if (angle > 0) {

      return `上扬${toFixed(angle, 3)} °`

    }

    return `下倾${toFixed(Math.abs(angle), 3)} °`

  }
  if (data.capPlatformList && data.capPlatformList.length) {

    if (data.nodeType === '群头飞机' || data.nodeType === '中继飞机') {

      const platforms = (data.capPlatformList || []).filter((item) => item.state != null && item.state != 4 && item.platformUploadData)
      if (platforms.length === 2) {

        const heights = platforms.map((item) => item.platformUploadData && item.platformUploadData.height)
        platforms.forEach((item, i) => {

          item.platformUploadData.height = (i === 0 ? 0.51 : 0.49) * heights.reduce((a, b) => a + b)

        })

      }

    }
    ele.innerHTML = `<div class="relayInfo">
      <div class="title">${data.nodeName}</div>
      <div class="thead">
        <p><span style="width: ${140 * screenPixel}px;">名称</span>
          ${
  (data.capPlatformList || []).map((item) => `<span style="width: ${180 * screenPixel}px;">${item.name || ''}</span>`).join('')
}
        </p>
        <p><span style="width: ${140 * screenPixel}px;">名称</span>
          ${
  (data.capPlatformList || []).map((item) => `<span style="width: ${180 * screenPixel}px;">${item.name || ''}</span>`).join('')
}
        </p>
      </div>
      <div class="tbody">
        <p><span style="width: ${140 * screenPixel}px;">状态</span>
          ${
  (data.capPlatformList || []).map((item) => `${item.state == 0 || item.state == 1 || item.state == 2 || item.state == 3 ? `<span style="width: ${180 * screenPixel}px;color: #28A8FF;">正常</span>` : `<span style="width: ${180 * screenPixel}px;color: #999999;">离线</span>`}`).join('')
}
        </p>
        <p><span style="width: ${140 * screenPixel}px;">飞机航向角</span>
          ${
  (data.capPlatformList || []).map((item) => `<span style="width: ${180 * screenPixel}px;">${item.state != null && item.state != 4 && item.platformUploadData && item.platformUploadData.angleZ !== null ? `${formatHorizontal(item.platformUploadData.angleZ)}` : ''}</span>`).join('')
}
        </p>
        <p class="bgColor"><span style="width: ${140 * screenPixel}px;">经度</span>
          ${
  (data.capPlatformList || []).map((item) => `<span style="width: ${180 * screenPixel}px;">${item.state != null && item.state != 4 && item.platformUploadData && item.platformUploadData.longitude !== null ? `${toFixed(item.platformUploadData.longitude, 6)}°E` : ''}</span>`).join('')
}
        </p>
        <p class="bgColor"><span style="width: ${140 * screenPixel}px;">飞机俯仰角</span>
          ${
  (data.capPlatformList || []).map((item) => `<span style="width: ${180 * screenPixel}px;">${item.state != null && item.state != 4 && item.platformUploadData && item.platformUploadData.angleX !== null ? `${formatVertical(item.platformUploadData.angleX, item.platformUploadData.direction, item.platformUploadData.angleY)}` : ''}</span>`).join('')
}
        </p>
        <p><span style="width: ${140 * screenPixel}px;">纬度</span>
          ${
  (data.capPlatformList || []).map((item) => `<span style="width: ${180 * screenPixel}px;">${item.state != null && item.state != 4 && item.platformUploadData && item.platformUploadData.latitude !== null ? `${toFixed(item.platformUploadData.latitude, 6)}°N` : ''}</span>`).join('')
}
        </p>
        <p><span style="width: ${140 * screenPixel}px;">飞机翻滚角</span>
          ${
  (data.capPlatformList || []).map((item) => `<span style="width: ${180 * screenPixel}px;">${item.state != null && item.state != 4 && item.platformUploadData && item.platformUploadData.angleY !== null ? `${toFixed(item.platformUploadData.angleY, 3)}°` : ''}</span>`).join('')
}
        </p>
        <p class="bgColor"><span style="width: ${140 * screenPixel}px;">海拔</span>
          ${
  (data.capPlatformList || []).map((item) => `<span style="width: ${180 * screenPixel}px;">${item.state != null && item.state != 4 && item.platformUploadData && item.platformUploadData.height !== null ? `${toFixed(item.platformUploadData.height, 3)}米` : ''}</span>`).join('')
}
        </p>
        <p class="bgColor"><span style="width: ${140 * screenPixel}px;">天线水平角</span>
          ${
  (data.capPlatformList || []).map((item) => `<span style="width: ${180 * screenPixel}px;">${item.state != null && item.state != 4 && item.platformUploadData && item.platformUploadData.rotationAngleH !== null ? `${formatHorizontal(item.platformUploadData.rotationAngleH)}` : ''}</span>`).join('')
}
        </p>
        <p><span style="width: ${140 * screenPixel}px;">水平补偿角</span>
          ${
  (data.capPlatformList || []).map((item) => `<span style="width: ${180 * screenPixel}px;">${item.state != null && item.state != 4 && item.platformUploadData && item.platformUploadData.hForcedOffsetAngle !== null ? `${toFixed(item.platformUploadData.hForcedOffsetAngle || 0, 3)}°` : ''}</span>`).join('')
}
        </p>
        <p><span style="width: ${140 * screenPixel}px;">天线垂直角</span>
          ${
  (data.capPlatformList || []).map((item) => `<span style="width: ${180 * screenPixel}px;">${item.state != null && item.state != 4 && item.platformUploadData && item.platformUploadData.rotationAngleV !== null ? `${formatVertical(item.platformUploadData.rotationAngleV, item.platformUploadData.direction, item.platformUploadData.angleY)}` : ''}</span>`).join('')
}
        </p>
        <p class="bgColor"><span style="width: ${140 * screenPixel}px;">垂直补偿角</span>
          ${
  (data.capPlatformList || []).map((item) => `<span style="width: ${180 * screenPixel}px;">${item.state != null && item.state != 4 && item.platformUploadData && item.platformUploadData.vForcedOffsetAngle !== null ? `${toFixed(item.platformUploadData.vForcedOffsetAngle || 0, 3)}°` : ''}</span>`).join('')
}
        </p>
        <p class="bgColor"><span style="width: ${140 * screenPixel}px;">姿态传感器安装方向</span>
          ${
  (data.capPlatformList || []).map((item) => `<span style="width: ${180 * screenPixel}px;">${item.state != null && item.state != 4 && item.platformUploadData && item.platformUploadData.imuInstallDirection !== null ? `${item.platformUploadData.imuInstallDirection === 1 ? '向下安装' : '向上安装'}` : ''}</span>`).join('')
}
        </p>
        <p><span style="width: ${140 * screenPixel}px;">水平电机目标位置</span>
          ${
  (data.capPlatformList || []).map((item) => `<span style="width: ${180 * screenPixel}px;">${item.state != null && item.state != 4 && item.platformUploadData && item.platformUploadData.hMotorTargetPos !== null ? `${item.platformUploadData.hMotorTargetPos || 0}步` : ''}</span>`).join('')
}
        </p>
        <p><span style="width: ${140 * screenPixel}px;">水平电机当前位置</span>
          ${
  (data.capPlatformList || []).map((item) => `<span style="width: ${180 * screenPixel}px;">${item.state != null && item.state != 4 && item.platformUploadData && item.platformUploadData.hMotorCurrentPos !== null ? `${item.platformUploadData.hMotorCurrentPos || 0}步` : ''}</span>`).join('')
}
        </p>
        <p class="bgColor"><span style="width: ${140 * screenPixel}px;">垂直电机目标位置</span>
          ${
  (data.capPlatformList || []).map((item) => `<span style="width: ${180 * screenPixel}px;">${item.state != null && item.state != 4 && item.platformUploadData && item.platformUploadData.vMotorTargetPos !== null ? `${item.platformUploadData.vMotorTargetPos || 0}步` : ''}</span>`).join('')
}
        </p>
        <p class="bgColor"><span style="width: ${140 * screenPixel}px;">垂直电机当前位置</span>
          ${
  (data.capPlatformList || []).map((item) => `<span style="width: ${180 * screenPixel}px;">${item.state != null && item.state != 4 && item.platformUploadData && item.platformUploadData.vMotorCurrentPos !== null ? `${item.platformUploadData.vMotorCurrentPos || 0}步` : ''}</span>`).join('')
}
        </p>
        <p><span style="width: ${140 * screenPixel}px;">伺服天线安装方向</span>
          ${
  (data.capPlatformList || []).map((item) => `<span style="width: ${180 * screenPixel}px;">${item.state != null && item.state != 4 && item.platformUploadData && item.platformUploadData.direction !== null ? `${item.platformUploadData.direction === 1 ? '向下安装' : '向上安装'}` : ''}</span>`).join('')
}
        </p>
        <p></p>
      </div>
      <div class="footer">
        <span style="padding: 0 ${16 * screenPixel}px;">距离上一跳</span><span style="color: #CEDAEF;padding: 0 ${16 * screenPixel}px;">${data.distance1 ? toFixed(data.distance1, 3) : 0}米</span>
      </div>
    </div>`

  } else {

    ele.innerHTML = ''
    ele.style.display = 'none'

  }


}
