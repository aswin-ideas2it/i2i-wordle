import { CheckCircleIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import Div100vh from 'react-div-100vh'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import { useAlert } from '../../context/AlertContext'
import { verifyUser } from '../../lib/user'
import Header from '../header/Header'
import Loader from '../loader'

const errorMsg = {
  pwd: `Please enter password`,
  pwdLength: `Password must be greater than 5 charachers`,
  unf: `User not found`,
  exp: 'Link is invalid or expired',
}

const VerifiedUser = () => {
  const { showError: showErrorAlert } = useAlert()
  let { id, token } = useParams()
  const [err, setErr] = useState('')
  const [loading, setIsLoading] = useState(false)
  const [userDetails, setUserDetails] = useState({ userId: '', userName: '' })

  useEffect(() => {
    setIsLoading(true)
    verifyUser(id?.toString() as string, token?.toString() as string)
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
                  Account Verification{' '}
                  {userDetails.userName && `(${userDetails.userName})`}
                </h1>
                {!err ? (
                  <>
                    <div className="text-l mt-2 inline-flex w-full items-center justify-center px-4 py-2 text-center text-white">
                      <CheckCircleIcon className="header-icon mr-2 h-6 w-6  cursor-pointer" />
                      {'Account Verified Successfully'}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-l mt-2 inline-flex w-full items-center justify-center px-4 py-2 text-center text-red-500">
                      {err}
                    </div>
                  </>
                )}
                <button className="wordly-btn mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2 text-center text-sm font-medium text-white shadow-sm sm:text-base">
                  <Link className="font-medium" to={'/'}>
                    Back to Home
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

export default VerifiedUser
