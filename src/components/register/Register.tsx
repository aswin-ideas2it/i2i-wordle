import { useEffect, useState } from 'react'
import Div100vh from 'react-div-100vh'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import Header from '../header/Header'
import Loader from './../../components/loader'
import { useAlert } from './../../context/AlertContext'
import { createUser, sendVerificationLink } from './../../lib/user'

const errorMsg = {
  invalidMail: `Please enter a valid email address`,
  mail: `Please enter email address`,
  userName: `Please enter User Name`,
  pwd: `Please enter password`,
  uae: `Mail Id already exists`,
  pwdLength: `Password must be greater than 5 charachers`,
}

const Register = () => {
  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()
  const navigate = useNavigate()
  const [loading, setIsLoading] = useState(false)
  const [mail, setMail] = useState({ value: '', errorMsg: '' })
  const [userName, setuserName] = useState({ value: '', errorMsg: '' })
  const [pwd, setPwd] = useState({ value: '', errorMsg: '' })

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        onRegisterBtnClick()
      }
    }
    window.addEventListener('keyup', listener)
    return () => {
      window.removeEventListener('keyup', listener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mail.value, pwd.value, userName.value])

  const onRegisterBtnClick = async () => {
    try {
      clearForm()
      const isValid = validateForm()
      if (isValid) {
        setIsLoading(true)
        const response = await createUser(mail.value, userName.value, pwd.value)
        if (response === 'UAE') {
          setIsLoading(false)
          setMail({ ...mail, errorMsg: errorMsg.uae })
        } else {
          sendVerificationLink(mail.value)
          setIsLoading(false)
          showSuccessAlert('User Resgistered Successfully')
          navigate('/login')
        }
      }
    } catch (e: any) {
      setIsLoading(false)
      const errorMsg = e.message || e
      console.log(errorMsg)
      showErrorAlert(errorMsg.toString())
    }
  }

  const clearForm = () => {
    setMail({ ...mail, errorMsg: '' })
    setuserName({ ...userName, errorMsg: '' })
    setPwd({ ...pwd, errorMsg: '' })
  }

  const validateForm = () => {
    let isValid = true
    if (!mail.value) {
      setMail({ ...mail, errorMsg: errorMsg.mail })
      isValid = false
    } else if (!mail.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setMail({ ...mail, errorMsg: errorMsg.invalidMail })
      isValid = false
    }

    if (!userName.value) {
      setuserName({ ...userName, errorMsg: errorMsg.userName })
      isValid = false
    }
    if (!pwd.value) {
      setPwd({ ...pwd, errorMsg: errorMsg.pwd })
      isValid = false
    } else if (pwd.value.length < 6) {
      setPwd({ ...pwd, errorMsg: errorMsg.pwdLength })
      isValid = false
    }
    return isValid
  }

  return (
    <Div100vh>
      <Loader loading={loading} />
      <div className="flex h-full flex-col">
        <div className="mx-auto flex w-full grow flex-col pb-4 pl-3 pr-3 pt-8">
          <Header />
          <section className="item-center flex justify-center pt-4">
            <div className="w-full rounded-lg border border-[#58524f] bg-[#1d1512] shadow sm:max-w-md md:mt-0 xl:p-0 ">
              <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
                <h1 className="text-l text-center font-bold leading-tight tracking-tight text-white">
                  Sign Up
                </h1>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Email
                  </label>
                  <input
                    onChange={(e) =>
                      setMail({ ...mail, value: e.currentTarget.value })
                    }
                    type="email"
                    name="email"
                    value={mail.value}
                    id="email"
                    className="wordly-input block w-full rounded-lg border p-2.5 text-gray-900 sm:text-sm"
                    placeholder="Enter your email"
                  />
                  {mail.errorMsg && (
                    <div className="wordly-input-error">{mail.errorMsg}</div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Name
                  </label>
                  <input
                    onChange={(e) =>
                      setuserName({ ...userName, value: e.currentTarget.value })
                    }
                    type="text"
                    name="username"
                    value={userName.value}
                    id="username"
                    className="wordly-input block w-full rounded-lg border p-2.5 text-gray-900 sm:text-sm"
                    placeholder="Enter your username"
                  />
                  {userName.errorMsg && (
                    <div className="wordly-input-error">
                      {userName.errorMsg}
                    </div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Password
                  </label>
                  <input
                    onChange={(e) =>
                      setPwd({ ...pwd, value: e.currentTarget.value })
                    }
                    type="password"
                    name="password"
                    value={pwd.value}
                    id="password"
                    className="wordly-input block w-full rounded-lg border p-2.5 text-gray-900 sm:text-sm"
                    placeholder="Enter your password"
                  />
                  {pwd.errorMsg && (
                    <div className="wordly-input-error">{pwd.errorMsg}</div>
                  )}
                </div>
                <button
                  onClick={() => onRegisterBtnClick()}
                  className="wordly-btn mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2 text-center text-sm font-medium text-white shadow-sm sm:text-base"
                >
                  Sign up
                </button>
                <p className="text-sm font-light text-gray-100">
                  Already have an account? &nbsp;
                  <Link className="font-medium text-[#f1cb81]" to={'/login'}>
                    Log In
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Div100vh>
  )
}

export default Register
