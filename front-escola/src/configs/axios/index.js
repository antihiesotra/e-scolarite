import axios from 'axios'

import {LocalStorage} from 'quasar'
let axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL
})

let injectAuthToken = (options) => {
  const authToken = LocalStorage.get.item('auth_token')
  let fonction = LocalStorage.get.item('fonction')
  if (fonction) {
    fonction = JSON.parse(fonction).id
  }
  options.headers = {'Authorization': 'Bearer ' + authToken}
  options.headers['fonction'] = fonction
  return options
}

let toMultipart = (options) => {
  let data = options.data
  options.data = new FormData()
  for (let key in data) {
    options.data.append(key, data[key])
  }
  options.headers['Content-Type'] = 'multipart/form-data'
  return options
}

export default {
  get: (url, authNeeded = true) => {
    let options = {
      method: 'GET',
      url
    }
    if (authNeeded) {
      options = injectAuthToken(options)
    }
    return axiosInstance.request(options)
  },
  post: (url, data, authNeeded = true, multipart = false) => {
    let options = {
      method: 'POST',
      url,
      data
    }
    if (authNeeded) {
      options = injectAuthToken(options)
    }
    if (multipart) {
      options = toMultipart(options)
    }
    return axiosInstance.request(options)
  },
  put: (url, data, authNeeded = true, multipart = false) => {
    let options = {
      method: 'PUT',
      url,
      data
    }
    if (authNeeded) {
      options = injectAuthToken(options)
    }
    if (multipart) {
      options = toMultipart(options)
    }
    return axiosInstance.request(options)
  },
  delete: (url, data, authNeeded = true) => {
    let options = {
      method: 'DELETE',
      url,
      data
    }
    if (authNeeded) {
      options = injectAuthToken(options)
    }
    return axiosInstance.request(options)
  }
}
