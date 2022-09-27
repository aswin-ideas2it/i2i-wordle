import CryptoJS from 'crypto-js'

import { ENCRYPTION_IV, ENCRYPTION_KEY } from '../constants/settings'

const key = CryptoJS.enc.Base64.parse(ENCRYPTION_KEY)
const iv = CryptoJS.enc.Base64.parse(ENCRYPTION_IV)

export const encrypt = (data: string) => {
  return CryptoJS.AES.encrypt(data, key, { iv: iv }).toString()
}

export const decrypt = (encoded: string) => {
  const bytes = CryptoJS.AES.decrypt(encoded, key, { iv: iv })
  return bytes.toString(CryptoJS.enc.Utf8)
}
