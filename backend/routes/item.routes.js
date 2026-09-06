import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { addItems, deleteItem, editItem, getItemByCity, getItemById } from "../controllers/item.controller.js"
import {upload} from "../middlewares/multer.js"

const itemRoutes = express.Router()

itemRoutes.post("/add-item" , isAuth ,  upload.single("image") , addItems)

itemRoutes.post("/edit-item/:itemId" , isAuth , upload.single("image") , editItem)

itemRoutes.get("/get-by-id/:itemId" , isAuth , getItemById)

itemRoutes.delete("/delete-item/:itemId" , isAuth , deleteItem)

itemRoutes.get("/get-city-item/:city" , isAuth , getItemByCity)

export default itemRoutes
