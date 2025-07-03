import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose , {isValidObjectId} from "mongoose";
import { Video } from "../models/video.model.js";


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)

        if (!user) {
            throw new ApiError(404, "User not found");
          }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler ( async (req , res)=>{
     // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    
    console.log( "done")
    // console.log( req.files )

    const { fullName , email , username , password  } = req.body
    // const {avatar , coverImage} =  req.files;
    // // console.log(req.body)
    // console.log(fullName);
    // // console.log(fullName , avatar);
    // console.log("email" , email , avatar) ;

    if( 
        [fullName , email ,username , password ].some( (feild) => 
            feild?.trim() === ""
        )
     ) {
        throw new ApiError( 400 , "all feilds are required" ) 
    }

    const existedUser = await User.findOne( {
        $or : [{username : username} , {email}]
    } )

    if( existedUser ){
        throw new ApiError( 409 ,"user with email or username is already exist" )
    }

     const avatarLocal = req.files?.avatar && req.files.avatar[0]?.path
     // const coverImageLocal = req.files?.coverImage[0]?.path

     let coverImageLocalPath;
     if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
         coverImageLocalPath = req.files.coverImage[0].path;
     } else {
         coverImageLocalPath = ""; // or handle missing cover image case
     }

    if( !avatarLocal  ){
        throw new ApiError( 400 , "avatar is required" )
    }

    const avatar = await uploadOnCloudinary(avatarLocal)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
    if( ! avatar ){
        throw new ApiError( 400 , "avatar is required" )
    }

    const newuser = await User.create({
        fullName , 
        avatar : avatar.url , 
        coverImage : coverImage?.url || "" ,
        email : email.toLowerCase() , 
        password , 
        username : username.toLowerCase()
    })

    const createdUser = await User.findById( newuser._id ).select(
        "-password -refreshToken"
    )

    if( ! createdUser ){
        throw new ApiError( 500 , "something went wrong while registering the user " )
    }

    return res.status(201).json(
        new ApiResponse(200 ,createdUser , "user registered successfully"   )
    )

} )

const loginUser = asyncHandler( async (req , res) => {
   // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    // console.log("email :" + email);

    if ((!username && !email) || !password) {
        throw new ApiError(400, "username or email and password is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")    
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })
    console.log("bawksdhbkhj")
    console.log(username,email)
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    console.log("pass 1 :" + password) ; 

   const isPasswordValid = await user.isPasswordCorrect(password)

   console.log(isPasswordValid) ; 

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }  

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
        sameSite:"None"
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})

const logoutUser = asyncHandler( async(req , res) => {

    await User.findByIdAndUpdate(
        req.user._id  , 
        {
            $set : {
                refreshToken : undefined
            }   
        } , 
        {
            new : true
        }
    )
 
    const options = {
        httpOnly : true , 
        secure : true 
    } 

    return res.status(200)
    .clearCookie( "accessToken", options )
    .clearCookie("refreshToken" , options)
    .json(
        new ApiResponse( 200 , {} , "user logged out" )
    )

} )

const refreshAccessToken = asyncHandler( async (req , res) =>{

    const {refreshToken} = req.body ; 

    if(!refreshToken ){
        throw new ApiError( 401 , "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify( refreshToken ,process.env.REFRESH_TOKEN_SECRET  )
    
        const user = await User.findById(decodedToken?._id)
    
        if( !user ){
            throw new ApiError( 401 , "invalid refresh token")
        }
    
        if( refreshToken !== user.refreshToken ){
            throw new ApiError( 401 , "refresh token is expired or used")
        }
   
        const options = {
            httpOnly : true , 
            secure : true 
        } 
         const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefereshTokens(user._id);
    
        return res.status(200)
        .cookie("accessToken" ,accessToken , options )
        .cookie( "refreshToken" , newRefreshToken , options )
        .json( 
            new ApiResponse( 200 ,{user: user, accessToken, refreshToken: newRefreshToken} ,  "access token refreshed successfully" )
         )
    } catch (error) {
        throw new ApiError( 401 , error?.message || "invalid refresh token")
    }

} )

const changeCurrentPassword =asyncHandler( async (req , res) =>{
    const {oldPassword, newPassword } = req.body ; 

    const user = await User.findById(req.user?._id) ; 
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword) ; 

    if( ! isPasswordCorrect ){
        throw new ApiError( 400 , "invalid old password" )
    }

    user.password = newPassword 
     await user.save({
        validateBeforeSave : false  
    })

    return res.status(200)
    .json( 
        new ApiResponse(200 , {} , "password changes successfully"  )
     )


} )

