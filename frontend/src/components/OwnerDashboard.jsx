import React from 'react'
import Nav from './Nav.jsx'
import { useSelector } from 'react-redux'
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { MdEdit } from "react-icons/md";
import OwnerItemCard from './OwnerItemCard.jsx';

function OwnerDashboard() {
  const { shopData } = useSelector(state => state.owner)
  const navigate = useNavigate()
  return (
    <div className='w-full min-h-full bg-[#fff9f6] flex flex-col items-center'>
      <Nav />
      {!shopData &&
        <div className='flex items-center justify-center p-4 sm:p-6 '>
          <div className='w-full max-w-md bg-white shadow-lg rounded-2xl  p-6 border border-gray-100 hover:shadow-xl transition-shadow duration:300'>
            <div className='flex flex-col items-center text-center'>
              <FaUtensils className='text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4' />
              <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-2'>Add Your Restaurant</h2>
              <p className='text-gray-600 mb-4 text-sm sm:text-base'>Join our food delivery platform and reach thousands of hungry customers everyday</p>
              <button onClick={() => { navigate("/create-edit-shop") }} className='flex items-center justify-center px-4 py-2 sm-px-6 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200 cursor-pointer bg-[#ff4d2d] text-white'>Get Started</button>
            </div>
          </div>
        </div>
      }

      {shopData &&
        <div className='flex flex-col w-full items-center gap-6 px-4 sm:px-6'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 flex mx-8 gap-3 items-center'><FaUtensils className='text-[#ff4d2d] w-14 h-14 ' /> Welcome to {shopData.name}</h1>

          <div className='bg-white shadow-lg rounded-xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300 w-full max-w-3xl relative'>

            <div onClick={()=>{navigate("/create-edit-shop")}} className='absolute cursor-pointer bg-[#ff4d2d] top-4 right-4 text-white p-2 rounded-full shadow-lg hover:bg-orange-800 transition-color duration-300'>
            <MdEdit size={20}/>
            </div>

            <img src={shopData.image} className='w-full h-48 sm:h-64 rounded-xl object-center' alt="" />
            <div className='p-4 sm:p-6'>
              <h1 className='text-xl sm:text-2xl text-gray-800 font-bold'>{shopData.name}</h1>
              <p className='text-gray-500 '>{shopData.city} , {shopData.state}</p>
              <p className='text-gray-500 mb-4 ' >{shopData.address}</p>
            </div>

          </div>

        </div>}

        {shopData?.items?.length == 0 &&
        <div className='flex items-center justify-center p-4 sm:p-6 '>
          <div className='w-full max-w-md bg-white shadow-lg rounded-2xl  p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration:300'>
            <div className='flex flex-col items-center text-center'>
              <FaUtensils className='text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4' />
              <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-2'>Add Your Food Items</h2>
              <p className='text-gray-600 mb-4 text-sm sm:text-base'>Add your delicious creations with our customers  </p>
              <button onClick={() => { navigate("/add-item") }} className='flex items-center justify-center px-4 py-2 sm-px-6 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200 cursor-pointer bg-[#ff4d2d] text-white'>Add Food</button>
            </div>
          </div>
        </div>
        }
        {shopData?.items?.length > 0 && 
        <div className='flex flex-col items-center gap-4 w-full max-w-3xl '>
          {shopData.items.map((item , index)=>(
            <OwnerItemCard data={item} key={index}/>
          ))}
        </div>
        }
    </div>
  )
}

export default OwnerDashboard
