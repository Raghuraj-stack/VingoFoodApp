import React from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useSelector } from 'react-redux'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { serverUrl } from "../App"
import { setUserData } from '../redux/userSlice.js';
import axios from "axios"
import { FaPlus } from "react-icons/fa";
import { IoReorderFour } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../redux/userSlice.js';
function Nav() {
    const {cartItems} = useSelector(state =>state.user)
    const { userData, currentCity } = useSelector(state => state.user)
    const { shopData } = useSelector(state => state.owner)
    const [showInfo, setShowInfo] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogOut = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
            dispatch(setUserData(null))
        } catch (error) {
            console.log(error)
        }
    }

    return (


        <div className='w-full h-20 flex items-center justify-between md:justify-center gap-7.5 px-5 fixed top-0 z-9999 bg-[#fff9f6] overflow-visible'>

            {showSearch && userData.role == "user" && <div className='w-[90%] h-17.5 bg-white shadow-xl rounded-lg items-center gap-5 flex fixed left-[5%] top-20 md:hidden'>
                <div className='flex items-center w-[30%] overflow-hidden border-r-2 gap-2.5 px-2.5 border-gray-400'>
                    <FaLocationDot size={25} className='text-[#ff4d2d]' />
                    <div className='w-[80%] truncate text-gray-600'>
                        {currentCity}
                    </div>
                </div>
                <div className='w-[80%] flex items-center gap-2.5'>
                    <IoIosSearch size={25} className='text-[#ff4d2d]' />
                    <input type="text" placeholder='Search for Delicious Food...' className='w-full outline-0 px-2.5 text-gray-700' />
                </div>
            </div>
            }


            <h1 className='text-3xl font-bold mb-2 text-[#ff4d2d]'>Vingo</h1>
            {userData.role == "user" && <div className=' w-full max-w-175 h-17.5 bg-white shadow-xl rounded-lg items-center gap-5 hidden md:flex'>
                <div className='flex items-center w-[30%] overflow-hidden border-r-2 gap-2.5 px-2.5 border-gray-400'>
                    <FaLocationDot size={25} className='text-[#ff4d2d]' />
                    <div className='w-[80%] truncate text-gray-600'>
                        {currentCity}
                    </div>
                </div>
                <div className='w-[80%] flex items-center gap-2.5'>
                    <IoIosSearch size={25} className='text-[#ff4d2d]' />
                    <input type="text" placeholder='Search for Delicious Food...' className='w-full outline-0 px-2.5 text-gray-700' />
                </div>
            </div>}

            <div className='flex gap-4 items-center'>
                {userData.role == "user" && (showSearch ? <RxCross2 onClick={() => { setShowSearch(false) }} size={25} className='text-[#ff4d2d] md:hidden' /> : <IoIosSearch size={25} className='text-[#ff4d2d] md:hidden' onClick={() => { setShowSearch(true) }} />)}

                {userData.role == "owner" ? <>
                    {shopData && <><button onClick={() => { navigate("/add-item") }} className='hover:text-white hover:bg-[#ff4d2d] hover:transition duration-300 hidden md:flex items-center gap-2 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]'>
                        <FaPlus size={20} />
                        <span>Add Food Items</span>
                    </button>
                        <button onClick={() => { navigate("/add-item") }} className='hover:text-white hover:bg-[#ff4d2d] hover:transition duration-300 md:hidden flex items-center gap-2 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]'>
                            <FaPlus size={20} />
                        </button>
                    </>}
                    <div>
                        <button onClick={()=>{navigate("my-orders")}} className='hover:text-white hover:bg-[#ff4d2d] hover:transition duration-300 relative hidden md:flex items-center gap-2 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]'>
                            <IoReorderFour size={20} className='font-bold' />
                            <span>Pending Orders</span>
                            <span className='absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-1.5 py-1 '>0</span>
                        </button>
                        <button onClick={()=>{navigate("my-orders")}} className='hover:text-white hover:bg-[#ff4d2d] hover:transition duration-300 relative md:hidden flex items-center gap-2 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]'>
                            <IoReorderFour size={20} className='font-bold' />
                            <span className='absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-1.5 py-1 '>0</span>
                        </button>
                    </div>
                </> : (
                    <>
                        {userData.role == "user" && <div className='relative cursor-pointer hover:scale-105 duration-300'>
                            <FiShoppingCart size={25} onClick={()=>{navigate("/cart")}}  className='text-[#ff4d2d] hover:scale-120 duration-300' />
                            <span className='absolute -right-4 -top-6 text-white bg-[#ff4d2d]  rounded-full px-2 py-1 text-sm'>{cartItems.length}</span>
                        </div>}

                        <button onClick={()=>{navigate("/my-orders")}} className=' hover:scale-110 cursor-pointer duration-300 hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium'
                        >My Orders
                        </button>
                    </>
                )}

                <div onClick={() => { setShowInfo(prev => !prev) }} className='hover:scale-110 duration-300 w-10 h-10 cursor-pointer shadow-lg text-white bg-[#ff4d2d] flex items-center justify-center rounded-full font-semibold'>
                    {userData?.fullname.slice(0, 1)}
                </div>
                {showInfo && <div className={`fixed top-20 right-2.5 ${userData.role == "deliveryBoy" ? "md:right-[10%] lg:right-[30%]" : "md:right-[10%] lg:right-[10%]"} w-45 bg-white shadow-2xl rounded-xl p-5 flex flex-col gap-2.5 z-9999`}>
                    <div className='text-4.25 font-semibold'>{userData.fullname}</div>
                    {userData.role == "user" && <div onClick={()=>{navigate("/my-orders")}} className='text-4.25 text-[#ff4d2d] cursor-pointer font-semibold md:hidden'>My Orders</div>}
                    <div onClick={handleLogOut} className='text-4.25 text-[#ff4d2d] cursor-pointer font-semibold'>Log Out</div></div>}
            </div>
        </div>
    )
}



export default Nav


