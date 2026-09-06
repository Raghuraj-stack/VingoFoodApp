import React, { useEffect, useState } from 'react'
import axios from "axios"
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../App.jsx';
import { IoMdArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from '../components/DeliveryBoyTracking.jsx';
function TrackOrderPage() {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const [currentOrder, setCurrentOrder] = useState()
  const handleGetOrderById = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`, { withCredentials: true })
      setCurrentOrder(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleGetOrderById()
  }, [orderId])

  return (
    <div className='max-w-4xl mx-auto p-4 flex flex-col gap-6'>
      <div className='relative flex items-center gap-4 top-5 left-5 z-10 mb-5'>
        <IoMdArrowRoundBack onClick={() => { navigate("/my-orders") }} size={35} className='text-[#ff4d2d] cursor-pointer' />
        <h1 className='font-bold text-xl md:text-center'>Track Order</h1>
      </div>
      {currentOrder?.shopOrders?.map((shopOrder, index) => (
        <div key={index} className='bg-white p-4 rounded-2xl shadow-md border border-orange-100 space-y-4'>
          <div>
            <p className='text-xl font-bold text-[#ff4d2d] mb-2'>{shopOrder.shop.name}</p>
            <p className='text-lg text-gray-800 font-bold'><span className='text-lg text-gray-800 font-semibold'>Items : </span>{shopOrder?.shopOrderItems?.map(i => i.name)}</p>
            <p className='text-lg text-gray-800 font-bold'><span className='text-lg text-gray-800 font-semibold'>Subtotal : </span>
              {shopOrder.subtotal}
            </p>
            <p className='text-lg text-gray-800 font-bold'><span className='text-lg text-gray-800 font-semibold'>Delivery Address : </span>
              {currentOrder.deliveryAddress?.text}
            </p>
          </div>
          {shopOrder.status != "delivered" ?
            <>
              {shopOrder.assignedDeliveryBoy ?
                <div>
                  <p className='text-gray-800 text-md font-semibold'>Delivery Boy Name : {shopOrder.assignedDeliveryBoy.fullname}</p>
                  <p className='text-gray-800 text-md font-semibold'>Mobile : {shopOrder.assignedDeliveryBoy.mobile}</p>
                </div> :
                <p className='text-2xl font-nold text-[#ff0000]'>DeliveryBoy not assigned yet</p>
              }
            </>
            :
            <p className='text-2xl font-nold text-[#00ff2a]'>Delivered</p>
          }

          {shopOrder.assignedDeliveryBoy && <div className='h-full w-full rounded-2xl overflow-hidden shadow-md'>
          <DeliveryBoyTracking data={{
            deliveryBoyLocation:{lat:shopOrder?.assignedDeliveryBoy?.location?.coordinates[1],
              lon:shopOrder?.assignedDeliveryBoy?.location?.coordinates[0]
            },
            customerLocation:{lat:currentOrder.deliveryAddress.latitude,
              lon:currentOrder.deliveryAddress.longitude
            }
          }}/>
          </div>}
        </div>
      ))}

    </div>
  )

}

export default TrackOrderPage
