import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJwt = asyncHandler( async (req , _ , next) => {
   try {
     const token = req.cookies?.accessToken ||
      req.header( "Authorization")?.replace("Bearer " ,"" )
 
      if( ! token ){
         throw new ApiError( 401 , "unauthorized token" )
      } 
 
     const decodedToken =  jwt.verify( token , process.env.ACCESS_TOKEN_SECRET )

      //// my comments
     console.log("this is decoded jwt from authMiddleware...") ; 
     console.log(decodedToken ) ; 
 
      const user = await User.findById( decodedToken?._id ).select(
         "-password -refreshToken"
      )
 
      if( ! user ){
         throw new ApiError(401 , "invalid access token")
      }

      //  Attaches user details (after authentication) to the request object for easy access in 
      //  subsequent middleware and route handlers.
      req.user = user ;
      // console.log("first") 
      // console.log(user)
      next()
   } catch (error) {
        throw new ApiError( 401 , error?.message || "invalid access token" )
   }

} )

