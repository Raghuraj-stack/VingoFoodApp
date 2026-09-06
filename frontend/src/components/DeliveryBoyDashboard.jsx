import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import { serverUrl } from '../App'
import axios from 'axios'
import DeliveryBoyTracking from './DeliveryBoyTracking'


function DeliveryBoyDashboard() {
  const { userData } = useSelector(state => state.user);
  const [deliveryAssignment, setDeliveryAssignment] = useState(null)
  const [currentOrders, setCurrentOrders] = useState()
  const [orders, setOrders] = useState([]);
 const [showOtpBox, setShowOtpBox] = useState(false)
  const handleDeliveryBoyAssignment = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-delivery-orders`,
        { withCredentials: true }
      );
      setDeliveryAssignment(result.data)
      console.log(result.data);
      setOrders(result.data);

    } catch (error) {
      console.log(error);
    }
  };

  const handleGetCurrentOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/current-order`,
        { withCredentials: true }
      );
      setCurrentOrders(result.data)
      console.log(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (userData) {
      handleDeliveryBoyAssignment();
      handleGetCurrentOrder()
    }
  }, [userData]);


  const handleAcceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/accept-order/${assignmentId}`,
        { withCredentials: true }
      );
      await handleGetCurrentOrder()
      console.log(result.data)
    } catch (error) {
      console.log(error)
    }
  }


  const handleSendOtp = (e) =>{
    try {
      setShowOtpBox(true)
    } catch (error) {
      
    }
  }


  return (
    <div className='w-screen min-h-full flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
      <Nav />

      <div className='bg-white shadow-xl hover:scale-105 duration-300 w-[70%] border border-orange-100 rounded-2xl text-[#ff4d2d] flex items-center justify-center flex-col  p-5'>
        <h1 className='font-bold text-3xl'>Welcome , {userData?.fullname}</h1>
        <p className='mt-2'><span className='font-semibold'>Latitude</span> : {userData?.location?.coordinates[0]} , <span className='font-semibold'>Longitude</span> : {userData?.location?.coordinates[1]}</p>
      </div>

      {!currentOrders &&
        <div className='bg-white shadow-xl hover:scale-105 duration-300 w-[70%] border border-orange-100 rounded-2xl text-[#ff4d2d] flex items-center justify-center flex-col  p-5'>
          <p className='text-gray-800 text-lg mb-4 flex items-center gap-2 font-bold'>Available Orders</p>
          <div className='space-y-4'>
            {deliveryAssignment?.length > 0 ?
              (deliveryAssignment.map((a, index) => (
                <div key={index} className='p-4 border border-gray-800 w-full rounded-xl flex items-center text-gray-700 justify-between gap-9'>
                  <div><div className='font-bold text-gray-800'>{a.shopName}</div>
                    <div className='text-md text-gray-800 whitespace-pre-line'>DeliveryAddress : {a.deliveryAddress?.text}</div>
                    <div>{a.items?.length} items | ₹{a.subtotal}</div></div>
                  <div>
                    <button onClick={() => handleAcceptOrder(a.assignmentId)} className='bg-[#ff4d2d] px-4 py-1 rounded-xl text-white cursor-pointer text-semibold hover:scale-105 duration-300 hover:transition'>Accept</button>
                  </div>
                </div>

              )))
              :
              (<div><p className='text-gray-500 text-lg mb-4 flex items-center gap-2 font-semibold '>No Available Items</p></div>)}
          </div>
        </div>
      }
      {currentOrders &&
        <div className='bg-white shadow-xl sd:w-[70%] md:w-[50%] border border-orange-100 rounded-2xl text-[#ff4d2d] flex items-center justify-center flex-col  p-5'>
          <h2 className='text-xl font-bold text-gray-800 mb-3'>📦Current Order</h2>
          <div className='border border-gray-500 rounded-3xl p-3'>
            <p className='text-md font-bold'>{currentOrders?.shopOrder?.shop?.name}</p>
            <div className='text-md text-gray-500 whitespace-pre-line'>DeliveryAddress : {currentOrders.deliveryAddress.text}</div>
            <div className='text-md font-semibold'>{currentOrders?.shopOrder?.shopOrderItems?.length} items | ₹{currentOrders.shopOrder.subtotal}</div>
          </div>

          <DeliveryBoyTracking data={currentOrders}/>

        {!showOtpBox ? <button className='mt-5 bg-[#3da700] text-white font-semibold w-full py-2 rounded-xl cursor-pointer ' onClick={handleSendOtp}>Mark As Delivered</button>:
        <div className=' mt-4 p-4 border rounded-xl bg-gray-50 border-gray-600'>
          <p className='text-gray-700 font-semibold'>Enter Otp sent to <span className='font-bold text-[#ff4d2d]'>{currentOrders.user.fullname}</span></p>
          <input type="text"  className=' mt-2 w-full border px-3 py-2 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-orange-400' placeholder='Enter otp'/>
          <button className='bg-[#ff4d2d] hover:bg-gray-500 hover:text-white text-white font-semibold w-full py-2 rounded-xl cursor-pointer '>Submit</button>
        </div>
        }
        </div>
      }
    </div >
  )
}

export default DeliveryBoyDashboard
