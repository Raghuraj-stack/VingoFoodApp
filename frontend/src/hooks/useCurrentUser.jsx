import axios from "axios"
import React from "react"
import { useEffect } from "react"
import {serverUrl} from "../App.jsx"
import { useDispatch } from "react-redux"
import { setUserData } from "../redux/userSlice"
function useCurrentUser(){
    const dispatch = useDispatch()
    useEffect(() => {
      const fetchUser = async ()=>{
        try { 
            const result = await axios.get(
  `${serverUrl}/api/user/current`,
  {
    withCredentials: true
  }
)

console.log("USER RECEIVED:", result.data)

dispatch(setUserData(result.data))
        } catch (error) {
          
   console.log("CURRENT USER ERROR:", error.response?.data)

        }
      }

      fetchUser()
    }, [dispatch])
    
}

export default useCurrentUser




