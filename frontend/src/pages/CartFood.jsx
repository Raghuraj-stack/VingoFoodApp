import React from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux';
import CartItemCard from '../components/CartItemCard';


function CartFood() {
    const navigate = useNavigate()

    const { cartItems } = useSelector(state => state.user)

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )
    return (

        <div className='min-h-screen bg-[#fff9f6] flex justify-center p-6'>
            <div className='w-full max-w-200'>
                <div className='items-center flex gap-5 mc-5'>
                    <div className='z-10'>
                        <IoMdArrowRoundBack onClick={() => { navigate("/") }} size={35} className=' text-[#ff4d2d] cursor-pointer' />
                    </div>
                    <h1 className='font-bold text-gray-800 text-2xl'>Your Cart</h1>
                </div>
                {cartItems?.length == 0 ? (<p className='font-bold text-gray-500 text-lg '>Cart is Empty</p>) : (
                    <div>
                        {cartItems?.map((item, index) => (
                            <CartItemCard data={item} key={index} />
                        ))}
                    </div>
                )}
                {cartItems.length > 0 &&
                    <>
                        <div className='flex justify-between items-center m-4 rounded-xl border shadow-xl p-4 hover:shadow-2xl'>
                            <h1 className='font-bold text-lg'>Total Amount</h1>
                            <h1 className='font-bold text-xl text-[#ff4d2d]'>₹{totalAmount}</h1>
                        </div>
                        <div className='flex justify-end pr-4'>
                            <button onClick={()=>{navigate("/checkOut")}} className='w-40 h-10 bg-[#ff4d2d] rounded-lg flex items-center justify-between pl-3 hover:scale-105 cursor-pointer  hover:text-white hover:bg-[green] hover:transition-all duration-300'>
                                <h1 className='text-white font-semibold text-sm '>Proceed to CheckOut</h1>
                            </button>
                        </div>
                    </>
                }

            </div>

        </div>
    )
}

export default CartFood
