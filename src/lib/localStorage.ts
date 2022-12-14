import { decrypt, encrypt } from './encryption'

const gameStateKey = 'gameState'
const gameStatKey = 'gameStats'
const userIdKey = 'user'
const highContrastKey = 'highContrast'

export type StoredGameState = {
  guesses: string[]
  solution: string
  gameWon: boolean
  gameLost: boolean
}

export type GameStats = {
  winDistribution: number[]
  gamesFailed: number
  currentStreak: number
  bestStreak: number
  totalGames: number
  successRate: number
  gamesWon: number
}

export type UserDetails = {
  userId: string
  isLocalUser: boolean
  isAuthenticated: boolean
  userName: string
  isVerified: boolean
  id: string
  dp: string
  isAccountExist?: boolean
}

export type LSUserDetails = {
  userId: string
  isLocalUser: boolean
}

export const saveGameStateToLocalStorage = (gameState: StoredGameState) => {
  const encryptedData = encrypt(JSON.stringify(gameState))
  localStorage.setItem(gameStateKey, encryptedData)
}

export const loadGameStateFromLocalStorage = () => {
  const encryptedData = localStorage.getItem(gameStateKey)
  const decryptedData: string = decrypt(encryptedData || '')
  let data: any = null
  try {
    data = JSON.parse(decryptedData)
  } catch (err) {}

  return data ? (data as StoredGameState) : null
}

export const saveStatsToLocalStorage = (gameStats: GameStats) => {
  const encryptedData = encrypt(JSON.stringify(gameStats))
  localStorage.setItem(gameStatKey, encryptedData)
}

export const loadStatsFromLocalStorage = () => {
  const encryptedData = localStorage.getItem(gameStatKey)
  const decryptedData: string = decrypt(encryptedData || '')
  let data: any = null
  try {
    data = JSON.parse(decryptedData)
  } catch (err) {}

  return data ? (data as GameStats) : null
}

export const setStoredIsHighContrastMode = (isHighContrast: boolean) => {
  if (isHighContrast) {
    localStorage.setItem(highContrastKey, '1')
  } else {
    localStorage.removeItem(highContrastKey)
  }
}

export const setUser = (userDetails: UserDetails) => {
  const _userDetails: LSUserDetails = {
    userId: userDetails.userId,
    isLocalUser: userDetails.isLocalUser,
  }
  localStorage.setItem(userIdKey, JSON.stringify(_userDetails))
}

export const removeUser = () => {
  localStorage.removeItem(userIdKey)
}

export const getUser = () => {
  const user = localStorage.getItem(userIdKey)
  let data: any = null
  if (user) {
    try {
      data = JSON.parse(user)
    } catch (err) {}
  }
  return data
    ? ({
        userId: data.userId,
        isLocalUser: data.isLocalUser,
      } as LSUserDetails)
    : null
}

export const getStoredIsHighContrastMode = () => {
  const highContrast = localStorage.getItem(highContrastKey)
  return highContrast === '1'
}

export const clearItems = () => {
  localStorage.removeItem(userIdKey)
  localStorage.removeItem(gameStateKey)
  localStorage.removeItem(gameStatKey)
}
