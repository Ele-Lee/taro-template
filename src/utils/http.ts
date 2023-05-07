import { request, uploadFile } from '@tarojs/taro';

const host = 'http://127.0.0.1:7001'

const getTokenUrl = '/login'

function resInterceptor(response: any, url: string) {
  // 设置http请求的token
  if (url.includes(getTokenUrl)) {
    setHttpData({ token: response.data.data.token })
  }

  if (!response.data) {
    return {}
  }
  const resData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data
  return resData.data
}

let httpData: Record<string, any> = {
  token: ''
}

export function setHttpData(data: Record<string, any>) {
  httpData = {
    ...data
  }
}

const getHeaders = () => {
  return {
    Authorization: `Bearer ${httpData.token}`
  }
}

const requestParamsGenerater = ({ url, resolve, reject }) => {
  return {
    url: host + url,
    success: function (res) {
      resolve(resInterceptor(res, url))
    },
    fail(err) {
      reject(err)
    },
    header: getHeaders()
  }
}

const post = <T = any>(url: string, data?: Record<string, any>) => {
  return new Promise<T>((resolve, reject) => {
    request({
      method: 'POST',
      data,
      ...requestParamsGenerater({ url, resolve, reject })
    })

  })
}

const get = <T = any>(url: string, data?: Record<string, any>) => {
  return new Promise<T>((resolve, reject) => {
    request({
      method: 'GET',
      data,
      ...requestParamsGenerater({ url, resolve, reject })
    })
  })
}

const upload = <T = any>({ filePath, name, data, url }: { filePath: string, url: string, name: string, data?: Record<string, any> }) => {
  return new Promise<T>((resolve, reject) => {
    uploadFile({
      formData: data,
      filePath,
      name,
      ...requestParamsGenerater({ url, resolve, reject })
    })
  })
}

export { post, get, upload }
