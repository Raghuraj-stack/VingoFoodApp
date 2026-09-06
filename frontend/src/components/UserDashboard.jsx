import React, { useRef } from 'react'
import Nav from "./Nav.jsx"
import CategoryCard from './CategoryCard.jsx'
import { categories } from '../../category.js'
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";
import { useSelector } from 'react-redux';
import FoodCard from './FoodCard.jsx';

function UserDashboard() {
  const cateScrollRef = useRef()
  const {currentCity} = useSelector(state=>state.user)
  const {shopInMyCity} = useSelector(state=>state.user)
  const {itemInMyCity} = useSelector(state=>state.user)
  const shopScrollRef = useRef()
  const itemScrollRef = useRef()
  // const scrollHandler = (ref , direction)=>{
  //   if(ref.current)
  //   {
  //     ref.current.scrollBy({
  //       left:direction=="left"?-500:500,
  //       behavior:"smooth"
  //     })
  //   }
    const scrollHandler = (ref, direction) => {
  if (!ref.current) return;

  const distance = 300;
  const duration = 400;
  const start = ref.current.scrollLeft;
  const target = start + (direction === "left" ? -distance : distance);
  const startTime = performance.now();

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    ref.current.scrollLeft = start + (target - start) * ease;

    if (progress < 1) requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
};
  
  return (
    <div className='w-screen min-h-full flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
      <Nav/>
      
        <div className='w-full max-w-6xl flex flex-col gap-5 item-start p-2.5'>
        <h1 className='text-gray-700 text-2xl sm:text-3xl'>Inspirations for your first order</h1>
        <div className='w-full flex-1 flex'>
          <button onClick={()=>{scrollHandler(cateScrollRef , "left")}}>
          <FaArrowCircleLeft size={20} className='text-[#ff4d2d] hover:text-orange-700 cursor-pointer items-start '/>
          </button>
          <div className='w-full flex overflow-x-auto gap-4 pb-2 ml-5 mr-5' ref={cateScrollRef}>
        {categories.map((cate , index)=>(
          <CategoryCard name={cate.category} image={cate.image} key={index}/>
        ))}
        </div>
        <button  onClick={()=>{scrollHandler(cateScrollRef , "right")}}>
          <FaArrowCircleRight size={20} className='text-[#ff4d2d] hover:text-orange-700 cursor-pointer items-start '/>
          </button>
        </div>
      </div>
      <div className='w-full max-w-6xl flex flex-col gap-5 item-start p-2.5'>
        <h1 className='text-gray-700 text-2xl sm:text-3xl'>Best Shop's in {currentCity}</h1>
        <div className='w-full flex-1 flex'>
          {
          shopInMyCity?.length > 7 && <button onClick={()=>{scrollHandler(shopScrollRef , "left")}}>
          <FaArrowCircleLeft size={20} className='text-[#ff4d2d] hover:text-orange-700 cursor-pointer items-start '/>
          </button>
        }
          
          <div className='w-full flex overflow-x-auto gap-4 pb-2 ml-5 mr-5' ref={shopScrollRef}>
        {shopInMyCity?.map((shop , index)=>(
          <CategoryCard name={shop.name} image={shop.image} key={index}/>
        ))}
        </div>
        {
          shopInMyCity?.length > 7 && <button  onClick={()=>{scrollHandler(shopScrollRef , "right")}}>
          <FaArrowCircleRight size={20} className='text-[#ff4d2d] hover:text-orange-700 cursor-pointer items-start '/>
          </button>
        }
        </div>
      </div>

      <div className='w-full max-w-6xl flex flex-col gap-5 item-start p-2.5 '>
        
        <h1 className='text-gray-700 text-2xl sm:text-3xl'>Suggested Food Item's</h1>
        <div className='sm:flex md:grid grid-cols-4 gap-4  mx-auto'>
          {itemInMyCity?.map((item , index)=>(
          <FoodCard data={item} key={index}/>
        ))}
        </div>
        
      </div>
    </div>
  )
}

export default UserDashboard









































