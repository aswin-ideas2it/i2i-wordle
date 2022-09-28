import { useEffect, useState } from 'react'
import Div100vh from 'react-div-100vh'
import { Link } from 'react-router-dom'
import { useNavigate, useParams } from 'react-router-dom'

import { useAlert } from '../../context/AlertContext'
import { getResetDetail, resetPassword } from '../../lib/user'
import Header from '../header/Header'
import Loader from '../loader'

const errorMsg = {
  pwd: `Please enter password`,
  pwdLength: `Password must be greater than 5 charachers`,
  unf: `User not found`,
  exp: 'Link is invalid or expired',
}

const ResetPassword = () => {
  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()
  let { id, token } = useParams()
  const navigate = useNavigate()
  const [err, setErr] = useState('')
  const [pwd, setPwd] = useState({ value: '', errorMsg: '' })
  const [loading, setIsLoading] = useState(false)
  const [userDetails, setUserDetails] = useState({ userId: '', userName: '' })

  useEffect(() => {
    setIsLoading(true)
    getResetDetail(id?.toString() as string, token?.toString() as string)
      .then((response: any) => {
        setIsLoading(false)
        if (response === 'UNF') {
          setErr(errorMsg.unf)
        } else if (response === 'EXP') {
          setErr(errorMsg.exp)
        } else {
          setUserDetails(response)
        }
      })
      .catch((e: any) => {
        setIsLoading(false)
        const errorMsg = e.message || e
        console.log(errorMsg)
        showErrorAlert(errorMsg.toString())
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  }, [pwd.value])

  const onResetBtnClick = async () => {
    try {
      clearForm()
      const isValid = validateForm()
      if (isValid) {
        setIsLoading(true)
        const response: any = await resetPassword(
          userDetails.userId,
          pwd.value,
          token?.toString() as string
        )
        setIsLoading(false)
        if (response === 'EXP') {
          setErr(errorMsg.exp)
        } else {
          showSuccessAlert('Password changed successfully')
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
    setPwd({ ...pwd, errorMsg: '' })
  }

  const validateForm = () => {
    let isValid = true
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
                  Reset Password{' '}
                  {userDetails.userName && `(${userDetails.userName})`}
                </h1>
                {!err ? (
                  <>
                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-medium text-white"
                      >
                        New Password
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
                        placeholder="Enter your new password"
                      />
                      {pwd.errorMsg && (
                        <div className="wordly-input-error">{pwd.errorMsg}</div>
                      )}
                    </div>
                    <button
                      onClick={() => onResetBtnClick()}
                      className="wordly-btn mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2 text-center text-sm font-medium text-white shadow-sm sm:text-base"
                    >
                      Reset
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-l mt-2 inline-flex w-full items-center justify-center px-4 py-2 text-center text-red-500">
                      {err}
                    </div>
                  </>
                )}
                <button className="wordly-btn mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent text-center text-sm font-medium text-white shadow-sm sm:text-base">
                  <Link className="w-full px-4 py-2 font-medium" to={'/login'}>
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

export default ResetPassword
