import classnames from 'classnames'
import { ReactNode } from 'react'

import { REVEAL_TIME_MS } from '../../constants/settings'
import { getStoredIsHighContrastMode } from '../../lib/localStorage'
import { CharStatus } from '../../lib/statuses'

type Props = {
  children?: ReactNode
  value: string
  width?: number
  status?: CharStatus
  onClick: (value: string) => void
  isRevealing?: boolean
  highLight?: boolean
  title?: string
}

export const Key = ({
  children,
  status,
  width = 40,
  value,
  title = '',
  onClick,
  highLight = false,
  isRevealing,
}: Props) => {
  const keyDelayMs = REVEAL_TIME_MS * 6
  const isHighContrast = getStoredIsHighContrastMode()

  const classes = classnames(
    'wordly-key xxshort:h-8 active:animate-pulse xxshort:w-8 xxshort:text-xxs xshort:w-10 xshort:h-10 flex short:h-10 h-10 items-center justify-center rounded mx-0.5 text-xs font-bold cursor-pointer select-none dark:text-white',
    {
      'transition ease-in-out': isRevealing,
      'bg-slate-200 dark:bg-[#5a524f] hover:bg-[#5a524f] active:bg-[#5a524f]':
        !status,
      'bg-slate-400 dark:bg-slate-800 text-white': status === 'absent',
      'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white':
        status === 'correct' && isHighContrast,
      'bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white':
        status === 'present' && isHighContrast,
      'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white':
        status === 'correct' && !isHighContrast,
      'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white':
        status === 'present' && !isHighContrast,
    }
  )

  const getSyles = () => {
    let styles = {
      transitionDelay: isRevealing ? `${keyDelayMs}ms` : 'unset',
      width: `${width}px`,
    }
    if (highLight) {
      styles = { ...styles, ...{ border: '4px solid lightgray' } }
    }

    return styles
  }

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick(value)
    event.currentTarget.blur()
  }

  return (
    <button
      title={title}
      style={getSyles()}
      aria-label={`${value}${status ? ' ' + status : ''}`}
      className={classes}
      onClick={handleClick}
    >
      {children || value}
    </button>
  )
}
