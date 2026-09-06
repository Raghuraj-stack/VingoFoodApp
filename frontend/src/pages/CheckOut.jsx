import React from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { FaCreditCard } from "react-icons/fa";
import { FaMobileAlt } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { setAddress, setLocation } from "../redux/map.slice";
import "leaflet/dist/leaflet.css"
import { useEffect } from 'react';
import axios from "axios"
import { useState } from 'react';
import { serverUrl } from '../App';
import { addMyOrders} from '../redux/userSlice';

function CheckOut() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { cartItems } = useSelector(state => state.user)
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [coords, setCoords] = useState({
    lat: null,
    lng: null
  })
  const apikey = import.meta.env.VITE_GEOAPIKEY
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = subtotal > 500 ? 0 : 40;

  const totalAmount = subtotal + deliveryFee;

  const { location, Address } = useSelector(state => state.map)
  const onDragEnd = async (e) => {
    const { lat, lng } = e.target.getLatLng();
    dispatch(setLocation({ lat, lng: lng }))
    await getAddressByLatLng(lat, lng);
  }


  const [addressInput, setAddressInput] = useState(Address)

  useEffect(() => {
    setAddressInput(Address)
  }, [Address])


  const getAddressByLatLng = async (lat, lng) => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apikey}`
      );

      const address =
        `${result?.data?.results?.[0]?.address_line1 || ""}, ${result?.data?.results?.[0]?.address_line2 || ""
        }`;

      dispatch(setAddress(address));
    } catch (error) {
      console.log(error);
    }
  };

  function ReCenterMap({ location }) {
    const map = useMap();

    useEffect(() => {
      if (location?.lat && location?.lng) {
        map.flyTo(
          [location.lat, location.lng],
          15,
          {
            animate: true,
            duration: 1.5,
          }
        );
      }
    }, [location, map]);

    return null;
  }

  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          addressInput
        )}&apiKey=${apikey}`
      );

      console.log("FULL RESPONSE:", result.data);

      if (!result.data.features.length) {
        alert("Address not found");
        return;
      }

      console.log("PROPERTIES:", result.data.features[0].properties);

      const { lat, lon } = result.data.features[0].properties;

      setCoords({
        lat,
        lng: lon
      })
      console.log("lat =", lat);
      console.log("lon =", lon);

      dispatch(
        setLocation({
          lat,
          lng: lon,
        })
      );

      dispatch(setAddress(addressInput));
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude
      setCoords({
        lat: latitude,
        lng: longitude
      })
      dispatch(setLocation({ lat: latitude, lng: longitude }))
      getAddressByLatLng(latitude, longitude);
    })

  }

  const handlePlaceOrder = async () => {
    try {
      console.log("Address:", addressInput);
      console.log("Location:", location);
      console.log("Coords:", coords);
      const result = await axios.post(
        `${serverUrl}/api/order/place-order`,
        {
          paymentMethod,
          deliveryAddress: {
            text: addressInput,
            latitude: coords.lat,
            longitude: coords.lng,
          },
          totalAmount,
          cartItems,
        },
        { withCredentials: true }
      );

      
      if(paymentMethod == "cod")
      {
        dispatch(addMyOrders(result.data))
        navigate("/place-order")
      }
      else{
        const orderId = result.data.orderId
        const razorOrder = result.data.razorOrder
        openRazorPayWindow(orderId , razorOrder)
      }
    } catch (error) {
      console.log(error);
      
    }
  };

  const openRazorPayWindow = (orderId , razorOrder) =>{

    const options={
      key:import.meta.env.VITE_RAZOR_PAY_API,
      amount:razorOrder.amount,
      currency:'INR',
      description:"Food Delivery Website",
      order_id:razorOrder.id,
      handler:async function (res){
        try {
          const result = await axios.post(`${serverUrl}/api/order/verify-payment` , {razorpay_payment_id : res.razorpay_payment_id ,
            orderId
          },{withCredentials:true})
          dispatch(addMyOrders(result.data))
          navigate("/place-order")
        } catch (error) {
          console.log(error)
        }
      }
    }


    const rzp = new window.Razorpay(options)
    rzp.open()

  }


  return (
    <div className='w-screen h-screen flex flex-col gap-5 items-center bg-[#fff9f6]'>
      <div className='p-4 mt-10 w-full h-auto max-w-200 bg-[white] rounded-2xl shadow-lg hover:shadow-2xl '>
        <div className='flex gap-4 items-center'>
          <div className='z-10'>
            <IoMdArrowRoundBack onClick={() => { navigate("/cart") }} size={35} className=' text-[#ff4d2d] cursor-pointer' />
          </div>
          <div className='font-bold text-gray-900 text-xl'>
            Checkout
          </div>
        </div>
        <div className='flex gap-1 items-center mt-3'>
          <FaLocationDot className='text-[#ff4d2d]' />
          <p>Delivery Location</p>
        </div>
        <div className='flex items-center justify-between gap-1'>
          <input type="text" value={addressInput} onChange={(e) => setAddressInput(e.target.value)} placeholder='Enter Your Delivery Address' className='mt-1 flex-1 rounded-md border px-2 py-1' />

          <button onClick={getLatLngByAddress}><IoMdSearch size={25} className='cursor-pointer rounded-lg border hover:scale-105 duration-300 transition-all bg-[#ff4d2d] text-white w-9 h-9 flex items-center justify-center' /></button>
          <button onClick={getCurrentLocation}><FaLocationCrosshairs size={25} className='cursor-pointer hover:scale-105 duration-300 transition-all rounded-lg p-1 border bg-[#0091ff] text-white w-9 h-9 flex items-center justify-center' /></button>

        </div>
        <section>
          <div className='rounded-xl overflow-hidden border mt-2'>
            <div className='h-64 w-full flex justify-center items-center'>
              <MapContainer className={"w-full h-full"} center={[
                location?.lat || 24.570892666666662,
                location?.lng || 73.74786633333333
              ]} zoom={13}>

                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ReCenterMap location={location} />
                <Marker position={[location?.lat || 24.570892666666662,
                location?.lng || 73.74786633333333]} draggable eventHandlers={{ dragend: onDragEnd }}>
                  <Popup>
                    Current Location of the user
                  </Popup>
                </Marker>

              </MapContainer>
            </div>
          </div>
        </section>

        <section>
          <h2 className='text-xl font-bold text-gray-900 mt-3'>Payment Method</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3'>

            <div onClick={() => { setPaymentMethod("cod") }} className={`cursor-pointer flex items-center border rounded-xl p-4 gap-3 text-left transition ${paymentMethod === "cod" ? "border-[#ff4d2d] bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
              <span className='h-10 w-10 bg-green-100 rounded-full text-[green] items-center justify-center inline-flex'>
                <MdDeliveryDining className='text-green-600 text-xl' />
              </span>
              <div>
                <p className='font-medium text-gray-800'>Cash On Delivery</p>
                <p className='font-xs text-gray-500'>Pay when your food arrives</p>
              </div>
            </div>

            <div onClick={() => { setPaymentMethod("online") }} className={`cursor-pointer flex items-center border rounded-xl p-4 gap-3 text-left transition ${paymentMethod === "online" ? "border-[#ff4d2d] bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>

              <span className='h-10 w-10 bg-purple-100 rounded-full text-[purple] items-center justify-center inline-flex'>
                <FaMobileAlt className='text-purple-600 text-xl' />
              </span>
              <span className='h-10 w-10 bg-blue-100 rounded-full text-[blue] items-center justify-center inline-flex'>
                <FaCreditCard className='text-blue-600 text-xl' />
              </span>
              <div>
                <p className='font-medium text-gray-800'>UPI / Credit /Debit Card</p>
                <p className='font-xs text-gray-500'>Pay securely online</p>
              </div>
            </div>

          </div>
        </section>

        <section>
          <h2 className='font-bold text-xl text-gray-900 mb-3 mt-3'>Order Summary</h2>
          <div className='rounded-xl border bg-gray-50 border-gray-500 p-4 space-y-2'>
            {cartItems.map((item, index) => (
              <div className='bg-gray-200 rounded-xl p-2 flex items-center gap-3 justify-between'>

                <span className='flex items-center justify-center'>
                  <img src={item.image} alt="Image" className='w-20 h-20 object-cover rounded-xl' />
                  <span className='ml-3'>
                    <div className='text-xl font-semibold text-gray-800 truncate'>
                      {item.name}
                    </div>
                    <p className='text-md text-gray-500 '>{item.quantity} x {item.price}</p>
                  </span>
                </span>

                <div className='mr-3'>
                  ₹{item.quantity * item.price}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className='bg-gray-200 w-auto h-auto mt-3 p-3 rounded-xl flex items-center justify-between'>
            <div>
              <div className='font-semibold text-gray-800'>Subtotal</div>
              <div className='text-gray-600'>Delivery Fee</div>
              <div className='text-[#ff4d2d] font-bold'>Total</div>
            </div>
            <div className='text-right'>
              <div className='font-semibold text-gray-800'>₹{subtotal}</div>
              <div className='text-gray-600'>₹{deliveryFee}</div>
              <div className='text-[#ff4d2d] font-bold'>₹{totalAmount}</div>
            </div>
          </div>
        </section>

        <section className='flex items-center justify-center pt-3'>
          <button onClick={handlePlaceOrder} className='cursor-pointer hover:shadow-2xl hover:bg-[#fd2803] bg-[#ff4d2d] rounded-xl w-full h-10 text-white font-semibold'>
            Place Order
          </button>
        </section>
      </div>
    </div>
  )
}

export default CheckOut





