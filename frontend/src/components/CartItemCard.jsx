import React from 'react'
import { HiMinusSmall } from "react-icons/hi2";
import { HiPlusSmall } from "react-icons/hi2";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { removeCartItems, updateQuantity } from '../redux/userSlice';


function CartItemCard({data}) {
  const dispatch = useDispatch()


  const handleIncrease = (id , currentQuantity)=>{
     dispatch(updateQuantity({id , quantity : currentQuantity + 1}))
      
    }

    const handleDecrease = (id , currentQuantity)=>{
      dispatch(updateQuantity({id , quantity : currentQuantity>1? currentQuantity - 1 : currentQuantity}))
       
    }

    const handleDeleteItems = (id)=>{
      dispatch(removeCartItems({id}))
  
    }
    
  return (

    <div className='flex justify-between items-center m-4 rounded-xl border shadow-xl p-4 hover:shadow-2xl'>
      <div className='flex items-center gap-4'>
        <img src={data.image} alt="Image" className='w-20 h-20 object-cover rounded-xl border'/>
        <span>
            <h1 className='font-bold text-md'>{data.name}</h1>
        {data.quantity > 0 && <p className='text-gray-500 text-sm'>₹{data.price} x {data.quantity} </p>}
        <h1 className='font-bold text-lg'>₹{data.price * data.quantity}</h1>
        </span>
      </div>

      <div className='flex items-center justify-between gap-2'>
        <button> <HiMinusSmall size={25} className='bg-gray-300 rounded-full p-1 cursor-pointer hover:text-white hover:bg-[red] hover:transition-all duration-200' onClick={()=>handleDecrease(data.id , data.quantity)}/></button>
        <p className='font-semibold'>{data.quantity}</p>
        <button><HiPlusSmall size={25} className='bg-gray-300 rounded-full p-1 cursor-pointer hover:text-white hover:bg-[green] hover:transition-all duration-300' onClick={()=>handleIncrease(data.id , data.quantity)}/></button>
        <button><RiDeleteBin6Line size={25} className='bg-[#ff4d2d]/10 text-[#ff4d2d] rounded-full p-1 cursor-pointer hover:text-white hover:bg-[red] hover:transition-all duration-200' onClick={()=>handleDeleteItems(data.id)}/></button>
      </div>
    </div>

  )
}

export default CartItemCard
