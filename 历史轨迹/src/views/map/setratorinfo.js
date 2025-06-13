export default function setRatorInfo(ele, data) {

  ele.innerHTML = `<span style='display: block; width: max-content;'>${data.nodeName || ''}</span>`

}
