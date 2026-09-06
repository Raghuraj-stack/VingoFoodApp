import Shop from "../models/shop.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import DeliveryAssignment from "../models/deliveryAssignment.model.js";
import Razorpay from "razorpay"
import dotenv from "dotenv"
dotenv.config()

let instance = new Razorpay({
  key_id: process.env.RAZOR_PAY_API,
  key_secret: process.env.RAZOR_PAY_SECRET,
});


export const placeOrder = async (req, res) => {
    try {
        const { cartItems, paymentMethod, deliveryAddress } = req.body;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                message: "Cart items not found"
            });
        }

        if (
            !deliveryAddress?.text ||
            deliveryAddress?.latitude == null ||
            deliveryAddress?.longitude == null
        ) {
            return res.status(400).json({
                message: "Delivery address not found"
            });
        }

        const groupItemsByShop = {};

        cartItems.forEach((item) => {
            const shopId = item.shop;

            if (!groupItemsByShop[shopId]) {
                groupItemsByShop[shopId] = [];
            }

            groupItemsByShop[shopId].push(item);
        });

        const shopOrders = await Promise.all(
            Object.keys(groupItemsByShop).map(async (shopId) => {
                const shop = await Shop.findById(shopId).populate("owner");

                if (!shop) {
                    throw new Error(`Shop not found: ${shopId}`);
                }

                const items = groupItemsByShop[shopId];

                const subtotal = items.reduce(
                    (sum, item) =>
                        sum +
                        Number(item.price) * Number(item.quantity),
                    0
                );

                return {
                    shop: shop._id,
                    owner: shop.owner._id,
                    subtotal,
                    shopOrderItems: items.map((item) => ({
                        item: item._id || item.id,
                        price: item.price,
                        quantity: item.quantity,
                        name: item.name,
                    })),
                };
            })
        );

        const totalAmount = shopOrders.reduce(
            (sum, order) => sum + order.subtotal,
            0
        );

        if(paymentMethod == "online"){
            const razorOrder = await instance.orders.create({
               amount:Math.round(totalAmount*100),
               currency:"INR" ,
               receipt:`receipt_${Date.now()}`
            })
        



        const newOrder = await Order.create({
            user: req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            shopOrders,
            razorpayOrderId:razorOrder.id,
            payment:false
        });

        return res.status(200).json({
            razorOrder ,
            orderId : newOrder._id,
        })
    }

        const newOrder = await Order.create({
            user: req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            shopOrders
        });

        await newOrder.populate([
            {
                path: "shopOrders.shop",
                select: "name"
            },
            {
                path: "shopOrders.owner",
                select: "name socketId"
            },
            {
                path: "shopOrders.shopOrderItems.item",
                select: "name image price"
            },
            {
                path: "user",
                select: "name email mobile"
            }
        ]);

        const io = req.app.get('io')

        if(io)
        {
            newOrder.shopOrders.forEach(shopOrder=>{
                const ownerSocketId = shopOrder.owner.socketId
                if(ownerSocketId)
                {   
                    io.to(ownerSocketId).emit('newOrder' , {
                _id: newOrder._id,
                payentMethod: newOrder.paymentMethod,
                user: newOrder.user,
                shopOrders: shopOrder,
                createdAt: newOrder.createdAt,
                deliveryAddress: newOrder.deliveryAddress
            })
                }
            })
        }

        console.log(JSON.stringify(newOrder, null, 2));
        return res.status(201).json({
            success: true,
            order: newOrder,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const verifyPayment = async (req , res)=>{
    try {
        const {razorpay_payment_id , orderId} = req.body
        const payment = await instance.payments.fetch(razorpay_payment_id)
        if(!payment || payment.status != "captured")
        {   
            res.status(400).json({
                message:"payment not captured"
            })
        }

        const order = await Order.findById(orderId)

        order.payment = true
        order.razorpayPaymentId = razorpay_payment_id
        await order.save()


        await order.populate([
            {
                path: "shopOrders.shop",
                select: "name"
            },
            {
                path: "shopOrders.shopOrderItems.item",
                select: "name image price"
            }
        ]);

        return res.status(200).json(order)


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}   

export const getMyOrders = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (user.role == "user") {
            const userOrders = await Order.find({ user: req.userId })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("shopOrders.owner", "name email mobile")
                .populate("shopOrders.shopOrderItems.item", "name image price")


            return res.status(201).json(userOrders)
        } else if (user.role == "owner") {
            const ownerOrders = await Order.find({ "shopOrders.owner": req.userId })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("user")
                .populate("shopOrders.shopOrderItems.item", "name image price")
                .populate("shopOrders.assignedDeliveryBoy", "fullname mobile")

            const filteredOrders = ownerOrders.map((order =>
            ({
                _id: order._id,
                payentMethod: order.paymentMethod,
                user: order.user,
                shopOrders: order.shopOrders.find(o => o.owner._id == req.userId),
                createdAt: order.createdAt,
                deliveryAddress: order.deliveryAddress
            })))

            return res.status(201).json(filteredOrders)
        }
    } catch (error) {
        console.log("GET MY ORDERS ERROR:", error);

        return res.status(500).json({
            message: error.message
        });
    }
}


export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, shopId } = req.params;
        const { status } = req.body;

        if (!status || status.trim() === "") {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        const shopOrder = order.shopOrders.find(
            o => o.shop.toString() === shopId
        );

        if (!shopOrder) {
            return res.status(400).json({
                message: "Shop order not found"
            });
        }

        console.log("STATUS RECEIVED:", status);
        console.log("SHOP ORDER BEFORE:", shopOrder.status);

        shopOrder.status = status;

        console.log("SHOP ORDER AFTER:", shopOrder.status);

        let deliveryBoyPayload = [];
        console.log("CURRENT ASSIGNMENT:", shopOrder.assignment);
        if (
            status === "out for delivery" &&
            !shopOrder.assignment
        ) {

            const { latitude, longitude } =
                order.deliveryAddress;

            const nearByDeliveryBoys = await User.find({
                role: "deliveryBoy",
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [
                                Number(longitude),
                                Number(latitude)
                            ]
                        },
                        $maxDistance: 5000
                    }
                }
            });

            const nearByIds =
                nearByDeliveryBoys.map(b => b._id);

            const busyIds =
                await DeliveryAssignment.find({
                    assignedTo: { $in: nearByIds },
                    status: {
                        $nin: [
                            "brodcasted",
                            "completed"
                        ]
                    }
                }).distinct("assignedTo");

            const busyIdSet = new Set(
                busyIds.map(id => String(id))
            );

            const availableDeliveryBoys =
                nearByDeliveryBoys.filter(
                    b =>
                        !busyIdSet.has(
                            String(b._id)
                        )
                );

            const candidates =
                availableDeliveryBoys.map(
                    b => b._id
                );

            if (candidates.length === 0) {

                await order.save();

                return res.status(200).json({
                    message:
                        "No delivery boys available",
                    shopOrder
                });
            }
            console.log("Nearby Delivery Boys:", nearByDeliveryBoys);

            console.log(
                "Candidate IDs:",
                candidates.map(id => id.toString())
            );
            const deliveryAssignment =
                await DeliveryAssignment.create({
                    order: order._id,
                    shop: shopOrder.shop,
                    shopOrderId: shopOrder._id,
                    brodcastedTo: candidates,
                    status: "brodcasted"
                });

                
            shopOrder.assignment =
                deliveryAssignment._id;

            await order.save();

            console.log(
                "ASSIGNMENT CREATED:",
                deliveryAssignment._id
            );

            const checkOrder =
                await Order.findById(order._id);

            console.log(
                "SAVED ASSIGNMENT:",
                checkOrder.shopOrders.find(
                    o =>
                        o._id.toString() ===
                        shopOrder._id.toString()
                )?.assignment
            );

            deliveryBoyPayload =
                availableDeliveryBoys.map(b => ({
                    id: b._id,
                    fullname: b.fullname,
                    mobile: b.mobile,
                    latitude:
                        b.location?.coordinates?.[1],
                    longitude:
                        b.location?.coordinates?.[0]
                }));

        } else {
            await order.save();
        }

        await order.populate(
            "shopOrders.shop",
            "name"
        );

        await order.populate(
            "shopOrders.assignedDeliveryBoy",
            "fullname email mobile"
        );

        const updatedShopOrder =
            order.shopOrders.find(
                o =>
                    o.shop?._id?.toString() ===
                    shopId ||
                    o.shop?.toString?.() ===
                    shopId
            );
        if (shopOrder.assignment) {

            const assignment = await DeliveryAssignment
                .findById(shopOrder.assignment)
                .populate(
                    "brodcastedTo",
                    "fullname mobile"
                );

            deliveryBoyPayload =
                assignment?.brodcastedTo || [];
        }

        return res.status(200).json({
            shopOrder: updatedShopOrder,
            status: updatedShopOrder.status,
            assignedDeliveryBoy:
                updatedShopOrder.assignedDeliveryBoy,
            availableDeliveryBoys:
                deliveryBoyPayload,
            assignment:
                updatedShopOrder.assignment ||
                null
        });

    } catch (error) {

        console.log(
            "UPDATE STATUS ERROR:"
        );
        console.log(error);
        console.log(error.stack);

        return res.status(500).json({
            message: error.message
        });
    }
};



