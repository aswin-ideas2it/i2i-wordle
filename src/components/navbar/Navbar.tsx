import { useAuth0 } from '@auth0/auth0-react'
import {
  ChartBarIcon,
  InformationCircleIcon,
  LogoutIcon,
  UserCircleIcon,
} from '@heroicons/react/outline'
import { Dropdown } from 'flowbite-react'

import { clearItems } from '../../lib/localStorage'
import logo from './../../assets/logo.svg'

type Props = {
  setIsInfoModalOpen: (value: boolean) => void
  setIsStatsModalOpen: (value: boolean) => void
}

export const Navbar = ({
  setIsInfoModalOpen,
  setIsStatsModalOpen,
}: Props) => {
  const auth0 = useAuth0()

  const onLogInBtnClick = () => auth0.loginWithRedirect()

  const onLogOutBtnClick = () => {
    clearItems()
    auth0.logout({ returnTo: window.location.origin })
  }

  return (
    <div className="navbar">
      <div className="navbar-content px-5 short:h-auto">
        <div className={`navbar-image`}>
          <img alt="logo" src={logo}></img>
        </div>
        <div className="right-icons">
          <div className="worldy-user-profile">
            {auth0.isAuthenticated ? (
              <Dropdown
                label={
                  <UserCircleIcon className="h-6 w-6 cursor-pointer header-icon" />
                }
                inline={true}
                floatingArrow={false}
                arrowIcon={false}
              >
                <Dropdown.Header>
                  <span
                    title={auth0.user?.name}
                    className="profile-name block text-sm"
                  >
                    {auth0.user?.name}
                  </span>
                  <span
                    title={auth0.user?.email}
                    className="profile-mail block truncate text-sm font-medium"
                  >
                    {auth0.user?.email}
                  </span>
                </Dropdown.Header>
                <Dropdown.Item onClick={() => onLogOutBtnClick()}>
                  <LogoutIcon className="mr-2 h-6 w-6 cursor-pointer  header-icon" />{' '}
                  வெளியேறு
                </Dropdown.Item>
              </Dropdown>
            ) : (
              <UserCircleIcon
                onClick={() => (auth0.isLoading ? {} : onLogInBtnClick())}
                className="h-6 w-6 cursor-pointer header-icon"
              />
            )}
          </div>
          <InformationCircleIcon
            className="ml-3 mr-3 h-6 w-6 cursor-pointer header-icon"
            onClick={() => setIsInfoModalOpen(true)}
          />
          <ChartBarIcon
            className="mr-3 h-6 w-6 cursor-pointer header-icon"
            onClick={() => setIsStatsModalOpen(true)}
          />
        </div>
      </div>
    </div>
  )
}