// import React from 'react'
// import { FaLocationDot } from "react-icons/fa6";
// import { RxCross2 } from "react-icons/rx";
// import { IoIosSearch } from "react-icons/io";
// import { FiShoppingCart } from "react-icons/fi";
// import { useSelector } from 'react-redux'
// import { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import {serverUrl} from "../App"
// import { setUserData } from '../redux/userSlice.js';
// import axios from "axios"
// function UserDashboard() {
//   const { userData , city } = useSelector(state => state.user)
//   const [showInfo, setShowInfo] = useState(false)
//   const [showSearch, setShowSearch] = useState(false)
//   const dispatch = useDispatch()

//   const handleLogOut =async ()=>{
//     try {
//       const result = await axios.get(`${serverUrl}/api/auth/signout` , {withCredentials:true})
//       dispatch(setUserData(null))
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   return (


//     <div className='w-full h-20 flex items-center justify-between md:justify-center gap-7.5 px-5 fixed top-0 z-9999 bg-[#fff9f6] overflow-visible'>

//     {showSearch && <div className='w-[90%] h-17.5 bg-white shadow-xl rounded-lg items-center gap-5 flex fixed left-[5%] top-20 md:hidden'>
//         <div className='flex items-center w-[30%] overflow-hidden border-r-2 gap-2.5 px-2.5 border-gray-400'>
//           <FaLocationDot size={25} className='text-[#ff4d2d]' />
//           <div className='w-[80%] truncate text-gray-600'>
//             {city}
//           </div>
//         </div>
//         <div className='w-[80%] flex items-center gap-2.5'>
//           <IoIosSearch size={25} className='text-[#ff4d2d]' />
//           <input type="text" placeholder='Search for Delicious Food...' className='w-full outline-0 px-2.5 text-gray-700' />
//         </div>
//       </div>
//       }


//       <h1 className='text-3xl font-bold mb-2 text-[#ff4d2d]'>Vingo</h1>
//       <div className=' w-full max-w-175 h-17.5 bg-white shadow-xl rounded-lg items-center gap-5 hidden md:flex'>
//         <div className='flex items-center w-[30%] overflow-hidden border-r-2 gap-2.5 px-2.5 border-gray-400'>
//           <FaLocationDot size={25} className='text-[#ff4d2d]' />
//           <div className='w-[80%] truncate text-gray-600'>
//             {city}
//           </div>
//         </div>
//         <div className='w-[80%] flex items-center gap-2.5'>
//           <IoIosSearch size={25} className='text-[#ff4d2d]'  />
//           <input type="text" placeholder='Search for Delicious Food...' className='w-full outline-0 px-2.5 text-gray-700' />
//         </div>
//       </div>
//       <div className='flex gap-4 items-center'>
//         {showSearch ?<RxCross2 onClick={()=>{setShowSearch(false)}} size={25} className='text-[#ff4d2d] md:hidden'/> : <IoIosSearch size={25} className='text-[#ff4d2d] md:hidden' onClick={()=>{setShowSearch(true)}}/>}
        
//         <div className='relative cursor-pointer'>
//           <FiShoppingCart size={25} className='text-[#ff4d2d]' />
//           <span className='absolute -right-2.25 -top-3 text-[#ff4d2d]'>0</span>
//         </div>
//         <button className='hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium'
//         >My Orders</button>
//         <div onClick={() => {setShowInfo(prev=>!prev)}} className='w-10 h-10 cursor-pointer shadow-lg text-white bg-[#ff4d2d] flex items-center justify-center rounded-full font-semibold'>
//           {userData?.fullname.slice(0, 1)}
//         </div>
//         {showInfo && <div className='fixed top-20 right-2.5 md:right-[10%] lg:right-[10%] w-45 bg-white shadow-2xl rounded-xl p-5 flex flex-col gap-2.5 z-9999'>
//           <div className='text-4.25 font-semibold'>{userData.fullname}</div>
//           <div className='text-4.25 text-[#ff4d2d] cursor-pointer font-semibold md:hidden'>My Orders</div>
//           <div onClick={handleLogOut} className='text-4.25 text-[#ff4d2d] cursor-pointer font-semibold'>Log Out</div></div>}
//       </div>
//     </div>
//   )
// }



// export default UserDashboard