const getCurrentUser = asyncHandler ( async (req , res) =>{
    const user = req.user
    console.log(user)
    return res.status(200).json( 
        new ApiResponse(200 , user , "current user fetched successfully")
     )
} )

const updateAccountDetails = asyncHandler( async (req , res) =>{
    const { fullName , email  } = req.body ; 

    console.log("email : " + email )

    if( !fullName || !email ){
        throw new ApiError( 400 , "all fields are required" )
    }

    const user = await User.findByIdAndUpdate(
         req.user?._id , 
         {
            $set : {
                fullName , 
                email : email 
            }
         } , 
         {new :true }
     ).select("-password")  

     return res.status(200)
     .json( 
        new ApiResponse(200 ,user , "account details updated successfully"  )
     )

} )

const updateUserAvatar = asyncHandler( async(  req , res) =>{
    const avatarLocalPath = req.file?.path
    if( ! avatarLocalPath ){
        throw new ApiError( 400 , "avater file is missing" )
    }

    const avatar = await uploadOnCloudinary( avatarLocalPath )

    if( !avatar.url ){
        throw new ApiError( 400 , "error while uploading avatar on cloudinary" )
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id , 
        {
           $set : {
               avatar : avatar.url
           }
        } , 
        {new :true }
    ).select("-password")  
    
    return res
    .json( 
       new ApiResponse(200 ,user , "avatar updated successfully"  )
    )
} )

const updateUserCoverImage = asyncHandler( async(  req , res) =>{
    const CoverImageLocalPath = req.file?.path

    if( ! CoverImageLocalPath ){
        throw new ApiError( 400 , "CoverImage file is missing" )
    }

    const CoverImage = await uploadOnCloudinary( CoverImageLocalPath )
    console.log(CoverImage)

    if( !CoverImage.url ){
        throw new ApiError( 400 , "error while uploading coverImage on cloudinary" )
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id , 
        {
           $set : {
            coverImage : CoverImage.url
           }
        } , 
        {new :true }
    ).select("-password")  
    
    return res
    .json( 
       new ApiResponse(200 ,user , "CoverImage updated successfully"  )
    )
} )

const getUserChannelProfile = asyncHandler ( async( req , res )=>{

    const {username} = req.params
    console.log(username)

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1 , 
                createdAt : 1

            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )

} )



const getWatchHistory = async (req, res, next) => {
    try {
        
        const user = await User.findById(req.user._id)
            .populate({
                path: 'watchHistory', 
                match: { isPublished: true },
                select: 'title description thumbnail duration views createdAt owner', 
                populate: {
                    path: 'owner', 
                    select: 'username avatar _id' 
                }
            })
            .select('watchHistory'); 

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        return res.status(200).json(new ApiResponse(200, user.watchHistory, "Watch history fetched successfully"));
        
    } catch (error) {
        return new ApiError( 500 , error); 
    }
};

const addVideoToWatchHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video object ID");
    }

    const isVideoInWatchHistory = req.user?.watchHistory.some(
        (id) => id.toString() === videoId
    );

    if (isVideoInWatchHistory) {
        return res.json(
            new ApiResponse(200, req.user, "Video is already in watch history")
        );
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $push: { watchHistory: videoId } },
        { new: true }
    ).select("-password");
    
    if (!user) {
        throw new ApiError(400, "Can't find user");
    }

    return res.json(
        new ApiResponse(200, user, "Video added to watch history successfully")
    );
});

export {
    registerUser , 
    loginUser , 
    logoutUser , 
    refreshAccessToken , 
    changeCurrentPassword , 
    getCurrentUser , 
    updateAccountDetails ,   
    updateUserAvatar , 
    updateUserCoverImage , 
    getUserChannelProfile , 
    getWatchHistory , 
    addVideoToWatchHistory
}

//??????????????? explain pipeline line by line

// Copilot
// Absolutely, let's take it step by step!

// $match: { _id: new mongoose.Types.ObjectId(req.user._id) }