export const assignments = async (req, res) => {
    try {

        const deliveryBoyId = req.userId;

        console.log("Logged In Delivery Boy:", deliveryBoyId);

        const assignments = await DeliveryAssignment.find({
            brodcastedTo: deliveryBoyId,
            status: "brodcasted"
        })
            .populate("order")
            .populate("shop");

        console.log("Found Assignments:", assignments);


        const formatted = assignments.map(a => ({
            assignmentId: a._id,
            orderId: a.order._id,
            shopName: a.shop.name,
            deliveryAddress: a.order.deliveryAddress,
            items: a.order.shopOrders.find(
                so => so._id.equals(a.shopOrderId)
            )?.shopOrderItems || [],
            subtotal: a.order.shopOrders.find(
                so => so._id.equals(a.shopOrderId)
            )?.subtotal
        }));

        return res.status(200).json(formatted);

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: error.message
        });
    }
};



export const acceptAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params
        const assignment = await DeliveryAssignment.findById(assignmentId)
        if (!assignment) {
            return res.status(400).json({ message: "assignment not found int he delivery assignment" })
        }
        if (assignment.status !== "brodcasted") {
            return res.status(400).json({ message: "assignment status problem(expired)" })
        }
        const alreadyAssigned = await DeliveryAssignment.findOne({
            assignedTo: req.userId
            ,
            status: {
                $nin: [
                    "brodcasted",
                    "completed"
                ]
            }
        })

        if (alreadyAssigned) {
            return res.status(400).json({ message: "you are already assigned to other order" })

        }

        assignment.assignedTo = req.userId
        assignment.status = "assigned"
        assignment.acceptedAt = new Date()
        await assignment.save()

        console.log("AFTER SAVE:", assignment);
        const order = await Order.findById(assignment.order)
        if (!order) {
            return res.status(400).json({ message: "no roder found" })
        }
        const shopOrder = order.shopOrders.id(assignment.shopOrderId)
        shopOrder.assignedDeliveryBoy = req.userId
        await order.save()
        await order.populate('shopOrders.assignedDeliveryBoy')

        return res.status(200).json({
            message: 'order accepted'
        })
    } catch (error) {
        return res.status(400).json({ message: error })
    }
}


