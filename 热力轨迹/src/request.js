import fly from 'flyio'
import {
  querystring, log,
} from '@/utils'


const responseHandler = ({
  data,
}) => data

const errorHandler = (error) => {

  log.warn('OWT.Client.request', JSON.stringify(error))

  return Promise.reject(error)

}

fly.config.timeout = 10000
fly.config.baseURL = querystring('service') || 'http://172.16.34.31:3001/'
fly.config.headers.Accept = 'application/json'
fly.config.headers['Content-Type'] = 'application/json; charset=utf-8'
fly.interceptors.response.use(responseHandler, errorHandler)

export default fly
