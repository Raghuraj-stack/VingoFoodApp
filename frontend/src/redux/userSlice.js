import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null,
        currentCity:null,
        currentState:null,
        currentAddress:null,
        shopInMyCity:null,
        itemInMyCity:null,
        cartItems:[],
        myOrders:[],
        socket:null
       
    } , 
    reducers:{
        setUserData:(state , action)=>{
            state.userData=action.payload
        }
        ,
        setCurrentCity:(state , action)=>{
            state.currentCity=action.payload
        },
        setCurrentState:(state , action)=>{
            state.currentState=action.payload
        },
        setCurrentAddress:(state , action)=>{
            state.currentAddress=action.payload
        },
        setShopInMyCity:(state , action)=>{
            state.shopInMyCity = action.payload
        },
        setItemInMyCity:(state , action)=>{
            state.itemInMyCity = action.payload
        },
        setMyOrders:(state , action)=>{
            state.myOrders = action.payload
        }
        ,
        setSocket:(state , action)=>{
            state.socket = action.payload
        }
        ,
        addToCart:(state , action)=>{
            const cartItems = action.payload
            const existingItems = state.cartItems.find(i=>i.id == cartItems.id)
            if(existingItems)
            {
                existingItems.quantity = existingItems.quantity + cartItems.quantity
            }
            else{
                state.cartItems.push(cartItems)
            }
        }
        ,
        updateQuantity:(state , action)=>{
            const {id , quantity} = action.payload
            const item = state.cartItems.find(i=>i.id == id)
            if(item)
            {
                item.quantity = quantity
            }
        },
        removeCartItems:(state , action)=>{
            const {id} = action.payload
            const items = state.cartItems.filter(i=>i.id != id)
            if(items)
            {
                state.cartItems = items
            }
        },
        addMyOrders:(state , action)=>{
            state.myOrders = [action.payload,...state.myOrders]
        },
        updateOrderStatus:(state , action)=>{
            const {orderId , shopId , status} = action.payload
            const order = state.myOrders.find(o=>o._id == orderId)
            if(order)
                {
                    if(order.shopOrders && order.shopOrders.shop._id == shopId)
                    {
                        order.shopOrders.status = status
                    }
                }            
        }
    }
})


export const {updateOrderStatus,setSocket , addMyOrders , setMyOrders , removeCartItems , updateQuantity , addToCart , setItemInMyCity,setUserData , setCurrentCity ,setCurrentAddress, setCurrentState ,setShopInMyCity} = userSlice.actions

export default userSlice.reducer