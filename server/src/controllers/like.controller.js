import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"
import { User } from "../models/user.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const currentUser = req.user?._id ; 

    if (!isValidObjectId(videoId)) {
        throw new ApiError( 400 , "invalid tweet object Id" )
    }

    const alreadyLiked = await Like.findOne({
        $and: [{ likedBy: currentUser }, { video: videoId }]
    })

    if( alreadyLiked ){
        // delete that documents

        console.log( "video was liked already" )

        await Like.deleteOne( alreadyLiked );
        return res.status(201).json(
            new ApiResponse(200 ,{} , "user unLiked the video successfully")
        )

    } else {

        console.log( "video is not liked" )

        const likedDocument = await Like.create( {
            video : videoId , 
            likedBy : currentUser , 
            comment : null ,   // there was an error when i had written := (comment : "")
            tweet : null
        })

        if( !likedDocument ){
            throw new ApiError( 400 , "failed to like the video" )
        }

        return res.status(201).json(
            new ApiResponse(201 ,likedDocument , "user Liked the video successfully")
        )

    }
})

const countLikesOnVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const currentUser = req.user?._id ; 

    if (!isValidObjectId(videoId)) {
        throw new ApiError( 400 , "invalid tweet object Id" )
    }

    const alreadyLiked = await Like.findOne({
        $and: [{ likedBy: currentUser }, { video: videoId }]
    })

    const likeCount = await Like.countDocuments({ video: videoId });

    return res.status(200)
    .json({ 
        count: likeCount , 
        likeStatus : alreadyLiked ? true : false , 
     });
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    
    if (!isValidObjectId(commentId)) {
        throw new ApiError( 400 , "invalid tweet object Id" )
    }

    const currentUser = req.user?._id ; 

    const alreadyLiked = await Like.findOne({
        $and: [{ likedBy: currentUser }, { comment: commentId }]
    })

    if( alreadyLiked ){
        // delete that documents

        await Like.deleteOne( alreadyLiked );
        return res.status(201).json(
            new ApiResponse(200 ,{} , "user unLiked the comment successfully")
        )

    } else {

        const likedDocument = await Like.create( {
            comment : commentId , 
            likedBy : currentUser , 
            video : null , 
            tweet : null
        })

        if( !likedDocument ){
            throw new ApiError( 400 , "failed to like the comment" )
        }

        return res.status(201).json(
            new ApiResponse(201 ,likedDocument , "user Liked the comment successfully")
        )

    }


})

const countLikesOnComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const currentUser = req.user?._id ; 

    if (!isValidObjectId(commentId)) {
        throw new ApiError( 400 , "invalid tweet object Id" )
    }

    const alreadyLiked = await Like.findOne({
        $and: [{ likedBy: currentUser }, { comment: commentId }]
    })

    const likeCount = await Like.countDocuments({ comment: commentId });
    return res.status(200)
    .json({ 
        count: likeCount , 
        likeStatus : alreadyLiked ? true : false , 
     });

});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on twee
    if (!isValidObjectId(tweetId)) {
        throw new ApiError( 400 , "invalid tweet object Id" )
    }

    const currentUser = req.user?._id ; 

    const alreadyLiked = await Like.findOne({
        $and: [{ likedBy: currentUser }, { tweet: tweetId }]
    })

    if( alreadyLiked ){
        // delete that documents

        await Like.deleteOne( alreadyLiked );
        return res.status(201).json(
            new ApiResponse(200 ,{} , "user unLiked the video successfully")
        )

    } else {

        const likedDocument = await Like.create( {
            tweet : tweetId , 
            likedBy : currentUser , 
            video : null , 
            comment : null
        })

        if( !likedDocument ){
            throw new ApiError( 400 , "failed to like the tweet" )
        }

        return res.status(201).json(
            new ApiResponse(201 ,likedDocument , "user Liked the tweetId successfully")
        )

    }
}
)

const countLikesOnTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    const currentUser = req.user?._id ; 

    if (!isValidObjectId(tweetId)) {
        throw new ApiError( 400 , "invalid tweet object Id" )
    }

    const alreadyLiked = await Like.findOne({
        $and: [{ likedBy: currentUser }, { tweet: tweetId }]
    })

    const likeCount = await Like.countDocuments({ tweet: tweetId });
    return res.status(200)
    .json({ 
        count: likeCount , 
        likeStatus : alreadyLiked ? true : false , 
     });
});

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const currentUser = req.user?._id;

    try {
      const likedVD = await Like.find({
        likedBy: currentUser,
        video: { $ne: null } 
      })
      .populate({
        path: 'video',
        match: { isPublished: true }, // Populate the `video` field with the video details
        select: '_id videoFile thumbnail title description duration views createdAt', // Select the video fields you want
        populate: {
          path: 'owner', // Assuming the video schema has an `uploadedBy` field for the user
          select: 'username avatar', // Select user fields like `username` and `avatar`
        }
      })
      .lean(); // Use `lean` to return plain JavaScript objects
    
      console.log(JSON.stringify(likedVD, null, 2)); // Debugging output
    
      return res.status(200).json(
        new ApiResponse(
          200,
          likedVD,
          "Liked videos fetched successfully"
        )
      );
    } catch (error) {
      console.error(error);
      return res.status(500).json(
        new ApiError(500, "Something went wrong while fetching liked videos")
      );
    }

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos , 
    countLikesOnVideo , 
    countLikesOnTweet , 
    countLikesOnComment
}