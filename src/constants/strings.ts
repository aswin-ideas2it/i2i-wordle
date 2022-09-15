export const GAME_TITLE = process.env.REACT_APP_GAME_NAME!

export const WIN_MESSAGES = ['வெற்றி!', 'அருமை!', 'மிக சிறப்பு!']
export const GAME_COPIED_MESSAGE = 'முடிவுகள் பகிர நகலெடுக்கப்பட்டது'
export const NOT_ENOUGH_LETTERS_MESSAGE = 'குறைந்த எழுத்து எண்ணிக்கை'
export const WORD_NOT_FOUND_MESSAGE = 'சொல் காணவில்லை'
export const HARD_MODE_ALERT_MESSAGE =
  'Hard Mode can only be enabled at the start!'
export const HARD_MODE_DESCRIPTION =
  'Any revealed hints must be used in subsequent guesses'
export const HIGH_CONTRAST_MODE_DESCRIPTION = 'மிகைத்த மேம்பட்ட நிறப்பார்வை'
export const CORRECT_WORD_MESSAGE = (solution: string) =>
  `The word was ${solution}`
export const WRONG_SPOT_MESSAGE = (guess: string, position: number) =>
  `Must use ${guess} in position ${position}`
export const NOT_CONTAINED_MESSAGE = (letter: string) =>
  `Guess must contain ${letter}`
export const ENTER_TEXT = 'நுழை'
export const DELETE_TEXT = 'நீக்கு'
export const STATISTICS_TITLE = 'புள்ளியல்'
export const GUESS_DISTRIBUTION_TEXT = 'முயற்சிகள்'
export const NEW_WORD_TEXT = 'அடுத்த சொல்'
export const SHARE_TEXT = 'பகிர்'
export const SHARE_FAILURE_TEXT =
  'Unable to share the results. This feature is available only in secure contexts (HTTPS), in some or all supporting browsers.'
export const MIGRATE_BUTTON_TEXT = 'Transfer'
export const MIGRATE_DESCRIPTION_TEXT =
  'Click here to transfer your statistics to a new device.'
export const TOTAL_TRIES_TEXT = 'விளையாட்டு'
export const SUCCESS_RATE_TEXT = 'வெற்றி'
export const CURRENT_STREAK_TEXT = 'தொடர் வெற்றி'
export const BEST_STREAK_TEXT = 'சிறந்த தொடர்'
export const DISCOURAGE_INAPP_BROWSER_TEXT =
  "You are using an embedded browser and may experience problems sharing or saving your results. We encourage you rather to use your device's default browser."

export const DATEPICKER_TITLE = 'Choose a past date'
export const DATEPICKER_CHOOSE_TEXT = 'Choose'
export const DATEPICKER_TODAY_TEXT = 'today'
export const ARCHIVE_GAMEDATE_TEXT = 'Game date'
