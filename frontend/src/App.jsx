import React, { useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword.jsx'
import useCurrentUser from './hooks/useCurrentUser.jsx'
import { useDispatch, useSelector } from 'react-redux'
import Home from './pages/Home.jsx'
import useGetCity from './hooks/useGetCity.jsx'
import useGetMyShop from "./hooks/useGetMyShop.jsx"
import CreateEditShop from './pages/CreateEditShop.jsx'
import AddItem from './pages/AddItem.jsx'
import EditItem from './pages/EditItem.jsx'
import useGetShopByCity from './hooks/UseGetShopByCity.jsx'
import useGetItemsByCity from './hooks/useGetCityItems.jsx'
import CartFood from './pages/CartFood.jsx'
import CheckOut from './pages/CheckOut.jsx'
import OrderPlaced from './pages/OrderPlaced.jsx'
import MyOrders from './pages/MyOrders.jsx'
import useGetMyOrders from './hooks/useGetMyOrders.jsx'
import useUpdateLocation from './hooks/useUpdateLocation.jsx'
import TrackOrderPage from './pages/TrackOrderPage.jsx'
import { io } from 'socket.io-client'
import { setSocket } from './redux/userSlice.js'
export const serverUrl = "http://localhost:8000"
const App = () => {
  const { userData } = useSelector(state => state.user)
  const dispatch = useDispatch()
  useGetMyShop()
  useCurrentUser()
  useUpdateLocation()
  useGetCity()
  useGetShopByCity()
  useGetItemsByCity()
  useGetMyOrders()

  useEffect(() => {
   const socketInstance =  io(serverUrl , {withCredentials:true})
    dispatch(setSocket(socketInstance))
    socketInstance.on('connect' , (socket)=>{
      if(userData){
        socket.emit('identity' , {userId : userData._id})
      }
    })
    return ()=>{
      socketInstance.disconnect()
    }
  }, [userData?._id])
  
  
  return (
    <Routes>
      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={"/"} />} />
      <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to={"/"} />} />
      <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />} />
      <Route path='/' element={userData ? <Home /> : <Navigate to={"/signin"} />} />
      <Route path='/create-edit-shop' element={userData ? <CreateEditShop /> : <Navigate to={"/signin"} />}/>
      <Route path='/add-item' element={userData ? <AddItem /> : <Navigate to={"/signin"} />}/>
       <Route path='/edit-item/:itemId' element={userData ? <EditItem /> : <Navigate to={"/signin"} />}/>
       <Route path='/cart' element={userData ? <CartFood /> : <Navigate to={"/signin"} />}/>
       <Route path='/checkOut' element={userData ? <CheckOut /> : <Navigate to={"/signin"} />}/>
       <Route path='/place-order' element={userData ? <OrderPlaced /> : <Navigate to={"/signin"} />}/>
       <Route path='/my-orders' element={userData ? <MyOrders /> : <Navigate to={"/signin"} />}/>
       <Route path='/track-order/:orderId' element={userData ? <TrackOrderPage /> : <Navigate to={"/signin"} />}/>
    
    </Routes>
  )
}

export default App
