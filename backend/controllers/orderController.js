import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Stripe from "stripe"
import 'dotenv/config.js'
const stripe= new Stripe("sk_test_51R6BfiDheFKWP3hj8FyZVcDpMEDCsxeN6BtOWUXMYR3ggxmGkJKuAu8ep5MnMvq888WflYZA0U6RYvRTpyrrKVXf001GHLRayu")
// placing user order from frontend
const placeOrder=async(req,res)=>{
   //place frontend url here
   const frontend_url="http://localhost:5173"
   try{
      console.log("ree");
      const newOrder=new orderModel({
         userId:req.body.userId,
         items:req.body.items,
         amount:req.body.amount,
         address:req.body.address
      })
      await newOrder.save();
      await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});
      const line_items=req.body.items.map((item)=>({
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
               name:"Delivery charges"
            },
            unit_amount:2*100
         },
         quantity:1
      })
      console.log(stripe);
      const session=await stripe.checkout.sessions.create({
         line_items:line_items,
         mode:'payment',
         success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
         cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      })
      console.log(session.url);
      res.json({success:true,session_url:session.url})
   }catch(error){
      console.log(error)
      res.json({success:false,message:`${error}`});
   }
}
const verifyOrder=async(req,res)=>{
   const {orderId,success}=req.body;
   try {
      if(success=="true"){
         await orderModel.findByIdAndUpdate(orderId,{payment:true});
         res.json({success:true,message:"Paid"})
      }
      else{
         await orderModel.findByIdAndDelete(orderId);
         res.json({success:false,message:"Not Paid"})
      }
   } catch (error) {
      console.log(error);
      res.json({success:false,message:`${error}`});
   }
}
// user orders for frontend
const userOrders=async(req,res)=>{
   try {
      const orders=await orderModel.find({userId:req.body.userId});
      res.json({success:true,data:orders})
   } catch (error) {
      console.log(error)
      res.json({success:false,message:`${error}`});
   }
}
// listing orders for admin panel
const listOrders=async(req,res)=>{
   try {
      const orders=await orderModel.find({});
      console.log(orders);
      res.json({success:true,data:orders})
   } catch (error) {
      console.log(error)
      res.json({success:false,message:`${error}`})
   }
}

//apifor udating order status
const updateStatus=async(req,res)=>{
   try {
      await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
      res.json({success:true,message:"Status Updated"})
   } catch (error) {
      console.log(error);
      res.json({success:false,message:`${error}`});
   }
}
export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}