import { useEffect, useState } from 'react'
import Div100vh from 'react-div-100vh'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import Header from '../header/Header'
import Loader from './../../components/loader'
import { useAlert } from './../../context/AlertContext'
import { loginGoogleUser, loginUser } from './../../lib/user'

const errorMsg = {
  invalidMail: `Please enter a valid email address`,
  mail: `Please enter email address`,
  pwd: `Please enter password`,
  incorrectPwd: `Password is incorrect`,
  pwdLength: `Password must be greater than 5 charachers`,
  unf: `User not found`,
}

const Login = () => {
  const { showError: showErrorAlert } = useAlert()
  const navigate = useNavigate()
  const [loading, setIsLoading] = useState(false)
  const [mail, setMail] = useState({ value: '', errorMsg: '' })
  const [pwd, setPwd] = useState({ value: '', errorMsg: '' })

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        onLoginBtnClick()
      }
    }
    window.addEventListener('keyup', listener)
    return () => {
      window.removeEventListener('keyup', listener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mail.value, pwd.value])

  const onLoginBtnClick = async () => {
    try {
      clearForm()
      const isValid = validateForm()
      if (isValid) {
        setIsLoading(true)
        const response = await loginUser(mail.value, pwd.value)
        setIsLoading(false)
        if (response === 'UNF') {
          setMail({ ...mail, errorMsg: errorMsg.unf })
        } else if (response === 'INP') {
          setPwd({ ...pwd, errorMsg: errorMsg.incorrectPwd })
        } else {
          navigate('/')
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
                  Sign In
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
                    id="email"
                    value={mail.value}
                    className="wordly-input block w-full rounded-lg border p-2.5 text-gray-900 sm:text-sm"
                    placeholder="Enter your email"
                  />
                  {mail.errorMsg && (
                    <div className="wordly-input-error">{mail.errorMsg}</div>
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
                    id="password"
                    value={pwd.value}
                    className="wordly-input block w-full rounded-lg border p-2.5 text-gray-900 sm:text-sm"
                    placeholder="Enter your password"
                  />
                  {pwd.errorMsg && (
                    <div className="wordly-input-error">{pwd.errorMsg}</div>
                  )}
                </div>
                <div>
                  <Link
                    className="w-full font-medium text-[#f1cb81]"
                    to={'/forgot-password'}
                  >
                    Forgot password?
                  </Link>
                </div>
                <button
                  onClick={() => onLoginBtnClick()}
                  className="wordly-btn mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2 text-center text-sm font-medium text-white shadow-sm sm:text-base"
                >
                  Sign in
                </button>
                <p className="text-sm font-light text-gray-100">
                  Don’t have an account yet? &nbsp;
                  <Link className="font-medium text-[#f1cb81]" to={'/register'}>
                    Sign Up
                  </Link>
                </p>
                <div className="wordly-brk">
                  <span>OR</span>
                </div>
                <button
                  onClick={() => loginGoogleUser()}
                  className="wordly-btn-google mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2 text-center text-sm font-medium text-white shadow-sm sm:text-base"
                >
                  <span></span>
                  Continue with Google
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Div100vh>
  )
}

export default Login
