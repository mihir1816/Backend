import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Like} from "../models/like.model.js"

const getAllTweets = async (req, res) => {
    try {
      const userId = req.user._id; // Assuming req.user is the authenticated user
  
      // Fetch tweets and populate 'owner' fields with 'username' and 'avatar', sorted by createdAt in descending order
      const tweets = await Tweet.find()
        .populate('owner', 'username avatar')
        .sort({ createdAt: -1 });
  
     
      const tweetIds = tweets.map(tweet => tweet._id);
  
      const likes = await Like.find({
        tweet: { $in: tweetIds },
        likedBy: userId
      }).select('tweet'); 
     
      const likedTweetIds = new Set(likes.map(like => like.tweet.toString()));
  
      const tweetsWithLikeStatus = tweets.map(tweet => ({
        ...tweet.toObject(),
        liked: likedTweetIds.has(tweet._id.toString())
      }));
  
      return res.status(200).json(
        new ApiResponse(200, tweetsWithLikeStatus, "All tweets fetched successfully")
      );
    } catch (error) {
      console.log("Error in fetching tweets: " + error);
      throw new ApiError(500, "Tweets could not be fetched");
    }

  };
  
  
const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const {content} = req.body ; 

    if( !content ){
        throw new ApiError( 400 , "content is required" )
    }

    const currentUser = req.user?._id
    
    if( !currentUser ){
        throw new ApiError( 400 , "invalid authorization" )
    }

    const newTweet =await Tweet.create({
        content , 
        owner : currentUser 
    })
    
    if( ! newTweet ){
        throw new ApiError( 500 , "something went wrong while making new tweet " )
    }

    return res.status(201).json(
        new ApiResponse(200 ,newTweet , "tweet generated successfully"   )
    )

})

const getUserTweets = asyncHandler(async (req, res) => {

    try {
      const userId = req.user._id; 
  
      const tweets = await Tweet.find({ owner: userId }) 
        .sort({ createdAt: -1 });
  
     
      const tweetIds = tweets.map(tweet => tweet._id);
  
      const likes = await Like.find({
        tweet: { $in: tweetIds },
        likedBy: userId
      })
      .select('tweet')
     
      const likedTweetIds = new Set(likes.map(like => like.tweet.toString()));
  
      const tweetsWithLikeStatus = tweets.map(tweet => ({
        ...tweet.toObject(),
        liked: likedTweetIds.has(tweet._id.toString())
      }));
  
      return res.status(200).json(
        new ApiResponse(200, tweetsWithLikeStatus, "All tweets fetched successfully")
      );
    } catch (error) {
      console.log("Error in fetching tweets: " + error);
      throw new ApiError(500, "Tweets could not be fetched");
    }
    
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const { newContent } = req.body 
    console.log("the new content " + newContent)
    //TODO: update tweet

    if (!isValidObjectId(tweetId)) {
        throw new ApiError( 400 , "invalid tweet object Id" )
    }
    
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Cannot find tweet by tweet Id or no valid tweet ID");
    }

    tweet.content = newContent;
    const result = await tweet.save({ validateBeforeSave: false })

    if( !result ){
        throw new ApiError( 500 , "problem while updating tweet" )
     }

    return res.status(200)
    .json( 
        new ApiResponse(200 , result , "tweet updated successfully"  )
     )

})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: delete tweet

    if (!isValidObjectId(tweetId)) {
        throw new ApiError( 400 , "invalid tweet object Id" )
    }

    try {
        const result = await Tweet.findByIdAndDelete(tweetId);
        if (result) {
          console.log("tweet deleted successfully");
        } else {
          console.log("tweet not found");
        }

        return res.status(200)
      .json( 
          new ApiResponse(200 , {} , "tweet deleted successfully"  )
       )

      } catch (err) {
        throw new ApiError( 400 , "error while deleting tweet" + err )
      }

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet , 
    getAllTweets
}
