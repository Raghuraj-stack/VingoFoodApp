import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import ownerSlice from "./ownerSlice"
import mapSlice from "./map.slice"
export const store = configureStore({
    reducer:{
        user:userSlice,
        owner:ownerSlice,
        map:mapSlice
    },
    devTools:true,
})