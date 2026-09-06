import axios from "axios"
import React from "react"
import { useEffect } from "react"
import { serverUrl } from "../App.jsx"
import { useDispatch, useSelector } from "react-redux"
import { setMyShopData } from "../redux/ownerSlice.js"

function useGetMyShop() {
    const dispatch = useDispatch()
    const { shopData } = useSelector(state => state.owner)
    useEffect(() => {
        if (shopData) return
        
        const fetchShop = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/shop/get-my`, {
                    withCredentials: true
                })
                dispatch(setMyShopData(result.data))
            } catch (error) {
                console.log(error.response?.data || error.message)
            }
        }


        fetchShop()
    }, [dispatch])

}

export default useGetMyShop


