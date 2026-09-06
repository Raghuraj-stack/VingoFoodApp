import axios from "axios"
import React from "react"
import { useEffect } from "react"
import { serverUrl } from "../App.jsx"
import { useDispatch, useSelector } from "react-redux"
import { setMyShopData } from "../redux/ownerSlice.js"
import { setShopInMyCity } from "../redux/userSlice.js"

function useGetShopByCity() {
    const dispatch = useDispatch()
    const {currentCity} = useSelector(state =>state.user)
    useEffect(() => {

        const fetchShop = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/shop/get-shop-city/${currentCity}`, {
                    withCredentials: true
                })
             
                dispatch(setShopInMyCity(result.data))
            } catch (error) {
                console.log(error.response?.data || error.message)
            }
        }


        fetchShop()
    }, [currentCity])

}

export default useGetShopByCity



