import { ShareIcon } from '@heroicons/react/outline'
import Countdown from 'react-countdown'

import {
  ENABLE_ARCHIVED_GAMES,
  ENABLE_MIGRATE_STATS,
} from '../../constants/settings'
import {
  GUESS_DISTRIBUTION_TEXT,
  NEW_WORD_TEXT,
  SHARE_TEXT,
  STATISTICS_TITLE,
} from '../../constants/strings'
import { GameStats } from '../../lib/localStorage'
import { shareStatus } from '../../lib/share'
import { Histogram } from '../stats/Histogram'
import { MigrationIntro } from '../stats/MigrationIntro'
import { StatBar } from '../stats/StatBar'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
  solution: string
  guesses: string[]
  gameStats: GameStats
  isLatestGame: boolean
  isGameLost: boolean
  isGameWon: boolean
  handleShareToClipboard: () => void
  handleShareFailure: () => void
  handleMigrateStatsButton: () => void
  isHardMode: boolean
  isDarkMode: boolean
  isHighContrastMode: boolean
  numberOfGuessesMade: number
  index: number
  tomorrow: number
}

export const StatsModal = ({
  isOpen,
  handleClose,
  solution,
  guesses,
  gameStats,
  isLatestGame,
  isGameLost,
  isGameWon,
  handleShareToClipboard,
  handleShareFailure,
  handleMigrateStatsButton,
  isHardMode,
  isDarkMode,
  isHighContrastMode,
  numberOfGuessesMade,
  index,
  tomorrow,
}: Props) => {
  if (gameStats.totalGames <= 0) {
    return (
      <BaseModal
        title={STATISTICS_TITLE}
        isOpen={isOpen}
        handleClose={handleClose}
      >
        <StatBar gameStats={gameStats} />
        {ENABLE_MIGRATE_STATS && (
          <MigrationIntro handleMigrateStatsButton={handleMigrateStatsButton} />
        )}
      </BaseModal>
    )
  }
  return (
    <BaseModal
      title={STATISTICS_TITLE}
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <StatBar gameStats={gameStats} />
      <h4 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
        {GUESS_DISTRIBUTION_TEXT}
      </h4>
      <Histogram
        isLatestGame={isLatestGame}
        gameStats={gameStats}
        isGameWon={isGameWon}
        numberOfGuessesMade={numberOfGuessesMade}
      />
      {(isGameLost || isGameWon) && (
        <div className="mt-5 columns-2 items-center items-stretch justify-center text-center dark:text-white sm:mt-6">
          <div className="inline-block w-full text-left">
            {(!ENABLE_ARCHIVED_GAMES || isLatestGame) && (
              <div>
                <h5>{NEW_WORD_TEXT}</h5>
                <Countdown
                  className="text-lg font-medium text-gray-900 dark:text-gray-100"
                  date={tomorrow}
                  daysInHours={true}
                />
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              className="wordly-btn mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2 text-center text-sm font-medium text-white shadow-sm sm:text-base"
              onClick={() => {
                shareStatus(
                  solution,
                  index,
                  guesses,
                  isGameLost,
                  isHardMode,
                  isDarkMode,
                  isHighContrastMode,
                  handleShareToClipboard,
                  handleShareFailure
                )
              }}
            >
              <ShareIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />
              {SHARE_TEXT}
            </button>
          </div>
        </div>
      )}
      {ENABLE_MIGRATE_STATS && (
        <div>
          <hr className="mt-4 -mb-4 border-gray-500" />
          <MigrationIntro handleMigrateStatsButton={handleMigrateStatsButton} />
        </div>
      )}
    </BaseModal>
  )
}
