export const CLIENT_ID = process.env.REACT_APP_CLIENT_ID as string
export const DOMAIN = process.env.REACT_APP_DOMAIN as string
export const AUDIENCE = `https://${process.env.REACT_APP_DOMAIN}/api/v2/`
export const SCOPE = 'read:current_user update:current_user_metadata'