export const getCurrentOrder = async (req, res) => {
    try {
        const assignment = await DeliveryAssignment.findOne({
            assignedTo: req.userId,
            status: "assigned"
        })
            .populate("assignedTo", "fullname email mobile location")
            .populate({
                path: "order",
                populate: [
                    {
                        path: "user",
                        select: "fullname email location mobile"
                    },
                    {
                        path: "shopOrders.shop",
                        select: "name"
                    }
                ]
            });
            console.log(assignment)


        if (!assignment) {
            return res.status(400).json({ message: "assignment not found" })
        }


        const shopOrder = assignment.order.shopOrders.find(
            so => String(so._id) === String(assignment.shopOrderId)
        );

        if (!shopOrder) {
            return res.status(400).json({
                message: "Shop order not found"
            });
        }

        console.log("Assignment:", assignment);
        console.log("assignment.order:", assignment?.order);
        console.log("assignment.order type:", typeof assignment?.order);


        const deliveryBoyLocation = { lat: null, lon: null }

        if (
            assignment.assignedTo &&
            assignment.assignedTo.location &&
            assignment.assignedTo.location.coordinates &&
            assignment.assignedTo.location.coordinates.length === 2
        ) {
            deliveryBoyLocation.lat =
                assignment.assignedTo.location.coordinates[1];

            deliveryBoyLocation.lon =
                assignment.assignedTo.location.coordinates[0];
        }


        const customerLocation = { lat: null, lon: null }
        if (assignment.order.deliveryAddress) {
            customerLocation.lat = assignment.order.deliveryAddress.latitude
            customerLocation.lon = assignment.order.deliveryAddress.longitude
        }
        const currentLocation = customerLocation;
        return res.status(200).json({
            _id: assignment.order._id
            ,
            shopOrder,
            user: assignment.order.user,
            deliveryAddress: assignment.order.deliveryAddress,
            deliveryBoyLocation,
            currentLocation
        })
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: error.message
        });
    }
}


export const getOrderById = async (req , res)=>{
    try {
        const {orderId} =  req.params
        const order =await Order.findById(orderId)
        .populate("user")
        .populate({
            path:"shopOrders.shop",
            model:"Shop"
        })
        .populate({
            path:"shopOrders.assignedDeliveryBoy",
            model:"User"
        })
        .populate({
            path:"shopOrders.shopOrderItems.item",
            model:"Item"
        })
        .lean()

        if(!order)
        {
            return res.status(400).json({message:error})
        }
         return res.status(200).json(order)
    } catch (error) {
             return res.status(400).json({message:error})
    }
}