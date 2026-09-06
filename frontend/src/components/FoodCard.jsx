import React from 'react'
import { FaLeaf } from "react-icons/fa";
import { FaDrumstickBite } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { FaRegMinusSquare } from "react-icons/fa";
import { FaRegSquarePlus } from "react-icons/fa6";
import { FaCartPlus } from "react-icons/fa6";
import { useState } from 'react';
import { addToCart } from '../redux/userSlice';
import {useDispatch, useSelector} from 'react-redux';
function FoodCard({ data }) {
  const dispatch = useDispatch()
  const [Quantity, setQuantity] = useState(0)
  const {cartItems} = useSelector(state=>state.user)

  const handleIncQuantity = ()=>{
    setQuantity(Quantity + 1)
  }
  const handleDecQuantity = ()=>{
    setQuantity(Quantity>0?Quantity - 1:0)
  }



  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      (i <= rating)?(stars.push(<FaStar className='text-yellow-500 text-lg'/>)):( stars.push(<CiStar className='text-yellow-500 text-lg'/>)) 
    }
    return stars
  }
  return (
    <div className='justify-between items-center w-62.5  min-w-62.5 shrink-0 rounded-xl border-2 border-[#ff4d2d] bg-white shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col mb-4'>
      <div className='w-full h-42.5 relative flex justify-center items-center '>

        <img src={data.image} alt="" className='rounded-xl w-full h-full object-cover transition-transform duration-300 hover:scale-105' />
        {data.foodType == "Veg" && <FaLeaf size={25} className='text-green-500 absolute top-2 right-2  bg-green-100 overflow-hidden backdrop-blur-sm rounded-full p-1' />}
        {data.foodType != "Veg" && <FaDrumstickBite size={25} className='text-red-500 absolute top-2 right-2 bg-red-100 overflow-hidden backdrop-blur-sm rounded-full p-1 ' />}
      </div>
      <div className='flex flex-1 flex-col p-4'>
        <h1 className='font-semibold text-gray-900 text-base truncate'>{data.name}</h1>
        <div className='flex items-center mt-1 gap-1'>
         {renderStars(data.rating?.average || 0)}
         <span className='text-xs text-gray-500'>{data.rating?.count || 0}</span>
        </div>
        <div className='flex items-center justify-between mt-3 gap-5'>
        <span className='text-lg font-bold text-[#ff4d2d] hover:scale-120 duration-300'>
          ₹{data.price}
        </span>

        <div className='flex items-center justify-between gap-2 rounded-full p-1 border px-2'>
          <FaRegMinusSquare className='text-lg font-bold cursor-pointer hover:scale-120 duration-300 hover:shadow-2xl' onClick={handleDecQuantity}/>
          <div className="h-6 w-px bg-gray-400"></div>
          <span className='font-bold text-lg'>{Quantity}</span>
          <div className="h-6 w-px bg-gray-400"></div>
          <FaRegSquarePlus className='text-lg font-bold cursor-pointer hover:scale-120 duration-300 hover:shadow-2xl' onClick={handleIncQuantity}/>
          <div className="h-6 w-px bg-gray-400"></div>
          <button className={`${cartItems.some(i=>i.id == data._id)? "text-gray-800" : "text-[#ff4d2d]"}`} onClick={()=>Quantity>0?dispatch(addToCart({id:data._id,
            name:data.name,
            price:data.price,
            shop:data.shop,
            image:data.image,
            quantity:Quantity,
            foodType:data.foodType})):null}>
            <FaCartPlus className='text-lg font-bold  hover:scale-120 duration-300 cursor-pointer'/>
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}

export default FoodCard
