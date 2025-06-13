export default (name = '') => {

  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  const data = window.location.search.substring(1).match(reg)
  if (data) {

    return data[2]

  }

  return null

}
