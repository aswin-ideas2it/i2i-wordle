import { serverPath } from './../constants/server'
import { decrypt, encrypt } from './encryption'
import { sendPostRequest } from './http'
import { GameStats, StoredGameState, UserDetails } from './localStorage'

export type GameDataDoc = {
  _id: string
  userId: string
  stats: GameStats
  state: StoredGameState
  isLocalUser: string
}

type RawGameDataDoc = {
  _id: string
  userId: string
  stats: GameStats | string
  state: StoredGameState | string
  isLocalUser: string
}

type GameDetails = {
  gameData: GameDataDoc
  solution: string
  index: number
  tomorrow: number
  gameDate: string
  userDetails: {
    _id: string
    dp: string
    isVerified: boolean
  }
}

export const retreiveGameDetails = (userId: string) => {
  return new Promise<GameDetails>(async (resolve, reject) => {
    try {
      const url = serverPath.baseUrl + serverPath.api.retreive
      const response: any = await sendPostRequest(url, {
        userId,
      })
      const gameData = response.gameData as RawGameDataDoc | undefined
      if (gameData?.state && gameData?.stats) {
        gameData.state = JSON.parse(decrypt(gameData.state as string))
        gameData.stats = JSON.parse(decrypt(gameData.stats as string))
      }
      resolve({
        gameData: gameData as GameDataDoc,
        solution: decrypt(response._res),
        index: response.index,
        gameDate: response.gameDate,
        tomorrow: response.tomorrow,
        userDetails: response.userDetails,
      })
    } catch (err) {
      reject(err)
    }
  })
}

export const createUser = (
  userDetails: UserDetails,
  gameState: StoredGameState,
  gameStats: GameStats
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = serverPath.baseUrl + serverPath.api.create
      const payload = {
        userDetails,
        state: encrypt(JSON.stringify(gameState)),
        stats: encrypt(JSON.stringify(gameStats)),
      }
      const response: any = await sendPostRequest(url, payload)
      resolve(response)
    } catch (err) {
      reject(err)
    }
  })
}

export const updateGame = (
  userDetails: UserDetails,
  gameState: StoredGameState,
  gameStats: GameStats
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = serverPath.baseUrl + serverPath.api.update
      const payload = {
        userDetails,
        state: encrypt(JSON.stringify(gameState)),
        stats: encrypt(JSON.stringify(gameStats)),
      }
      const response: any = await sendPostRequest(url, payload)
      resolve(response)
    } catch (err) {
      reject(err)
    }
  })
}

export const updateState = (
  userDetails: UserDetails,
  gameState: StoredGameState
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = serverPath.baseUrl + serverPath.api.updateState
      const payload = {
        userDetails,
        state: encrypt(JSON.stringify(gameState)),
      }
      const response: any = await sendPostRequest(url, payload)
      resolve(response)
    } catch (err) {
      reject(err)
    }
  })
}

export const updateStats = (userDetails: UserDetails, gameStats: GameStats) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = serverPath.baseUrl + serverPath.api.updateStats
      const payload = {
        userDetails,
        stats: encrypt(JSON.stringify(gameStats)),
      }
      const response: any = await sendPostRequest(url, payload)
      resolve(response)
    } catch (err) {
      reject(err)
    }
  })
}

export const deleteUser = (userId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = serverPath.baseUrl + serverPath.api.delete
      const response: any = await sendPostRequest(url, { userId })
      resolve(response)
    } catch (err) {
      reject(err)
    }
  })
}

export const checkGuess = (guess: string) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const url = serverPath.baseUrl + serverPath.api.checkGuesses
      const response: any = await sendPostRequest(url, {
        guess: encrypt(guess),
      })
      resolve(response)
    } catch (err) {
      reject(err)
    }
  })
}
