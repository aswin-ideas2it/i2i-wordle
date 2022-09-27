import { Navigate, Route, Routes } from 'react-router-dom'

import Auth from './Auth'
import ForgotPassword from './components/forgotPassword/ForgotPassword'
import Login from './components/login/Login'
import Register from './components/register/Register'
import ResetPassword from './components/resetPassword/ResetPassword'
import VerifiedUser from './components/verifiedUser/verifiedUser'
import VerifyUser from './components/verifyUser/VerifyUser'

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/password-reset/:id/:token" element={<ResetPassword />} />
      <Route path="/verify/:id" element={<VerifyUser />} />
      <Route path="/verify/:id/:token" element={<VerifiedUser />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default Router
