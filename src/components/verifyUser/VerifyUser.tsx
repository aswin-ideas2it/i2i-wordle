import { useEffect, useState } from 'react'
import Div100vh from 'react-div-100vh'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import { useAlert } from '../../context/AlertContext'
import { getVerificationDetail, sendVerificationLink } from '../../lib/user'
import Header from '../header/Header'
import Loader from '../loader'

const errorMsg = {
  unf: `User not found`,
}

const VerifyUser = () => {
  const { showError: showErrorAlert } = useAlert()
  let { id } = useParams()
  const [ismailSent, setIsMailSent] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [userDetails, setUserDetails] = useState({ userId: '', userName: '' })

  useEffect(() => {
    setIsLoading(true)
    getVerificationDetail(id?.toString() as string)
      .then((response: any) => {
        if (response === 'UNF') {
          showErrorAlert(errorMsg.unf)
        } else {
          setUserDetails(response)
        }
        setIsLoading(false)
      })
      .catch((e: any) => {
        setIsLoading(false)
        const errorMsg = e.message || e
        console.log(errorMsg)
        showErrorAlert(errorMsg.toString())
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onResetBtnClick = async () => {
    try {
      setIsLoading(true)
      await sendVerificationLink(userDetails.userId)
      setIsMailSent(true)
      setIsLoading(false)
    } catch (e: any) {
      setIsLoading(false)
      const errorMsg = e.message || e
      console.log(errorMsg)
      showErrorAlert(errorMsg.toString())
    }
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
                {!ismailSent ? (
                  <>
                    <div className="text-white ">
                      Hi {userDetails.userName}, Please verify your account
                    </div>
                    <button
                      onClick={() => onResetBtnClick()}
                      className="wordly-btn mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2 text-center text-sm font-medium text-white shadow-sm sm:text-base"
                    >
                      Resend Verification Link
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-l mt-2 inline-flex items-center justify-center px-4 py-2 text-center text-white ">
                      A Verification link has been emailed to you. 
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

export default VerifyUser
