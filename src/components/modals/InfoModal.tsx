import { Cell } from '../grid/Cell'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal
      title="விளையாடும் முறை"
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <p className="text-sm text-gray-500 dark:text-gray-300">
        சரியான சொல்லை முயல 5 வாய்ப்புகள் வழங்கப்படும். முயன்ற சொற்களுக்கேற்ப
        ஒவ்வொரு முறையும் கட்டத்தின் நிறம் மாற்றமாகும்.
      </p>

      <div className="mb-1 mt-4 flex justify-center">
        <Cell
          isRevealing={true}
          isCompleted={true}
          value="த"
          status="correct"
        />
        <Cell value="மி" isCompleted={true} />
        <Cell value="ழ்" isCompleted={true} />
        <Cell value="மொ" isCompleted={true} />
        <Cell value="ழி" isCompleted={true} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        <b>த</b> எழுத்து சரியான இடத்தில் உள்ளது.
      </p>

      <div className="mb-1 mt-4 flex justify-center">
        <Cell value="அ" isCompleted={true} />
        <Cell value="றி" isCompleted={true} />
        <Cell
          isRevealing={true}
          isCompleted={true}
          value="வி"
          status="present"
        />
        <Cell value="ய" isCompleted={true} />
        <Cell value="ல்" isCompleted={true} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        <b>வி</b> எழுத்து தவறான இடத்தில் உள்ளது.
      </p>

      <div className="mb-1 mt-4 flex justify-center">
        <Cell value="வி" isCompleted={true} />
        <Cell value="ளை" isCompleted={true} />
        <Cell value="யா" isCompleted={true} />
        <Cell
          isRevealing={true}
          isCompleted={true}
          value="ட்"
          status="absent"
        />
        <Cell value="டு" isCompleted={true} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        <b>ட்</b> எழுத்து எந்த இடத்திலும் இல்லை.
      </p>

      {/* <p className="mt-6 text-sm italic text-gray-500 dark:text-gray-300">
        This is an open source version of the word guessing game we all know and
        love -{' '}
        <a
          href="https://github.com/cwackerfuss/react-wordle"
          className="font-bold underline"
        >
          check out the code here
        </a>{' '}
      </p> */}
    </BaseModal>
  )
}
