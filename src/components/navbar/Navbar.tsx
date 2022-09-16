import { useAuth0 } from '@auth0/auth0-react'
import {
  ChartBarIcon,
  CogIcon,
  InformationCircleIcon,
  LogoutIcon,
  UserCircleIcon,
} from '@heroicons/react/outline'
import { Dropdown } from 'flowbite-react'
import { useEffect, useState } from 'react'

import { GAME_TITLE } from '../../constants/strings'
import { clearItems } from '../../lib/localStorage'
import darkLogo from './../../dark-logo.svg'
import logo from './../../logo.svg'

type Props = {
  setIsInfoModalOpen: (value: boolean) => void
  setIsStatsModalOpen: (value: boolean) => void
  setIsSettingsModalOpen: (value: boolean) => void
  isDarkMode: boolean
}

export const Navbar = ({
  setIsInfoModalOpen,
  setIsStatsModalOpen,
  setIsSettingsModalOpen,
  isDarkMode,
}: Props) => {
  const auth0 = useAuth0()
  const [isMobile, setMobile] = useState(window.innerWidth < 800)

  const updateMedia = () => {
    setMobile(window.innerWidth < 800)
  }
  useEffect(() => {
    window.addEventListener('resize', updateMedia)
    return () => window.removeEventListener('resize', updateMedia)
  })

  const onLogInBtnClick = () => auth0.loginWithRedirect()

  const onLogOutBtnClick = () => {
    clearItems()
    auth0.logout({ returnTo: window.location.origin })
  }

  const NavBarImage = () => (
    <div className={`navbar-image ${isMobile ? 'mobile' : 'desktop'}`}>
      <img alt="logo" src={isDarkMode ? darkLogo : logo}></img>
    </div>
  )

  const NavBarTitle = () => (
    <div
      className={`navbar-title text-xl font-bold dark:text-white ${
        isMobile ? 'mobile' : 'desktop'
      }`}
    >
      {GAME_TITLE}
    </div>
  )

  return (
    <div className="navbar">
      <div className="navbar-content px-5 short:h-auto">
        {!isMobile ? (
          <>
            <NavBarImage />
            <NavBarTitle />
          </>
        ) : (
          <div className="flex flex-row items-center justify-center">
            <NavBarImage />
            <NavBarTitle />
          </div>
        )}

        <div className="right-icons">
          <div className="worldy-user-profile">
            {auth0.isAuthenticated ? (
              <Dropdown
                label={
                  <UserCircleIcon className="h-6 w-6 cursor-pointer dark:stroke-white" />
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
                  <LogoutIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />{' '}
                  வெளியேறு
                </Dropdown.Item>
              </Dropdown>
            ) : (
              <UserCircleIcon
                onClick={() => (auth0.isLoading ? {} : onLogInBtnClick())}
                className="h-6 w-6 cursor-pointer dark:stroke-white"
              />
            )}
          </div>
          <InformationCircleIcon
            className="ml-3 mr-3 h-6 w-6 cursor-pointer dark:stroke-white"
            onClick={() => setIsInfoModalOpen(true)}
          />
          <ChartBarIcon
            className="mr-3 h-6 w-6 cursor-pointer dark:stroke-white"
            onClick={() => setIsStatsModalOpen(true)}
          />
          <CogIcon
            className="h-6 w-6 cursor-pointer dark:stroke-white"
            onClick={() => setIsSettingsModalOpen(true)}
          />
        </div>
      </div>
    </div>
  )
}
