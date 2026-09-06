import React from 'react'
import TrackOrderPage from '../pages/TrackOrderPage'
import { useNavigate } from 'react-router-dom'


function UserOrderCard({ data }) {

  const navigate = useNavigate()
  const formateDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-GB', {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  }


  return (
    <div className='bg-white rounded-lg p-4 shadow space-y-4 '>
      <div className='flex justify-between border-b pb-2'>
        <div>
          <p className='font-semibold'>
            order #{data._id}
          </p>
          <p className='text-sm text-gray-500'>
            Date :{formateDate(data.createdAt)}
          </p>
        </div>
        <div className='text-right'>
          <p className='text-gray-500 text-sm'>{data.paymentMethod?.toUpperCase()}</p>
          <p className='text-blue-500 text-md'>{data.shopOrders?.[0].status.toUpperCase()}</p>
        </div>
      </div>

      {data.shopOrders?.map((shopOrder, index) => (
        <div className='border rounded-xl p-3 bg-[#fffaf7] space-y-3' key={index}>
          <p>{shopOrder.shop.name}</p>
          <div className='flex overflow-x-auto pb-2 space-x-4'>
            {shopOrder?.shopOrderItems?.map((item, index) => (
              <div key={index} className='text-center shrink-0 rounded-lg border w-40 p-2 bg-white'>
                <img src={item.item.image} alt="" className='w-full h-24 object-cover rounded' />
                <p className='text-sm font-semibold mt-2'>{item.name}</p>
                <p className='text-xs text-gray-500 '>₹{item.price} x {item.quantity}</p>
              </div>
            ))}
          </div>
          <div className='flex justify-between border-t pt-2 items-center'>
            <p className='text-xl text-[#ff4d2d] font-semibold '>Subtotal : ₹{shopOrder.subtotal}</p>
            <p className='font-medium text-sm text-blue-500'>{shopOrder.status}</p>
          </div>
        </div>
      ))}

      <div className='border font-bold'></div>

      <div className='flex items-center justify-between'>
        <div className='text-[#ff4d2d] font-semibold text-2xl'>
          GrandTotal : ₹{data.totalAmount}
        </div>
        <button onClick={()=>navigate(`/track-order/${data._id}`)} className='px-4 py-2 bg-[#ff4d2d] rounded-xl text-white font-semibold hover:scale-105 hover:shadow-3xl shadow-xl duration-300 cursor-pointer'>
          Track Order
        </button>
      </div>

    </div>
  )
}

export default UserOrderCard
