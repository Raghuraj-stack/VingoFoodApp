import React from 'react'
import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
function OrderPlaced() {
    const Navigate = useNavigate()
    return (
        <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center px-4 text-center flex-col overflow-hidden relative '>
            <div><FaCircleCheck className='text-green-500 text-8xl mb-4' /></div>
            <h1 className='font-bold text-gray-900 text-5xl mb-4'>Order Placed!</h1>
            <p className='text-gray-700 text-lg'>Thank You for your purchase. Your order is being prepared.</p>
            <p className='text-gray-700 text-lg mb-7'>You can track your order status in "My Order's" section</p>
            <button onClick={()=>{Navigate("/my-orders")}} className='text-white bg-[#ff4d2d] p-3 rounded-xl font-semibold shadow-xl cursor-pointer hover:scale-105 duration-300 hover:shadow-2xl'>
                Back To My Order's
            </button>
        </div>
    )
}

export default OrderPlaced
