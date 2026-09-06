import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { acceptAssignment, assignments, getCurrentOrder, getMyOrders, getOrderById, placeOrder, updateOrderStatus, verifyPayment } from "../controllers/order.controller.js"


const orderRoutes = express.Router()

orderRoutes.post("/place-order" , isAuth , placeOrder)

orderRoutes.get("/get-my-orders" , isAuth , getMyOrders)

orderRoutes.get("/verify-payment" , isAuth , verifyPayment)

orderRoutes.post("/update-status/:orderId/:shopId" , isAuth , updateOrderStatus)

orderRoutes.get("/get-delivery-orders" , isAuth , assignments)

orderRoutes.get("/accept-order/:assignmentId" , isAuth , acceptAssignment)

orderRoutes.get("/current-order" , isAuth , getCurrentOrder)

orderRoutes.get("/get-order-by-id/:orderId" , isAuth , getOrderById)


export default orderRoutes
