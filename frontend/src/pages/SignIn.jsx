import React from 'react'
import { useState } from 'react'
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { serverUrl } from '../App.jsx';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase.js';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';
const SignIn = () => {
  const primaryColor = "#ff4d2d"
  const hoverColor = "#e64323"
  const bgColor = "#fff9f6"
  const boarderColor = "#ddd"
  const [showPassword, setshowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")
   const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const handleSignIn =async ()=>{
    setLoading(true)
    try { 
      const result = await axios.post(`${serverUrl}/api/auth/signin` , {
       email , password
      } , {withCredentials:true})
       dispatch(setUserData(result.data))
      setErr("")
      setLoading(false)
    } catch (error) {
        setErr(error.response.data.message)
    }
  }



   const handleGoogleAuth = async ()=>{
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth , provider)
    try {
      const {data} = await axios.post(`${serverUrl}/api/auth/google-auth` , {
        email:result.user.email
      } , {withCredentials:true})
      dispatch(setUserData(data))
      setErr("")
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className='min-h-screen w-full flex justify-center items-center overflow-hidden ' style={{ backgroundColor: bgColor }}>
      <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-6 boarder-[1px] ' style={{ border: `1px solid ${boarderColor}` }}>
        <h1 className='text-3xl font-bold mb-4' style={{ color: primaryColor }}>Vingo</h1>
        <p className='text-grey-600 mb-4'>Login to get started with delicious food deliveries</p>

       
        {/*email*/}
        <div className='mb-4'>
          <label htmlFor="email" className='block text-grey-700 font-medium mb-1'>Email</label>
          <input  type="email" onChange={(e)=>{setEmail(e.target.value)}} className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter Your Email' style={{ border: '1px solid ${boarderColor' }} required  />
        </div>
        
        {/*password*/}
        <div className='mb-2'>
          <label htmlFor="password" className='block text-grey-700 font-medium mb-1'>Password</label>
          <div className='relative'>
            <input   type={`${showPassword ? "text" : "password"}`} onChange={(e)=>{setPassword(e.target.value)}}className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter Your Password' style={{ border: '1px solid ${boarderColor' }} required/>
            <button onClick={() => setshowPassword(prev => !prev)} className='absolute cursor-pointer right-3 top-3.5 text-grey-500'>{!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</button>
          </div>
        </div>
        <div className='cursor-pointer text-right mb-1 text-[#ff4d2d] font-medium' onClick={()=>{navigate("/forgot-password")}} >
          Forgot Password
        </div>
        <button  className={`cursor-pointer w-full mt-4 font-semibold rounded-lg py-2 transiion duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323]`} onClick={handleSignIn}disabled={loading} > {loading?<ClipLoader  color='white' size={20}/>:"SignIn"}</button>
         {err && <p className='text-red-500 text-center'>*{err}</p>}
        <button onClick={handleGoogleAuth}  className='w-full mt-4 flex items-center justify-center gap-2 border rounded-lg mb-4 px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-200'>
            <FcGoogle size={20}/>
            <span>Sign In with Google</span>
        </button>
        <p onClick={()=>{navigate("/signup")}} className='text-center cursor-pointer'>Want to create a new Account ? <span className='text-[#ff4d2d]'>SignUp</span></p>
      </div>
    </div>
  )
}

export default SignIn
