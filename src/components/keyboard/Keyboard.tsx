import { BackspaceIcon, CheckCircleIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'

import { DELETE_TEXT, ENTER_TEXT } from '../../constants/strings'
import { getStatuses } from '../../lib/statuses'
import { unicodeSplit } from '../../lib/words'
import { Key } from './Key'
import {
  akkuLetter,
  granthaLetters,
  meiLetters,
  subLettersMapping,
  uyirLetters,
} from './locale/tn'

type Props = {
  onChar: (value: string) => void
  onDelete: () => void
  onEnter: () => void
  updateLastChar: (value: string) => void
  solution: string
  guesses: string[]
  isRevealing?: boolean
  currentGuess: string
}

export const Keyboard = ({
  onChar,
  onDelete,
  onEnter,
  solution,
  guesses,
  isRevealing,
  updateLastChar,
  currentGuess,
}: Props) => {
  const [firstRowLetters, setFirstRowLetters] = useState(uyirLetters)
  const charStatuses = getStatuses(solution, guesses)

  const onClick = (value: string) => {
    if (value === 'ENTER') {
      onEnter()
      setFirstRowLetters(uyirLetters)
    } else if (value === 'DELETE') {
      onDelete()
      setFirstRowLetters(uyirLetters)
    } else if (value === 'SWITCH') {
      if (uyirLetters === firstRowLetters) {
        onChar(akkuLetter)
      } else {
        setFirstRowLetters(uyirLetters)
      }
    } else {
      const spllitedVal = unicodeSplit(currentGuess)
      const lastChar = spllitedVal[spllitedVal.length - 1]
      if (
        subLettersMapping[lastChar] &&
        subLettersMapping[lastChar].includes(value)
      ) {
        updateLastChar(value)
        setFirstRowLetters(uyirLetters)
      } else {
        onChar(value)
      }
      setFirstRowLetters(subLettersMapping[value] || uyirLetters)
    }
  }

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        onEnter()
        setFirstRowLetters(uyirLetters)
      } else if (e.code === 'Backspace') {
        onDelete()
        setFirstRowLetters(uyirLetters)
      }
    }
    window.addEventListener('keyup', listener)
    return () => {
      window.removeEventListener('keyup', listener)
    }
  }, [onEnter, onDelete])

  return (
    <div>
      <div className="mb-1 flex justify-center">
        {firstRowLetters.slice(0, 4).map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
          />
        ))}
        <div className="mr-1"></div>
        {meiLetters.slice(0, 6).map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
          />
        ))}
      </div>
      <div className="mb-1 flex justify-center">
        {firstRowLetters.slice(4, 8).map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
          />
        ))}
        <div className="mr-1"></div>
        {meiLetters.slice(6, 12).map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
          />
        ))}
      </div>
      <div className="mb-1 flex justify-center">
        {firstRowLetters.slice(8, 12).map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
          />
        ))}
        <div className="mr-1"></div>
        {meiLetters.slice(12, 18).map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <Key width={55} value="ENTER" onClick={onClick} title={ENTER_TEXT}>
          <CheckCircleIcon className="h-6 w-6 stroke-gray-600 dark:stroke-gray-300" />
        </Key>
        <Key
          width={50}
          highLight={firstRowLetters !== uyirLetters}
          value="SWITCH"
          onClick={onClick}
        >
          {akkuLetter}
        </Key>
        {granthaLetters.map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
          />
        ))}
        <Key width={55} value="DELETE" onClick={onClick} title={DELETE_TEXT}>
          <BackspaceIcon className="h-6 w-6 stroke-gray-600 dark:stroke-gray-300" />
        </Key>
      </div>
    </div>
  )
}
