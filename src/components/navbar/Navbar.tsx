import {
  ChartBarIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  LogoutIcon,
  UserCircleIcon,
} from '@heroicons/react/outline'
import { Dropdown } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'

import { UserDetails, clearItems } from '../../lib/localStorage'
import { logoutUser } from '../../lib/user'
import logo from './../../assets/logo.svg'

type Props = {
  userDetails: UserDetails
  setIsInfoModalOpen: (value: boolean) => void
  setIsStatsModalOpen: (value: boolean) => void
}

export const Navbar = ({
  setIsInfoModalOpen,
  setIsStatsModalOpen,
  userDetails,
}: Props) => {
  const navigate = useNavigate()
  const onLogInBtnClick = () => navigate('/login')

  const onLogOutBtnClick = async () => {
    clearItems()
    await logoutUser()
    window.location.reload()
  }

  const onVerifyBtnClick = async () => {
    navigate(`/verify/${userDetails.id}`)
  }
  return (
    <div className="navbar">
      <div className="navbar-content px-5 short:h-auto">
        <div className={`navbar-image`}>
          <img alt="logo" src={logo}></img>
        </div>
        <div className="right-icons">
          <div className="worldy-user-profile">
            {userDetails.isAuthenticated ? (
              <Dropdown
                label={
                  userDetails.dp ? (
                    <img
                      className="header-icon user-icon cursor-pointer rounded-full"
                      referrerPolicy="no-referrer"
                      alt="avatar"
                      src={userDetails.dp}
                    />
                  ) : (
                    <div className="header-icon user-icon flex cursor-pointer items-center justify-center rounded-full border-2 border-[#f1cb81] font-medium">
                      {userDetails.userName.substring(0, 1).toUpperCase()}
                    </div>
                  )
                }
                inline={true}
                floatingArrow={false}
                arrowIcon={false}
              >
                <Dropdown.Header>
                  <span
                    title={userDetails.userName}
                    className="profile-name block text-sm"
                  >
                    {userDetails.userName}
                  </span>
                  <span
                    title={userDetails.userId}
                    className="profile-mail block truncate text-sm font-medium"
                  >
                    {userDetails.userId}
                  </span>
                </Dropdown.Header>
                {!userDetails.isVerified && (
                  <Dropdown.Item onClick={() => onVerifyBtnClick()}>
                    <CheckCircleIcon className="header-icon mr-2 h-6 w-6  cursor-pointer" />{' '}
                    Verify Account
                  </Dropdown.Item>
                )}
                <Dropdown.Item onClick={() => onLogOutBtnClick()}>
                  <LogoutIcon className="header-icon mr-2 h-6 w-6  cursor-pointer" />{' '}
                  வெளியேறு
                </Dropdown.Item>
              </Dropdown>
            ) : (
              <UserCircleIcon
                onClick={() => onLogInBtnClick()}
                className="header-icon h-6 w-6 cursor-pointer"
              />
            )}
          </div>
          <InformationCircleIcon
            className="header-icon ml-3 mr-3 h-6 w-6 cursor-pointer"
            onClick={() => setIsInfoModalOpen(true)}
          />
          <ChartBarIcon
            className="header-icon mr-3 h-6 w-6 cursor-pointer"
            onClick={() => setIsStatsModalOpen(true)}
          />
        </div>
      </div>
    </div>
  )
}
