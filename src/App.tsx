import './App.css'

import { useEffect, useMemo, useState } from 'react'

import Game from './components/game/Game'
import Loader from './components/loader'
import { MAX_CHALLENGES } from './constants/settings'
import { useAlert } from './context/AlertContext'
import {
  GameDataDoc,
  createUser,
  deleteUser,
  updateGame,
  updateState,
  updateStats,
} from './lib/game'
import {
  GameStats,
  StoredGameState,
  UserDetails,
  loadGameStateFromLocalStorage,
  loadStatsFromLocalStorage,
  saveGameStateToLocalStorage,
  saveStatsToLocalStorage,
} from './lib/localStorage'
import { defaultStats, getStatsForCompletedGame } from './lib/stats'

type AppProps = {
  userDetails: UserDetails
  gameDoc: GameDataDoc | undefined
  oldUserId: string
  gameDate: string
  tomorrow: number
  index: number
  solution: string
  isNewUser: boolean
}

type GameDataProps = {
  local:
    | undefined
    | {
        stats: GameStats
        state: StoredGameState
      }
  db:
    | undefined
    | {
        stats: GameStats
        state: StoredGameState
      }
  latest: 'local' | 'db'
  latestData: {
    stats: GameStats
    state: StoredGameState
  }
  isSyncedData: boolean
}

function App({
  userDetails,
  gameDoc,
  oldUserId,
  isNewUser,
  solution,
  gameDate,
  index,
  tomorrow,
}: AppProps) {
  const [loading, setIsLoading] = useState(true)
  const { showError: showErrorAlert } = useAlert()
  const gameData = useMemo(() => {
    const data: GameDataProps = {
      local: undefined,
      db: undefined,
      isSyncedData: true,
      latest: 'local',
      latestData: {
        state: {
          guesses: [],
          solution,
          gameWon: false,
          gameLost: false,
        },
        stats: defaultStats,
      },
    }
    const gameState: StoredGameState | null = loadGameStateFromLocalStorage()
    const gameStats: GameStats | null = loadStatsFromLocalStorage()
    if (gameState && gameStats) {
      data.local = {
        state: gameState,
        stats: gameStats,
      }
    }
    if (userDetails.isAccountExist) {
      data.latest = 'db'
      data.db = {
        state: gameDoc?.state as StoredGameState,
        stats: gameDoc?.stats as GameStats,
      }
    }
    if (data.db && data.local) {
      data.isSyncedData =
        JSON.stringify(data.db.state) === JSON.stringify(data.local.state) &&
        JSON.stringify(data.db.stats) === JSON.stringify(data.local.stats)
      if (!data.isSyncedData) {
        const isLocalLatest = data.local.state.solution === solution
        const isDbLatest = data.db.state.solution === solution
        if (isLocalLatest && isDbLatest) {
          const dbGameWasWon = data.db.state.guesses.includes(solution)
          const dbGmeLost =
            data.db.state.guesses.length === MAX_CHALLENGES && !dbGameWasWon
          const dbGameCompleted = dbGameWasWon || dbGmeLost
          if (dbGameCompleted) {
            data.latest = 'db'
          } else {
            const gameWasWon = data.local.state.guesses.includes(solution)
            const gameLost =
              data.local.state.guesses.length === MAX_CHALLENGES && !gameWasWon
            const gameCompleted = gameWasWon || gameLost
            if (gameCompleted) {
              data.latest = 'local'
              data.local.stats = data.db.stats
              if (gameWasWon) {
                data.local.stats = getStatsForCompletedGame(
                  data.local.stats,
                  data.local.state.guesses.length
                )
              }
              if (gameLost) {
                data.local.stats = getStatsForCompletedGame(
                  data.local.stats,
                  data.local.state.guesses.length + 1
                )
              }
            } else {
              data.latest =
                data.db.state.guesses.length > data.local.state.guesses.length
                  ? 'db'
                  : 'local'
            }
          }
        } else {
          if (isLocalLatest) {
            data.latest = 'local'
            const gameWasWon = data.local.state.guesses.includes(solution)
            const gameLost =
              data.local.state.guesses.length === MAX_CHALLENGES && !gameWasWon
            data.local.stats = data.db.stats
            if (gameWasWon) {
              data.local.stats = getStatsForCompletedGame(
                data.local.stats,
                data.local.state.guesses.length
              )
            }
            if (gameLost) {
              data.local.stats = getStatsForCompletedGame(
                data.local.stats,
                data.local.state.guesses.length + 1
              )
            }
          } else {
            data.latest = 'db'
          }
        }
      }
    }
    data.latestData = data[data.latest] || data.latestData
    data.latestData.state.guesses =
      data.latestData.state.solution === solution
        ? data.latestData.state.guesses
        : []
    data.latestData.state.solution = solution
    data.latestData.state.gameWon = data.latestData.state.guesses.includes(
      data.latestData.state.solution
    )
    data.latestData.state.gameLost =
      data.latestData.state.guesses.length === MAX_CHALLENGES &&
      !data.latestData.state.gameWon
    return data.latestData
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [guesses, setGuesses] = useState(gameData.state.guesses)
  const [isGameWon, setIsGameWon] = useState(gameData.state.gameWon)
  const [isGameLost, setIsGameLost] = useState(gameData.state.gameLost)

  const [stats, setStats] = useState(gameData.stats)

  useEffect(() => {
    const gameState = {
      guesses,
      solution,
      date: gameDate,
      gameWon: isGameWon,
      gameLost: isGameLost,
    }
    saveStatsToLocalStorage(stats)
    saveGameStateToLocalStorage(gameState)
    const callGameUpdate = userDetails.isAccountExist ? updateGame : createUser
    callGameUpdate(userDetails, gameState, stats)
      .then(() => {
        if (oldUserId) {
          deleteUser(oldUserId)
            .then(() => {
              setIsLoading(false)
            })
            .catch((e: any) => {
              setIsLoading(false)
              const errorMsg = e.message || e
              console.log(errorMsg)
              showErrorAlert(errorMsg.toString())
            })
        } else {
          setIsLoading(false)
        }
      })
      .catch((e: any) => {
        setIsLoading(false)
        const errorMsg = e.message || e
        console.log(errorMsg)
        showErrorAlert(errorMsg.toString())
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (guesses.length) {
      saveGameStateToLocalStorage({
        guesses,
        solution,
        gameWon: isGameWon,
        gameLost: isGameLost,
      })
      updateState(userDetails, {
        guesses,
        solution,
        gameWon: isGameWon,
        gameLost: isGameLost,
      })
        .then(() => {})
        .catch((e: any) => {
          const errorMsg = e.message || e
          console.log(errorMsg)
          showErrorAlert(errorMsg.toString())
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guesses, isGameWon, isGameLost])

  useEffect(() => {
    if (stats.totalGames) {
      saveStatsToLocalStorage(stats)
      updateStats(userDetails, stats)
        .then(() => {})
        .catch((e: any) => {
          const errorMsg = e.message || e
          console.log(errorMsg)
          showErrorAlert(errorMsg.toString())
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats])

  return loading ? (
    <Loader loading={true} />
  ) : (
    <Game
      userDetails={userDetails}
      isNewUser={isNewUser}
      stats={stats}
      setStats={setStats}
      solution={solution}
      guesses={guesses}
      setGuesses={setGuesses}
      isGameWon={isGameWon}
      setIsGameWon={setIsGameWon}
      isGameLost={isGameLost}
      setIsGameLost={setIsGameLost}
      gameDate={gameDate}
      index={index}
      tomorrow={tomorrow}
    />
  )
}

export default App
