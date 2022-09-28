import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import App from './App'
import Loader from './components/loader'
import { useAlert } from './context/AlertContext'
import { getISTDate } from './lib/dateutils'
import { GameDataDoc, retreiveGameDetails } from './lib/game'
import {
  LSUserDetails,
  UserDetails,
  getUser,
  setUser,
} from './lib/localStorage'
import { AuthStatus, checkAuthStatus } from './lib/user'

function Auth() {
  const { showError: showErrorAlert } = useAlert()
  const [gameDate, setGameDate] = useState('')
  const [index, setIndex] = useState(0)
  const [tomorrow, setTomorrow] = useState(0)
  const [isNewUser, setIsNewUser] = useState(false)
  const [solution, setSolution] = useState('')
  const [userDetails, setUserDetails] = useState<UserDetails>({
    userId: '',
    isVerified: false,
    id: '',
    isLocalUser: false,
    isAccountExist: false,
    userName: '',
    isAuthenticated: false,
    dp: '',
  })
  const [oldUserId, setOldUserId] = useState('')
  const [loading, setIsLoading] = useState(true)
  const [gameDoc, setGameDoc] = useState<GameDataDoc | undefined>(undefined)

  useEffect(() => {
    const _user: LSUserDetails | null = getUser()
    const _userDetails = userDetails
    checkAuthStatus()
      .then((authStatus: AuthStatus) => {
        _userDetails.isAuthenticated = authStatus.isAuthenticated
        if (authStatus.isAuthenticated) {
          _userDetails.userId = authStatus.user.userId
          _userDetails.isLocalUser = false
          _userDetails.userName = authStatus.user.userName
        } else {
          _userDetails.userId =
            _user?.userId && _user.userId.includes('wordly-app')
              ? _user.userId
              : `wordly-app-${uuidv4({
                  random: [
                    0x10, 0x91, 0x56, 0xbe, 0xc4, 0xfb, 0xc1, 0xea, 0x71, 0xb4,
                    0xef, 0xe1, 0x67, 0x1c, 0x58, 0x36,
                  ],
                })}-${new Date().getTime().toString()}`
          if (!_user?.userId) {
            setIsNewUser(true)
          }
          _userDetails.isLocalUser = true
        }
        retreiveGameDetails(_userDetails.userId).then((data) => {
          setGameDate(data.gameDate)
          setIndex(data.index)
          setTomorrow(getISTDate(data.tomorrow).getTime())
          setSolution(data.solution)
          if (
            _user &&
            _user.isLocalUser &&
            !_userDetails.isLocalUser &&
            _user.userId !== _userDetails.userId
          ) {
            setOldUserId(_user?.userId)
          }
          _userDetails.isAccountExist = !!data.gameData
          if (_userDetails.isAccountExist) {
            setGameDoc(data.gameData)
          }
          if (data.userDetails && data.userDetails._id) {
            _userDetails.isVerified = data.userDetails.isVerified
            _userDetails.id = data.userDetails._id
            _userDetails.dp = data.userDetails.dp
          }
          setUser(_userDetails)
          setUserDetails(_userDetails)
          setIsLoading(false)
        })
      })
      .catch((e: any) => {
        setIsLoading(false)
        const errorMsg = e.message || e
        console.log(errorMsg)
        showErrorAlert(errorMsg.toString())
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return !loading && solution && userDetails.userId ? (
    <App
      userDetails={userDetails}
      gameDoc={gameDoc}
      oldUserId={oldUserId}
      isNewUser={isNewUser}
      solution={solution}
      gameDate={gameDate}
      tomorrow={tomorrow}
      index={index}
    />
  ) : (
    <Loader loading={true} />
  )
}

export default Auth
