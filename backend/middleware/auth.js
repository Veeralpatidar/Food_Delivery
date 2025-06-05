//Extracts token from request headers.
//Verifies the token with the JWT secret key.
//If valid, extracts the user ID and attaches it to req.body.userId.
//Calls next() to allow the request to proceed.

import jwt from "jsonwebtoken"
import 'dotenv/config.js'
const authMiddleware=async(req,res,next)=>{
   const {token}=req.headers;
   if(!token){
      return res.json({sucsess:false,message:"Not Authorized , Login Again"})
   }
   try{
      const token_decode=jwt.verify(token,`${process.env.JWT_SECRET_KEY}`)
      req.body.userId=token_decode.id;
      next();
   }catch(error){
      console.log(error);
      res.json({success:false,message:`${error}`})
   }
}
export default authMiddleware;