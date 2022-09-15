import { unicodeLength } from '../../lib/words'
import { Cell } from './Cell'

type Props = {
  solution: string
}

export const EmptyRow = ({ solution }: Props) => {
  const emptyCells = Array.from(Array(unicodeLength(solution)))

  return (
    <div className="mb-1 flex justify-center">
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  )
}