// This filters the user documents to match the specific _id provided, effectively isolating the user whose watch history you want to retrieve.

// $lookup: { from: "videos", localField: "watchHistory", foreignField: "_id", as: "watchHistory" }

// This performs a join operation where it looks up the videos collection.

// It matches the watchHistory field of the user with the _id field in the videos collection.

// The resulting documents are stored in the watchHistory field of the user document.

// pipeline: [{ $lookup: { from: "users", localField: "owner", foreignField: "_id", as: "owner" } }, ...]

// This is an additional sub-pipeline within the watchHistory lookup.

// Here, it joins the users collection to fetch the details of the video's owner.

// pipeline: [{ $project: { fullName: 1, username: 1, avatar: 1 } }, ...]

// Within the lookup pipeline, it uses $project to include only the specified fields (fullName, username, and avatar) from the owner details.

// $addFields: { owner: { $first: "$owner" } }

// This operation modifies the owner field within each video document to contain only the first element of the array, ensuring each video has a single owner object instead of an array.

// This series of stages retrieves a user's watch history, enriches each video with its owner's details, and ensures a clean, structured output.
// It matches the watchHistory field of the user with the _id field in the videos collection.
// The resulting documents are stored in the watchHistory field of the user document.



//????????????????????? initially there is nothing in the watchhistory feild of user then what will be compared in video while lookup ??
// Good question. If the watchHistory field in the user document is initially empty, then when the lookup is performed, there won't be any matching documents in the videos collection to join. So the watchHistory field in the resulting user document will remain empty.

// Essentially, the lookup works only when there's data in the watchHistory field to compare against the _id field in the videos collection. If it's empty, there are no matches, so the field stays empty in the output as well. Kind of like trying to find keys that match an empty keyring—nothing to match with, nothing returned.





// ?????????????????>????????and are we storing the new documents in the same feilds ?? or we append the new documents in watchhistory feild ??

// In your pipeline, you are essentially transforming the existing watchHistory field of the user document. The $lookup stage replaces the watchHistory field with the matched documents from the videos collection.

// So, instead of appending new documents to the watchHistory field, you are updating it with the detailed documents retrieved through the lookup. It's a way to enrich the watchHistory with more information, not just add new items to it. The original field is replaced by the joined result, which now includes more detailed video documents along with owner info. This approach is common for creating comprehensive and detailed aggregations in MongoDB pipelines.
// The transformation keeps the field name the same but changes its content to the enriched data. Make sense?



//??????????????????????????? */ yahh but what is benifit of it beacause lets say i have 5 video id in my watchhistory initially and i am using lookup in videos then it will again give me same id of that 5 videos and will update may watchhistory , ultimatly it will remain same ..

// It might seem like an endless loop, but here’s the real magic. Your lookup is doing more than just returning the same video IDs: it’s pulling in full video documents.
// Think of it like this: Instead of just having a list of video IDs, you end up with detailed video records, complete with the video metadata and the owner's details. The end result is an enriched watchHistory where each video entry contains additional, meaningful information that you can use in your application, making it much more valuable than a simple list of IDs. So, you’re not just updating IDs, you’re enhancing the information you have.
// It's like upgrading from a basic shopping list to a detailed shopping catalog.🚀





// ??????????????????????got it , now what will be use of it ??

//  $lookup: {
//                             from: "users",
//                             localField: "owner",
//                             foreignField: "_id",
//                             as: "owner",
// Copilot
// Here’s the key: enriching the watch history with details about who owns each video.
// Fetching Owner Details: This $lookup fetches detailed information about the user (owner) who uploaded each video in the watchHistory.

// Enhancing Context: By embedding the owner's fullName, username, and avatar into the video documents, you get a richer context for each video.

// User Experience: When you display the watch history in your application, it now includes not just what videos were watched, but who created them—making the experience more informative and engaging.

// Advanced Features: With owner details included, you can add features like linking to the owner's profile, showing their avatar next to videos, or recommending more videos from the same creator.

// It’s about transforming raw data into actionable and user-friendly insights. 🚀





// ???????????????????????????so where will it be stored ?? i mean the info of owner . in watchhistory of user ?? and how ??
// Copilot
// Yup, you've got it! The info of the owner gets embedded right in the watchHistory of the user.

// Here's how it works:

// After the $lookup is performed, each video in the watchHistory array will now include a nested owner field.

