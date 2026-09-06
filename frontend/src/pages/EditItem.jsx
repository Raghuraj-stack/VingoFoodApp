import React from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';
import { GiForkKnifeSpoon } from "react-icons/gi";
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import axios from "axios"
import { serverUrl } from "../App.jsx"
import { setMyShopData } from '../redux/ownerSlice.js';
import { ClipLoader } from 'react-spinners';
function EditItem() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [currentItem, setCurrentItem] = useState(null)
    const {itemId} = useParams()
    const { shopData } = useSelector(state => state.owner)
    const [name, setName] = useState("")
    const [price, setPrice] = useState(0)
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)
    const [category, setCategory] = useState("")
    const [foodType, setFoodType] = useState("Veg")

    const[loading , setLoading] = useState(false)
    
    const categories = ["Snacks",
        "Main Course",
        "Desserts",
        "Pizza",
        "Burgers",
        "Sandwiches",
        "South Indian",
        "North Indian",
        "Chinese",
        "Fast Food",
        "Others"]

    useEffect(() => {
        if (shopData) {
            setName(shopData.name || "")
            setFrontendImage(shopData.image || null)
        }
    }, [shopData])


    const handleImage = (e) => {
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formdata = new FormData()
            formdata.append("name", name)
            formdata.append("price", price)
            formdata.append("category", category)
            formdata.append("foodType", foodType)
            if (backendImage) {
                formdata.append("image", backendImage)
            }    
            const result = await axios.post(`${serverUrl}/api/item/edit-item/${itemId}`, formdata, { withCredentials: true })
            dispatch(setMyShopData(result.data))
            setLoading(false)
            navigate("/")
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
      const handleGetItemById = async()=>{
        try {
            const result = await axios.get(`${serverUrl}/api/item/get-by-id/${itemId}` ,{withCredentials:true})
            console.log(result.data)
            setCurrentItem(result.data)
            
        } catch (error) {
            console.log(error)
        }
      }
      handleGetItemById()
    }, [itemId])

    useEffect(() => {
      setName(currentItem?.name || "")
      setPrice(currentItem?.price || 0)
      setFrontendImage(currentItem?.image || "")
      setCategory(currentItem?.category || "")
      setFoodType(currentItem?.foodType || "")
    }, [currentItem])
    
    return (
        <div className='min-h-full flex flex-col items-center justify-center p-6 bg-linear-to-br from-orange-50 relative to-white '>
            <div className='absolute  top-5 left-5 z-10 mb-5'>
                <IoMdArrowRoundBack onClick={() => { navigate("/") }} size={35} className='text-[#ff4d2d] cursor-pointer' />
            </div>
            <div className='max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100'>
                <div className='flex flex-col justify-center items-center mb-6'>
                    <div className='bg-orange-100 p-4 rounded-full mb-4'>
                        <GiForkKnifeSpoon className='text-[#ff4d2d] w-16 h-16' />
                    </div>
                    <div className='font-extrabold text-3xl text-gray-900'>
                        Edit Food Item
                    </div>
                </div>

                <form className='space-y-5' onSubmit={handleSubmit}>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                        <input type="text" placeholder='Enter Food Item Name' className='w-full px-4 py-2 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-orange-500' onChange={(e) => { setName(e.target.value) }} value={name} />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Food Image</label>
                        <input type="file" accept='image/*' onChange={handleImage} className='w-full px-4 py-2 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-orange-500' />
                        {frontendImage && <div className='mt-4'><img src={frontendImage} alt="Shop Image" className='w-full h-48 object-cover rounded-lg border' /></div>}
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Price</label>
                        <input type="number" placeholder='0' className='w-full px-4 py-2 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-orange-500' onChange={(e) => { setPrice(e.target.value) }} value={price} />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Select Category</label>
                        <select type="text" placeholder='Enter Shop Name' className='w-full px-4 py-2 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-orange-500' onChange={(e) => { setCategory(e.target.value) }} value={category}>
                            <option value="">Select Category</option>
                            {categories.map((cate, index) => (
                                <option value={cate} key={index}>{cate}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Select Food Type</label>
                        <select type="text" placeholder='Enter Shop Name' className='w-full px-4 py-2 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-orange-500' onChange={(e) => { setFoodType(e.target.value) }} value={foodType}>
                            <option value="Veg" >Veg</option>
                            <option value="Non Veg">Non Veg</option>
                        </select>
                    </div>

                    <button className='w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 cursor-pointer'disabled={loading}>{loading? <ClipLoader size={20} color='white'/> : "Add Item"}</button>
                </form>
            </div>
        </div>
    )
}

export default EditItem

