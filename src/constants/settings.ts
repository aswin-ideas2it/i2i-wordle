import { enUS } from 'date-fns/locale'

export const MAX_CHALLENGES = 5
export const ALERT_TIME_MS = 2000
export const LONG_ALERT_TIME_MS = 10000
export const REVEAL_TIME_MS = 350
export const WELCOME_INFO_MODAL_MS = 350
export const DISCOURAGE_INAPP_BROWSERS = true
export const ENABLE_MIGRATE_STATS = false
export const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY as string
export const ENCRYPTION_IV = process.env.REACT_APP_ENCRYPTION_IV as string
export const ENABLE_ARCHIVED_GAMES = false
export const DATE_LOCALE = enUS
