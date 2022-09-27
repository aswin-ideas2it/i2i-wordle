import { serverPath } from './../constants/server'
import { sendPostRequest } from './http'

export type AuthStatus = {
  isAuthenticated: boolean
  user: {
    userId: string
    userName: string
  }
}

export const createUser = (userId: string, userName: string, pwd: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = serverPath.baseUrl + serverPath.api.user.create
      const payload = {
        userName,
      }
      const auth = {
        username: userId,
        password: pwd,
      }
      const response: any = await sendPostRequest(url, payload, {}, auth)
      resolve(response)
    } catch (err) {
      reject(err)
    }
  })
}

export const loginUser = (userId: string, pwd: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = serverPath.baseUrl + serverPath.api.auth.login
      const auth = {
        username: userId,
        password: pwd,
      }
      const response: any = await sendPostRequest(url, {}, {}, auth)
      resolve(response)
    } catch (err) {
      reject(err)
    }
  })
}

export const checkAuthStatus = () => {
  return new Promise<AuthStatus>(async (resolve, reject) => {
    try {
      const url = serverPath.baseUrl + serverPath.api.auth.checkAuthStatus
      const response = await sendPostRequest(url)
      resolve(response as AuthStatus)
    } catch (err) {
      reject(err)
    }
  })
}

export const logoutUser = () => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const url = serverPath.baseUrl + serverPath.api.auth.logout
      const response = await sendPostRequest(url)
      resolve(response as boolean)
    } catch (err) {
      reject(err)
    }
  })
}

export const getResetDetail = (id: string, token: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = serverPath.baseUrl + serverPath.api.reset.getUser
      const response: any = await sendPostRequest(url, { id, token })
      resolve(response)
    } catch (err) {
      reject(err)
    }
  })
}

export const getVerificationDetail = (id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = serverPath.baseUrl + serverPath.api.verify.getUser
      const response: any = await sendPostRequest(url, { id })
      resolve(response)
    } catch (err) {
      reject(err)
    }
  })
}

export const verifyUser = (id: string, token: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = serverPath.baseUrl + serverPath.api.verify.verifyUser
      const response: any = await sendPostRequest(url, { id, token })
      resolve(response)
    } catch (err) {
      reject(err)
    }
  })
}

export const sendResetLink = (userId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = serverPath.baseUrl + serverPath.api.reset.sendLink
      const response: any = await sendPostRequest(url, { userId })
      resolve(response)
    } catch (err) {
      reject(err)
    }
  })
}

export const sendVerificationLink = (userId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = serverPath.baseUrl + serverPath.api.verify.sendLink
      const response: any = await sendPostRequest(url, { userId })
      resolve(response)
    } catch (err) {
      reject(err)
    }
  })
}

export const resetPassword = (userId: string, pwd: string, token: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = serverPath.baseUrl + serverPath.api.reset.changePassword
      const auth = {
        username: userId,
        password: pwd,
      }
      const response: any = await sendPostRequest(url, { token }, {}, auth)
      resolve(response)
    } catch (err) {
      reject(err)
    }
  })
}

export const loginGoogleUser = () => {
  window.open(serverPath.baseUrl + serverPath.api.auth.googleLogin, '_self')
}
