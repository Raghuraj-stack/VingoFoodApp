import React from 'react'
import UserOrderCard from '../components/UserOrderCard'
import OwnerOrderCard from '../components/OwnerOrderCard'
import { useDispatch, useSelector } from 'react-redux';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import { setMyOrders } from '../redux/userSlice';
function MyOrders() {
  const navigate = useNavigate()
  const { userData, myOrders ,socket} = useSelector(state => state.user)
  const dispatch = useDispatch()
  useEffect(() => {
    socket?.on('newOrder' , (data)=>{
      if(data.shopOrders?.owner._id == userData._id)
      {
        dispatch(setMyOrders([data , ...myOrder]))
      }
    })  

    return ()=>{
      socket?.off('newOrder')
    }
  }, [socket])
  
  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex justify-center px-4'>
      <div className='w-full max-w-200 p-4'>
        <div className='items-center flex flex-col gap-5 mb-6'>
          <div className='flex' >
            <div className='z-10 mr-4'>
            <IoMdArrowRoundBack onClick={() => { navigate("/") }} size={35} className='text-[#ff4d2d] cursor-pointer' />
          </div>
          <h1 className='font-bold text-gray-800 text-2xl'>My Order's</h1>
          </div>
          <div className='space-y-6 w-full'>
            {myOrders?.map((order, index) => (
              userData.role == "user" ? (<UserOrderCard data={order} key={index} />) : userData.role == "owner" ? (<OwnerOrderCard data={order} key={index} />) : null
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyOrders
