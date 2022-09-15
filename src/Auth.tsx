import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import App from './App'
import Loader from './components/loader'
import { useAlert } from './context/AlertContext'
import { GameDataDoc, retreiveGameDetails } from './lib/game'
import { UserDetails, getUser, setUser } from './lib/localStorage'
import { clearItems } from './lib/localStorage'
import { getGameDate } from './lib/words'
import { getSolution } from './lib/words'

function Auth() {
  const { isLoading, isAuthenticated, user, error, logout } = useAuth0()
  const { showError: showErrorAlert } = useAlert()
  const gameDate = useMemo(getGameDate, [])
  const [isNewUser, setIsNewUser] = useState(false)
  const [solution, setSolution] = useState('')
  const [userDetails, setUserDetails] = useState<UserDetails>({
    userId: '',
    isLocalUser: false,
    isAccountExist: false,
  })
  const [oldUserId, setOldUserId] = useState('')
  const [loading, setIsLoading] = useState(true)
  const [gameDoc, setGameDoc] = useState<GameDataDoc | undefined>(undefined)

  if (error) {
    showErrorAlert(`Auth0: ${error.message}`, {
      onClose: () => {
        clearItems()
        logout({ returnTo: window.location.origin })
      },
    })
  }

  useEffect(() => {
    if (!isLoading) {
      const _user: UserDetails | null = getUser()
      const _userDetails = userDetails
      if (isAuthenticated && user?.sub) {
        _userDetails.userId = user.sub
        _userDetails.isLocalUser = false
      } else {
        _userDetails.userId = _user?.userId
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
      retreiveGameDetails(
        _userDetails.userId,
        getSolution(gameDate).solutionIndex
      )
        .then((data) => {
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
          setUser(_userDetails)
          setUserDetails(_userDetails)
          setIsLoading(false)
        })
        .catch((e: any) => {
          setIsLoading(false)
          const errorMsg = e.message || e
          console.log(errorMsg)
          showErrorAlert(errorMsg.toString())
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading, user?.sub, gameDate])

  return !loading && solution && userDetails.userId ? (
    <App
      userDetails={userDetails}
      gameDoc={gameDoc}
      oldUserId={oldUserId}
      isNewUser={isNewUser}
      solution={solution}
      gameDate={gameDate}
    />
  ) : (
    <Loader loading={true} />
  )
}

export default Auth
