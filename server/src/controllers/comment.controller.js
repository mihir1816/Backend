import mongoose , {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


// error
const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 100 } = req.query; // Default page 1 and limit 2

  // Check if videoId is a valid MongoDB ObjectId
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video object Id");
  }

  try {
    const aggregationQuery = Comment.aggregate([
      {
        $match: {
          video: new mongoose.Types.ObjectId(videoId), // Match comments for the given video
        },
      },
      {
        $sort: {
          createdAt: -1, // Sort by most recent comments
        },
      },
      // Lookup user information
      {
        $lookup: {
          from: "users", // Collection name of the users
          localField: "owner", // Field in the Comment collection to join on (assuming `owner` is the user id)
          foreignField: "_id", // Field in the User collection (primary key)
          as: "ownerInfo", // Alias for the joined information
        },
      },
      {
        $unwind: "$ownerInfo", // Unwind the array to access user info as an object
      },
      {
        $project: {
          content: 1,
          createdAt: 1,
          // Include only necessary fields from user
          "ownerInfo.username": 1,
          "ownerInfo.avatar": 1,
          "ownerInfo.fullName": 1,
        },
      },
    ]);

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    // Use aggregation pagination
    const result = await Comment.aggregatePaginate(aggregationQuery, options);

    return res.status(200).json(
      new ApiResponse(200, result, "All comments are loaded successfully")
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(new ApiError(500, "Failed to load comments"));
  }
});


// const getVideoComments = async (req, res) => {
//     try {
//       const { videoId } = req.params; // Assuming you get the videoId from the request parameters
  
//       const comments = await Comment.find({ video: videoId }).populate('owner', 'username avatar');
  
//       return res.status(200).json(
//         new ApiResponse(200, comments, "All comments fetched successfully")
//       );
//     } catch (error) {
//       console.error("Error fetching comments:", error); // Use console.error for better error logging
//       return res.status(500).json(new ApiError(500, "Comments are not fetched"));
//     }
//   };
  
  

const addComment = asyncHandler(async (req, res) => {

    // TODO: add a comment to a video
    const {commentContent} = req.body
    const {videoId} = req.params ; 
    const userId = req.user?._id ;

    if (!isValidObjectId(videoId)) {
        throw new ApiError( 400 , "invalid tweet object Id" )
    }  

    if( !commentContent ){
        throw new ApiError(400 , "comment content is required"  )
    }

    if( !videoId?.trim() || !userId ){
        throw new ApiError( 400 , "invalid video id or invalid user" )
    }

    const newComment = await Comment.create({
        content : commentContent , 
        video : videoId , 
        owner : userId
    })

    if( ! newComment ){
        throw new ApiError( 500 , "something went wrong while adding new comment" )
    }

    return res.status(200).json(
        new ApiResponse(200 , newComment , "comment added successfully"   )
    )
    
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    const {commentId} = req.params ;
   
    if (!isValidObjectId(commentId)) {
        throw new ApiError( 400 , "invalid tweet object Id" )
    }

    const { newContent } = req.body ;

    if( ! newContent ){
        new ApiError( 400 , "content required to update comment" )
    }

    const updatedComment = await Comment.findByIdAndUpdate( 
        commentId , 
        {
            $set : {
                content : newContent
            }
        } , 
        {
            new : true
        }
     )

     return res.status(200)
     .json( 
        new ApiResponse(200 ,updatedComment.toObject() , "comment content updated successfully"  )
     )

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const {commentId} = req.params ;
    
    if (!isValidObjectId(commentId)) {
        throw new ApiError( 400 , "invalid tweet object Id" )
    }

    const result = await Comment.findByIdAndDelete( commentId ) ; 

    console.log(result) ;

    if( ! result ){
        new ApiError( 500 , "error while deleting comment" )
    }

    return res.status(200).json(
        new ApiResponse(200 , {} , "comment deleted successfully"   )
    )

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
