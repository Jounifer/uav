export default function isQtEnv() {

  return (!!QWebChannel && !!window.qt)

}
