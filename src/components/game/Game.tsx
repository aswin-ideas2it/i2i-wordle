import { default as GraphemeSplitter } from 'grapheme-splitter'
import { useEffect, useState } from 'react'
import Div100vh from 'react-div-100vh'

import { Grid } from './../../components/grid/Grid'
import { Keyboard } from './../../components/keyboard/Keyboard'
import Loader from './../../components/loader'
import { InfoModal } from './../../components/modals/InfoModal'
import { MigrateStatsModal } from './../../components/modals/MigrateStatsModal'
import { SettingsModal } from './../../components/modals/SettingsModal'
import { StatsModal } from './../../components/modals/StatsModal'
import { Navbar } from './../../components/navbar/Navbar'
import {
  DISCOURAGE_INAPP_BROWSERS,
  LONG_ALERT_TIME_MS,
  MAX_CHALLENGES,
  REVEAL_TIME_MS,
  WELCOME_INFO_MODAL_MS,
} from './../../constants/settings'
import {
  DISCOURAGE_INAPP_BROWSER_TEXT,
  GAME_COPIED_MESSAGE,
  HARD_MODE_ALERT_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  SHARE_FAILURE_TEXT,
  WIN_MESSAGES,
  WORD_NOT_FOUND_MESSAGE,
} from './../../constants/strings'
import { useAlert } from './../../context/AlertContext'
import { isInAppBrowser } from './../../lib/browser'
import { checkGuess } from './../../lib/game'
import {
  GameStats,
  getStoredIsHighContrastMode,
  setStoredIsHighContrastMode,
} from './../../lib/localStorage'
import { getStatsForCompletedGame } from './../../lib/stats'
import {
  getIsLatestGame,
  isWinningWord,
  unicodeLength,
  unicodeSplit,
} from './../../lib/words'

type GameProps = {
  stats: GameStats
  setStats: (guesses: GameStats) => void
  solution: string
  guesses: string[]
  setGuesses: (guesses: string[]) => void
  isGameWon: boolean
  setIsGameWon: (isWon: boolean) => void
  isGameLost: boolean
  setIsGameLost: (isLost: boolean) => void
  gameDate: Date
  isNewUser: boolean
}

