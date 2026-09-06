import axios from "axios"
import React from "react"
import { useEffect } from "react"
import { serverUrl } from "../App.jsx"
import { useDispatch, useSelector } from "react-redux"
import { setMyShopData } from "../redux/ownerSlice.js"
import { setItemInMyCity, setShopInMyCity } from "../redux/userSlice.js"

function useGetItemsByCity() {
    const dispatch = useDispatch()
    const {currentCity} = useSelector(state =>state.user)
    useEffect(() => {

        const fetchItem = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/item/get-city-item/${currentCity}`, {
                    withCredentials: true
                })
        
                dispatch(setItemInMyCity(result.data))
            } catch (error) {
                console.log(error.response?.data || error.message)
            }
        }


        fetchItem()
    }, [currentCity])

}

export default useGetItemsByCity