// This owner field will contain the details (like fullName, username, and avatar) from the users collection.

// So, your watchHistory array in the user document will transform from something like this:

// json

// Copy
// "watchHistory": [
//     { "_id": "video1" },
//     { "_id": "video2" }
// ]
// To something more detailed like this:

// json

// Copy
// "watchHistory": [
//     {
//         "_id": "video1",
//         "owner": {
//             "fullName": "John Doe",
//             "username": "johndoe",
//             "avatar": "avatar_url"
//         }
//     },
//     {
//         "_id": "video2",
//         "owner": {
//             "fullName": "Jane Smith",
//             "username": "janesmith",
//             "avatar": "avatar_url"
//         }
//     }
// ]
// Much richer, right? Now each video in the watch history carries more context about its creator. Pretty cool how data can paint a fuller picture. 🎨





//?????????????????????????????? but you said new watchhistory will not carry only ids but info of all videos ..
// Copilot
// Exactly! The new watchHistory field won’t just store the video IDs; it will store the entire video documents that you get from the lookup. So, instead of just having plain IDs, you'll have detailed records for each video, like title, description, duration, and the owner's details, all nested within each entry of the watchHistory.

// It’s transforming a simple list of IDs into a rich collection of video records, each complete with all the meaningful context from the videos and their owners. This gives you a much more informative and interactive watch history for the user.

// No more plain IDs—just rich, detailed entries! 🎥📚





// ????????????????????????????? give me an example of new watchhistory with owner info
// Copilot
// Absolutely! Here’s what the watchHistory might look like after the pipeline enriches it with video and owner info:

// json

// Copy
// {
//   "_id": "user123",
//   "watchHistory": [
//     {
//       "_id": "video1",
//       "title": "How to Bake Bread",
//       "description": "A step-by-step guide to baking bread.",
//       "duration": "10:45",
//       "owner": {
//         "fullName": "John Doe",
//         "username": "johndoe",
//         "avatar": "avatar_url"
//       }
//     },
//     {
//       "_id": "video2",
//       "title": "Yoga for Beginners",
//       "description": "A calming yoga session for beginners.",
//       "duration": "15:30",
//       "owner": {
//         "fullName": "Jane Smith",
//         "username": "janesmith",
//         "avatar": "avatar_url"
//       }
//     }
//   ]
// }
// So instead of just having video1 and video2 IDs, the watchHistory field now includes comprehensive video details and the video owner’s details. This way, each entry is rich with context, making it way more than just a bunch of IDs. Cool, right? 🎬📚


// You
// $addFields:{
//                             owner:{
//                                 $first: "$owner"
//                             }
//                         }
//??????????????????????whay we are using $ sign before owner ??

// Copilot
// Good catch! The $ sign before owner indicates that we're referring to a field in the current document. In this case, $owner tells MongoDB to look at the owner field that was created by the previous $lookup stage.

// Without the $, MongoDB would not recognize it as a field in the document and instead interpret it as a string, causing an error. The $ symbol is crucial for correctly pointing to the fields in MongoDB aggregation pipelines.

// It's like giving directions by saying "the owner field over here" instead of just saying "owner" and leaving everyone lost. Makes sense?



// ?????????????????????and what about $first ??
// Copilot
// The $first operator is used to get the first element of an array. In your case, after the $lookup, the owner field is an array, potentially containing multiple documents.

// Using $first: "$owner" ensures that only the first element of this array is taken. So, instead of having an array of owner documents, it simplifies it to a single owner document, which is often what you need for cleaner and more straightforward data handling.

// Think of it like skimming the cream off the top of a milk bottle, keeping things smooth and efficient. 🥛

// What else? Always happy to help unravel the mysteries of code!



// ????????????????????????? req.user._id but i have already unique identifier of user , then why i am matchign again ??

// Totally get what you’re saying! You already have the user’s unique identifier (req.user._id), so it might seem redundant.
// The reason for matching again in the $match stage is that it's part of an aggregation pipeline. The pipeline needs to start with a match to ensure it works with the correct user document before performing the lookup and other operations. Think of it as filtering the data set to the user you're interested in before diving deeper. This keeps your aggregation pipeline focused and efficient.
// Basically, it’s making sure your pipeline kicks off in the right place with the exact user you need. Makes sense? What's your next coding move?

