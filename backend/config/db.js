//It imports mongoose and connects to a MongoDB Atlas database.

import mongoose from "mongoose";
export const connectDB=async()=>{
   await mongoose.connect('mongodb+srv://ayushgahoi235:ayush123@cluster0.ovtgy.mongodb.net/food-del').
   then(()=>console.log("DB connected"))
}