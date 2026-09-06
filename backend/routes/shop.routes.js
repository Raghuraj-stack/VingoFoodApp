import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { createEditShop, getShop, getShopByCity } from "../controllers/shop.constroller.js"
import {upload} from "../middlewares/multer.js"


const shopRoutes = express.Router()

shopRoutes.post("/create-edit" , isAuth,upload.single("image"), createEditShop)

shopRoutes.get("/get-my" , isAuth ,  getShop)

shopRoutes.get("/get-shop-city/:city" , isAuth ,  getShopByCity)
export default shopRoutes
