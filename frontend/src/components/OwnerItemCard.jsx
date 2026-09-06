import React from 'react'
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { serverUrl } from "../App.jsx"
import axios from "axios"
import { setMyShopData } from '../redux/ownerSlice.js';
function OwnerItemCard({ data }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleDeleteItem = async () => {
        try {
            const result = await axios.delete(`${serverUrl}/api/item/delete-item/${data._id}`, { withCredentials: true })
            console.log(result.data)
            dispatch(setMyShopData(result.data))
            const cityItems = await axios.get(
                `${serverUrl}/api/item/get-city-item/${result.data.city}`,
                { withCredentials: true }
            )
            dispatch(setItemInMyCity(cityItems.data))
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="flex bg-white rounded-lg border border-[#ff4d2d] shadow-md hover:shadow-lg overflow-hidden w-full mt-5">


            <div className="w-32 h-32 shrink-0">
                <img
                    src={data.image}
                    alt={data.name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex flex-1 justify-between p-3 min-w-0">


                <div className="flex-1 min-w-0">
                    <h2
                        className="text-[#ff4d2d] font-semibold text-lg truncate"
                        title={data.name}
                    >
                        {data.name}
                    </h2>

                    <p className="mt-1">
                        <span className="font-semibold">
                            Category :
                        </span>{" "}
                        {data.category}
                    </p>

                    <p>
                        <span className="font-semibold">
                            Food Type :
                        </span>{" "}
                        {data.foodType}
                    </p>
                </div>


                <div className="flex flex-col justify-between items-end ml-3 shrink-0">

                    <p className="text-[#ff4d2d] font-bold whitespace-nowrap">
                        ₹ {data.price}
                    </p>

                    <div className="flex gap-2">
                        <button
                            onClick={() => { navigate(`/edit-item/${data._id}`) }}
                            className="p-2 rounded-full text-[#ff4d2d] hover:bg-[#ff4d2d]/10 cursor-pointer"
                        >
                            <MdEdit size={18} />
                        </button>

                        <button onClick={handleDeleteItem}
                            className="p-2 rounded-full text-[#ff4d2d] hover:bg-[#ff4d2d]/10 cursor-pointer"
                        >
                            <FaTrashAlt size={18} />
                        </button>
                    </div>

                </div>

            </div>

        </div>

        // <div className='flex h-full bg-white shadow-xl hover:shadow-2xl rounded-lg overflow-hidden border border-[#ff4d2d] w-full max-w-2xl mt-5'>
        //     <div className='w-36 h-full shrink-0 bg-gray-50'>
        //         <img src={data.image} alt='' className='w-full h-full object-cover' />
        //     </div>

        //     <div className='flex justify-between p-3 flex-1 min-w-0'>
        //         <div>
        //             <h2 className='text-base font-semibold text-[#ff4d2d] truncate'>{data.name}</h2>
        //             <p><span className='font-medium text-gray-70'>Catergory :</span> {data.category}</p>
        //             <p><span className='font-medium text-gray-70'>Food Type :</span> {data.foodType}</p>
        //         </div>
        //         <div className='flex items-center justify-between shrink-0'>
        //             <div className='font-bold text-[#ff4d2d]'><span className='font-medium '>Price :</span> {data.price}</div>
        //         </div>
        //         <div className='flex items-center gap-2'>
        //         <div onClick={()=>{naviagte(`/edit-item/${data._id}`)}} className='p-2 cursor-pointer rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d]'>
        //             <MdEdit size={20} />
        //         </div>
        //         <div className='p-2 cursor-pointer rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d]'>
        //             <FaTrashAlt size={20} />
        //         </div>
        //         </div>
        //     </div>
        // </div>
    )
}

export default OwnerItemCard
