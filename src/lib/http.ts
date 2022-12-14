import axios, { AxiosBasicCredentials } from 'axios'

const defaultHeaders = {
  'Content-Type': 'application/json',
}

export const sendGetRequest = (
  url: string,
  data = {},
  additionalHeaders = {}
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: 'GET',
        url,
        data,
        headers: { ...defaultHeaders, ...additionalHeaders },
      })
      resolve(response.data)
    } catch (err: any) {
      reject(
        err.response && err.response.data ? err.response.data : err.message
      )
    }
  })
}

export const sendPostRequest = (
  url: string,
  data = {},
  additionalHeaders = {},
  auth: AxiosBasicCredentials | undefined = undefined
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: 'POST',
        url,
        auth,
        data,
        headers: { ...defaultHeaders, ...additionalHeaders },
        withCredentials: true,
      })
      resolve(response.data)
    } catch (err: any) {
      reject(
        err.response && err.response.data ? err.response.data : err.message
      )
    }
  })
}
