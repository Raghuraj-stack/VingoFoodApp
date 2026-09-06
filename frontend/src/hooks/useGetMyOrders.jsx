import axios from "axios"
import React from "react"
import { useEffect } from "react"
import { serverUrl } from "../App.jsx"
import { useDispatch, useSelector } from "react-redux"
import { setMyShopData } from "../redux/ownerSlice.js"
import { setMyOrders } from "../redux/userSlice.js"

function useGetMyOrders() {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/order/get-my-orders`, {
                    withCredentials: true
                })
                console.log(result.data)
                dispatch(setMyOrders(result.data))
            } catch (error) {
                console.log(error.response?.data || error.message)
            }
        }


        fetchOrders()
    }, [userData])

}

export default useGetMyOrders


