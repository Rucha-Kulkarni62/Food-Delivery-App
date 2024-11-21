import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//Function to place the order form frontend
const placeOrder = async (req,res) => {

    const frontend_url = "https://food-delivery-app-frontend-kg0y.onrender.com";
       try {
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address    
        })
         await newOrder.save();
         await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

        const line_items = req.body.items.map((item)=>({
             price_data:{
                currency:"usd",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100
             },
             quantity:item.quantity
        }))

        line_items.push({
            price_data:{
                currency:"usd",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:2*100
            },
            quantity:1
        })

        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:"payment",
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })

        res.json({success:true,session_url:session.url});
       } catch (error) {
          console.log(error);
          res.json({success:true,message:"Error"});
          
       }
}

//user orders for frontend
const userOrders = async (req,res) => {
       try {
         const orders = await orderModel.find({userId:req.body.userId});
         res.json({success:true,data:orders});
       } catch (error) {
         console.log(error);
         res.json({success:false,message:"Error"});     
       } 
}

//Listing orders for admin panel
const listOrders = async (req,res) => {
         try {
             const orders = await orderModel.find({});
             res.json({success:true,data:orders});
         } catch (error) {
            console.log(error);
            res.json({success:false,message:"Error"});
         }
}

//Api for updating the order status
const updateStatus = async (req,res) => {
  try {
     await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
     res.json({success:true,message:"Status updates"})
  } catch (error) {
     console.log(error);
     res.json({success:false,message:"Error"});
  }
}

export {placeOrder,userOrders,listOrders,updateStatus};
