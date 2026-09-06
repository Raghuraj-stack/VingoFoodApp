import React from 'react'
import { useState } from 'react'
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios"
import { serverUrl } from '../App.jsx';
import { auth } from "../../firebase.js";
import { ClipLoader } from "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';
const SignUp = () => {
  const primaryColor = "#ff4d2d"
  const hoverColor = "#e64323"
  const bgColor = "#fff9f6"
  const boarderColor = "#ddd"
  const [showPassword, setshowPassword] = useState(false)
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mobile, setMobile] = useState("")
  const [role, setrole] = useState("user")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleSignUp =async ()=>{
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signup` , {
        fullname , email , password , mobile,role
      } , {withCredentials:true})
     dispatch(setUserData(result.data))
      setLoading(false)
    } catch (error) {
        setErr(error.response.data.message)
        setLoading(false)
    }
  }

  const handleGoogleAuth = async ()=>{
    if(!mobile)
    {
      return setErr("Mobile No. required")
    }

    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth , provider)
    try {
      const {data} = await axios.post(`${serverUrl}/api/auth/google-auth` , {
        fullname:result.user.displayName ,
        email:result.user.email,
        role ,
        mobile
      } , {withCredentials:true})
      dispatch(setUserData(data))
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className='min-h-screen w-full flex justify-center items-center overflow-hidden ' style={{ backgroundColor: bgColor }}>
      <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-6 boarder-[1px] ' style={{ border: `1px solid ${boarderColor}` }}>
        <h1 className='text-3xl font-bold mb-2' style={{ color: primaryColor }}>Vingo</h1>
        <p className='text-grey-600 mb-1'>Create your account to get started with delicious food deliveries</p>

        {/*fullname*/}
        <div className='mb-1'>
          <label htmlFor="fullname" className='block text-grey-700 font-medium mb-1'>Full Name</label>
          <input type="text" onChange={(e)=>{setFullname(e.target.value)}} className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter Your Full Name' style={{ border: '1px solid ${boarderColor'}} required />
        </div>
        {/*email*/}
        <div className='mb-1'>
          <label htmlFor="email" className='block text-grey-700 font-medium mb-1'>Email</label>
          <input type="email" onChange={(e)=>{setEmail(e.target.value)}} className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter Your Email' style={{ border: '1px solid ${boarderColor' }} required/>
        </div>
        {/*Mobile*/}
        <div className='mb-1'>
          <label htmlFor="Mobile" className='block text-grey-700 font-medium mb-1'>Mobile No.</label>
          <input type="text" onChange={(e)=>{setMobile(e.target.value)}} className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter Your Mobile No.' style={{ border: '1px solid ${boarderColor' }} required/>
        </div>
        {/*password*/}
        <div className='mb-1'>
          <label htmlFor="password" className='block text-grey-700 font-medium mb-1'>Password</label>
          <div className='relative'>
            <input type={`${showPassword ? "text" : "password"}`} onChange={(e)=>{setPassword(e.target.value)}}className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter Your Password' style={{ border: '1px solid ${boarderColor' }}required />
            <button onClick={() => setshowPassword(prev => !prev)} className='absolute cursor-pointer right-3 top-3.5 text-grey-500'>{!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</button>
          </div>
        </div>
        {/*role*/}
        <div className='mb-4'>
          <label htmlFor="role" className='block text-grey-700 font-medium mb-1'>Role</label>
          <div className='relative flex gap-2'>
            {["user", "owner", "deliveryBoy"].map((r) => (
              <button className='cursor-pointer flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors'
                onClick={() => { setrole(r) }}
                style={
                  role == r ? { backgroundColor: primaryColor, color: "white" } : { border: `1px solid ${primaryColor}`, color: primaryColor }
                }>{r}</button>
            ))}
          </div>
        </div>
        <button className={`cursor-pointer w-full font-semibold rounded-lg py-2 transiion duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323]`} onClick={handleSignUp} disabled={loading} > {loading?<ClipLoader  color='white' size={20}/>:"SignUp"}</button>
           {err && <p className='text-red-500 text-center'>*{err}</p>}

        <button  onClick={handleGoogleAuth} className='w-full mt-2 flex items-center justify-center gap-2 border rounded-lg mb-2 px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-200'>
            <FcGoogle size={20}/>
            <span>Sign up with Google</span>
        </button>
        <p onClick={()=>{navigate("/signin")}} className='text-center cursor-pointer'>Already have an Account ? <span className='text-[#ff4d2d]'>SignIn</span></p>
      </div>
    </div>
  )
}

export default SignUp
