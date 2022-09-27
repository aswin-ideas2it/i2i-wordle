export const serverPath = {
  baseUrl: process.env.REACT_APP_SERVER_URL,
  api: {
    create: 'api/create',
    delete: 'api/delete',
    update: 'api/update',
    updateStats: 'api/updateStats',
    updateState: 'api/updateState',
    retreive: 'api/retreive',
    checkGuesses: 'api/checkGuesses',
    user: {
      create: 'api/user/create',
    },
    reset: {
      sendLink: 'api/reset/sendLink',
      changePassword: 'api/reset/changePassword',
      getUser: 'api/reset/getUser',
    },
    verify: {
      verifyUser: 'api/verify/verifyUser',
      sendLink: 'api/verify/sendLink',
      getUser: 'api/verify/getUser',
    },
    auth: {
      login: 'api/auth/login',
      logout: 'api/auth/logout',
      checkAuthStatus: 'api/auth/checkAuthStatus',
      googleLogin: 'api/auth/google',
    },
  },
}