function Game({
  isNewUser,
  stats,
  solution,
  guesses,
  gameDate,
  setGuesses,
  setStats,
  isGameWon,
  setIsGameWon,
  isGameLost,
  setIsGameLost,
}: GameProps) {
  const isLatestGame = getIsLatestGame()
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()
  const [currentGuess, setCurrentGuess] = useState('')
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [isMigrateStatsModalOpen, setIsMigrateStatsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [currentRowClass, setCurrentRowClass] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme')
      ? localStorage.getItem('theme') === 'dark'
      : prefersDarkMode
      ? true
      : false
  )
  const [isHighContrastMode, setIsHighContrastMode] = useState(
    getStoredIsHighContrastMode()
  )
  const [isRevealing, setIsRevealing] = useState(false)

  const [isHardMode, setIsHardMode] = useState(
    localStorage.getItem('gameMode')
      ? localStorage.getItem('gameMode') === 'hard'
      : false
  )

  useEffect(() => {
    if (isNewUser) {
      setTimeout(() => {
        setIsInfoModalOpen(true)
      }, WELCOME_INFO_MODAL_MS)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    DISCOURAGE_INAPP_BROWSERS &&
      isInAppBrowser() &&
      showErrorAlert(DISCOURAGE_INAPP_BROWSER_TEXT, {
        persist: false,
        durationMs: 7000,
      })
  }, [showErrorAlert])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (isHighContrastMode) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [isDarkMode, isHighContrastMode])

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  const handleHardMode = (isHard: boolean) => {
    if (guesses.length === 0 || localStorage.getItem('gameMode') === 'hard') {
      setIsHardMode(isHard)
      localStorage.setItem('gameMode', isHard ? 'hard' : 'normal')
    } else {
      showErrorAlert(HARD_MODE_ALERT_MESSAGE)
    }
  }

  const handleHighContrastMode = (isHighContrast: boolean) => {
    setIsHighContrastMode(isHighContrast)
    setStoredIsHighContrastMode(isHighContrast)
  }

  const clearCurrentRowClass = () => {
    setCurrentRowClass('')
  }

  useEffect(() => {
    if (isGameWon) {
      const winMessage =
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
      const delayMs = REVEAL_TIME_MS * unicodeLength(solution)

      showSuccessAlert(winMessage, {
        delayMs,
        onClose: () => setIsStatsModalOpen(true),
      })
    }

    if (isGameLost) {
      setTimeout(() => {
        setIsStatsModalOpen(true)
      }, (unicodeLength(solution) + 1) * REVEAL_TIME_MS)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameWon, isGameLost, showSuccessAlert])

  const onChar = (value: string) => {
    if (
      unicodeLength(`${currentGuess}${value}`) <= unicodeLength(solution) &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setCurrentGuess(`${currentGuess}${value}`)
    }
  }

  const updateLastChar = (value: string) => {
    const splittedVal = unicodeSplit(`${currentGuess}`)
    splittedVal[splittedVal.length - 1] = value
    setCurrentGuess(`${splittedVal.join('')}`)
  }

  const onDelete = () => {
    setCurrentGuess(
      new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join('')
    )
  }

  const onEnter = async () => {
    try {
      if (isGameWon || isGameLost) {
        return
      }

      if (!(unicodeLength(currentGuess) === unicodeLength(solution))) {
        setCurrentRowClass('jiggle')
        return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
          onClose: clearCurrentRowClass,
        })
      }

      setIsLoading(true)
      const isWordInWordList = await checkGuess(currentGuess)
      setIsLoading(false)
      if (!isWordInWordList) {
        setCurrentRowClass('jiggle')
        return showErrorAlert(WORD_NOT_FOUND_MESSAGE, {
          onClose: clearCurrentRowClass,
        })
      }

      setIsRevealing(true)
      // turn this back off after all
      // chars have been revealed
      setTimeout(() => {
        setIsRevealing(false)
      }, REVEAL_TIME_MS * unicodeLength(solution))

      const winningWord = isWinningWord(currentGuess, solution)

      if (
        unicodeLength(currentGuess) === unicodeLength(solution) &&
        guesses.length < MAX_CHALLENGES &&
        !isGameWon
      ) {
        setGuesses([...guesses, currentGuess])
        setCurrentGuess('')

        if (winningWord) {
          if (isLatestGame) {
            setStats(getStatsForCompletedGame(stats, guesses.length))
          }
          return setIsGameWon(true)
        }

        if (guesses.length === MAX_CHALLENGES - 1) {
          if (isLatestGame) {
            setStats(getStatsForCompletedGame(stats, guesses.length + 1))
          }
          setIsGameLost(true)
        }
      }
    } catch (e: any) {
      setIsLoading(false)
      const errorMsg = e.message || e
      console.log(errorMsg)
      showErrorAlert(errorMsg.toString())
    }
  }

  return (
    <Div100vh>
      <div className="flex h-full flex-col">
        <Navbar
          setIsInfoModalOpen={setIsInfoModalOpen}
          setIsStatsModalOpen={setIsStatsModalOpen}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
          isDarkMode={isDarkMode}
        />

        <div className="mx-auto flex w-full grow flex-col px-1 pt-6 pb-8 sm:px-6 md:max-w-7xl lg:px-8 short:pb-2 short:pt-2">
          <div
            style={{ position: 'relative' }}
            className="flex grow flex-col justify-center pb-6 short:pb-2"
          >
            <Loader loading={loading} position={'absolute'} />
            <Grid
              solution={solution}
              guesses={guesses}
              currentGuess={currentGuess}
              isRevealing={isRevealing}
              currentRowClassName={currentRowClass}
            />
          </div>
          <Keyboard
            onChar={onChar}
            onDelete={onDelete}
            onEnter={onEnter}
            solution={solution}
            updateLastChar={updateLastChar}
            guesses={guesses}
            currentGuess={currentGuess}
            isRevealing={isRevealing}
          />
          <InfoModal
            isOpen={isInfoModalOpen}
            handleClose={() => setIsInfoModalOpen(false)}
          />
          <StatsModal
            isOpen={isStatsModalOpen}
            handleClose={() => setIsStatsModalOpen(false)}
            solution={solution}
            guesses={guesses}
            gameDate={gameDate}
            gameStats={stats}
            isLatestGame={isLatestGame}
            isGameLost={isGameLost}
            isGameWon={isGameWon}
            handleShareToClipboard={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
            handleShareFailure={() =>
              showErrorAlert(SHARE_FAILURE_TEXT, {
                durationMs: LONG_ALERT_TIME_MS,
              })
            }
            handleMigrateStatsButton={() => {
              setIsStatsModalOpen(false)
              setIsMigrateStatsModalOpen(true)
            }}
            isHardMode={isHardMode}
            isDarkMode={isDarkMode}
            isHighContrastMode={isHighContrastMode}
            numberOfGuessesMade={guesses.length}
          />

          <MigrateStatsModal
            isOpen={isMigrateStatsModalOpen}
            handleClose={() => setIsMigrateStatsModalOpen(false)}
          />
          <SettingsModal
            isOpen={isSettingsModalOpen}
            handleClose={() => setIsSettingsModalOpen(false)}
            isHardMode={isHardMode}
            handleHardMode={handleHardMode}
            isDarkMode={isDarkMode}
            handleDarkMode={handleDarkMode}
            isHighContrastMode={isHighContrastMode}
            handleHighContrastMode={handleHighContrastMode}
          />
        </div>
      </div>
    </Div100vh>
  )
}

export default Game
