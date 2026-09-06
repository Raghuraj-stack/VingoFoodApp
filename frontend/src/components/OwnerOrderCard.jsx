import React, { useState } from 'react'
import { FaPhone } from "react-icons/fa6";
import { serverUrl } from "../App.jsx"
import axios from "axios"
import { MdLocationPin } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../redux/userSlice.js';
import { GiScooter } from "react-icons/gi";
function OwnerOrderCard({ data }) {
  const [availableBoys, setAvailableBoys] = useState(
    data.availableDeliveryBoys || []
  ); const dispatch = useDispatch()
  const handleUpdateStatus = async (orderId, shopId, status) => {
    try {
      const result = await axios.post(`${serverUrl}/api/order/update-status/${orderId}/${shopId}`, { status }, { withCredentials: true })
      console.log(result.data)
      dispatch(updateOrderStatus({ orderId, shopId, status }))
      setAvailableBoys(result.data.availableDeliveryBoys)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='bg-white rounded-xl shadow-xl p-4  space-y-4'>
      <div>
        <h2 className='font-semibold text-gray-800'>{data.user.fullname}</h2>
        <p className='text-md text-gray-500'>{data.user.email}</p>
        <span className='font-lg text-gray-800 flex items-center gap-2 mb-4'><FaPhone />{data.user.mobile}</span>

        <div className='text-gray-500 text-lg flex items-center gap-2 mb-1' ><MdLocationPin size={20} className='text-gray-800' />
          <span>{data?.deliveryAddress.text.toUpperCase()}</span>
        </div>
        <div className='text-[#ff4d2d] text-md font-semibold'>
          Lat : {data?.deliveryAddress.latitude} , Lon : {data?.deliveryAddress.longitude}
        </div>
      </div>

      <div className='flex overflow-x-auto pb-2 space-x-4'>
        {data.shopOrders.shopOrderItems.map((item, index) => (
          <div key={index} className='text-center shrink-0 rounded-lg border w-40 p-2 bg-white'>
            <img src={item.item.image} alt="" className='w-full h-24 object-cover rounded' />
            <p className='text-sm font-semibold mt-2'>{item.name}</p>
            <p className='text-xs text-gray-500 '>₹{item.price} x {item.quantity}</p>
          </div>
        ))}
      </div>

      <div className='flex justify-between items-center mt-auto pt-3 border-t border-gray-300'>
        <span>Current Status : {data.shopOrders.status}</span>
        <select
          defaultValue=""
          onChange={(e) => {
            if (!e.target.value) return;

            handleUpdateStatus(
              data._id,
              data.shopOrders.shop._id,
              e.target.value
            );
          }}
          className="rounded-xl px-4 py-2 border text-sm focus:outline-none focus:ring-2 bg-[#ff4d2d] text-white"
        >
          <option value="" disabled>
            Change
          </option>

          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="out for delivery">
            Out for Delivery
          </option>

        </select>
      </div>

      {data.shopOrders.status == "out for delivery" &&
        <div className='mt-3 p-2 border rounded-lg text-sm bg-orange-50 gap-4'>
         {data.shopOrders.assignedDeliveryBoy ? <p>Assigned Delivery boy :-</p> : <p>Availbale Delivery Boys :-</p>}
          {availableBoys?.length > 0 ? (
            availableBoys.map((b, index) => (
              <div className='text-gray-800 font-semibold text-lg'><GiScooter /> {b.fullname} - {b.mobile}</div>
            ))
          ) : data.shopOrders.assignedDeliveryBoy ? 
          (<> 
            <div className='text-green-600 font-semibold text-lg'><GiScooter size={25} className='text-black'/>{data.shopOrders.assignedDeliveryBoy.fullname.toUpperCase(1)}</div>
            <div className='text-green-600 font-semibold text-lg'>{data.shopOrders.assignedDeliveryBoy.mobile}</div>
            </>
        )
           :(
            <div>Waiting for delivery boys to get accept</div>
          )}
        </div>
      }

      <div className='text-lg text-[#ff4d2d] font-semibold border-t border-gray-300'>
        Total : ₹{data.shopOrders.subtotal}
      </div>
    </div>
  )
}

export default OwnerOrderCard
