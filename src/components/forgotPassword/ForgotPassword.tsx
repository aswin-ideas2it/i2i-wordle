import { useEffect, useState } from 'react'
import Div100vh from 'react-div-100vh'
import { Link } from 'react-router-dom'

import Header from '../header/Header'
import Loader from './../../components/loader'
import { useAlert } from './../../context/AlertContext'
import { sendResetLink } from './../../lib/user'

const errorMsg = {
  invalidMail: `Please enter a valid email address`,
  mail: `Please enter email address`,
  unf: `User Not Found`,
}

const ForgotPassword = () => {
  const { showError: showErrorAlert } = useAlert()
  const [isResetSent, setIsResetSent] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [mail, setMail] = useState({ value: '', errorMsg: '' })

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        onResetBtnClick()
      }
    }
    window.addEventListener('keyup', listener)
    return () => {
      window.removeEventListener('keyup', listener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mail.value])

  const onResetBtnClick = async () => {
    try {
      clearForm()
      const isValid = validateForm()
      if (isValid) {
        setIsLoading(true)
        const response = await sendResetLink(mail.value)
        setIsLoading(false)
        if (response === 'UNF') {
          setMail({ ...mail, errorMsg: errorMsg.unf })
        } else {
          setIsResetSent(true)
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
                  Forgot Password
                </h1>
                {!isResetSent ? (
                  <>
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
                        <div className="wordly-input-error">
                          {mail.errorMsg}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onResetBtnClick()}
                      className="wordly-btn mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2 text-center text-sm font-medium text-white shadow-sm sm:text-base"
                    >
                      Send Reset Link
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-l mt-2 inline-flex w-full items-center justify-center px-4 py-2 text-center text-white ">
                      A password reset link has been emailed to you. 
                    </div>
                  </>
                )}
                <button className="wordly-btn mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2 text-center text-sm font-medium text-white shadow-sm sm:text-base">
                  <Link className="font-medium" to={'/login'}>
                    Back to Log In
                  </Link>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Div100vh>
  )
}

export default ForgotPassword
