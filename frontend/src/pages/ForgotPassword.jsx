import React from 'react'
import { useState } from 'react'
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { serverUrl } from "../App.jsx"
import { ClipLoader } from "react-spinners"
const ForgotPassword = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSendOtp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/send-otp`, {
        email
      }, {
        withCredentials: true
      })
      console.log(result)
      setErr("")
      setLoading(false)
      setStep(2)

    } catch (error) {
      setErr(error?.response?.data?.message)
      setLoading(false)
    }
  }


  const handleVerifyOtp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/verify-otp`, {
        email, otp
      }, {
        withCredentials: true
      })
      console.log(result)
      setErr("")
      setLoading(false)
      setStep(3)

    } catch (error) {
      setErr(error?.response?.data?.message)
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    
    if (newPassword != confirmPassword) {
      return null
    }
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/reset-password`, {
        email, newPassword
      }, {
        withCredentials: true
      })
      console.log(result)
      setErr("")
      setLoading(false)
      navigate("/signin")
    } catch (error) {
      setErr(error?.response?.data?.message)
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center w-full min-h-screen p-4 bg-[#fff9f6]'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-lg p-8'>
        <div className='flex items-center gap-4 mb-6'>
          <IoArrowBack onClick={() => { navigate("/signin") }} size={20} className='text-[#ff4d2d] rounded-full cursor-pointer' />
          <h1 className='font-bold text-2xl text-center text-[#ff4d2d]'>Forgot Password</h1>
        </div>
        {step == 1 && <div>
          {/*email*/}
          <div className='mb-4'>
            <label htmlFor="email" className='block text-grey-700 font-medium mb-1'>Email</label>
            <input type="email" onChange={(e) => { setEmail(e.target.value) }} value={email} className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter Your Email' style={{ border: '1px solid ${boarderColor' }} required />
          </div>
          <button onClick={handleSendOtp} className={`cursor-pointer w-full mt-4 font-semibold rounded-lg py-2 transiion duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323]`}>Send Otp</button>
         {err && <p className='text-red-500 text-center'>*{err}</p>}

        </div>
        }

        {step == 2 && <div>
          {/*enter otp */}
          <div className='mb-4'>
            <label htmlFor="OTP" className='block text-grey-700 font-medium mb-1'>Enter OTP</label>
            <input type="text" onChange={(e) => { setOtp(e.target.value) }} value={otp} className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter OTP' style={{ border: '1px solid ${boarderColor' }} required />
          </div>
          <button onClick={handleVerifyOtp} className={`cursor-pointer w-full mt-4 font-semibold rounded-lg py-2 transiion duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323]`}>Verify</button>
          {err && <p className='text-red-500 text-center'>*{err}</p>}

        </div>
        }

        {step == 3 && <div>
          {/*reset password */}
          <div className='mb-4'>
            <label htmlFor="newPassword" className='block text-grey-700 font-medium mb-1'>Enter newPassword</label>
            <input type="text" onChange={(e) => { setNewPassword(e.target.value) }} value={newPassword} className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter New Password' style={{ border: '1px solid ${boarderColor' }} required />
          </div>
          <div className='mb-4'>
            <label htmlFor="confirmPassword" className='block text-grey-700 font-medium mb-1'>Confirm Password</label>
            <input type="text" onChange={(e) => { setConfirmPassword(e.target.value) }} value={confirmPassword} className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Confirm Password' style={{ border: '1px solid ${boarderColor' }} required />
          </div>
          <button onClick={handleResetPassword} className={`cursor-pointer w-full mt-4 font-semibold rounded-lg py-2 transiion duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323]`}disabled={loading}  >{loading?<ClipLoader color='white' size={20}/>:ResetPassword} Reset Password</button>
          {err && <p className='text-red-500 text-center'>*{err}</p>}

        </div>
        }

      </div>
    </div>
  )
}

export default ForgotPassword
