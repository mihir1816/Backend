import mongoose , {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { Tweet } from "../models/tweet.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const channelId = req.user?._id ; 

    const channelOwner =await User.findOne( channelId )
    if( !channelOwner ){
        throw new ApiError( 400 ,"invalid channel id or owner deednt exist" )
    }

        let totalSubscribers ; 
        try {
          const allSubscribers = await Subscription.find({
            channel: channelId,
          });
      
           totalSubscribers = allSubscribers.length;
      
          console.log('total sun : ' + totalSubscribers);
          console.log('sub list', allSubscribers);
        } catch (error) {
          console.error('Error fetching subscribers:', error);
        }

    const allVideos = await Video.find({
        owner : channelId 
    })

    let totalVideos = allVideos.length 

    let totalViews = 0 ; 
    allVideos.forEach((element) => (
        totalViews = totalViews + element.views
    ));

    let totalLikesOnVideos = 0;
    for (const element of allVideos) {
        const likesOnThisVideo = await Like.find({
            video: element._id
        });
        totalLikesOnVideos += likesOnThisVideo.length;
    }

console.log('Total likes on videos:', totalLikesOnVideos);


    const allTweets = await Tweet.find({
        owner : channelId 
    })
    let totalLikesOnTweet = 0;
    for (const element of allTweets) {
        const likesOnThisTweet = await Like.find({
            tweet: element._id
        });
        totalLikesOnTweet += likesOnThisTweet.length;
    }
    console.log('Total likes on tweets:', totalLikesOnTweet);
    
    
    let totalLikesOnChannel = totalLikesOnTweet + totalLikesOnVideos ; 

    return res.status(200).json(
        new ApiResponse(200 ,
            {
                totalSubscribers , 
                totalVideos , 
                totalLikesOnChannel , 
                totalLikesOnTweet , 
                totalLikesOnVideos ,
                totalViews 
            } ,
             "channel states has been generated"
       )
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const channelId = req.user?._id ; 

    const channelOwner =await User.findOne( channelId )

    if( !channelOwner ){
        throw new ApiError( 400 ,"invalid channel id" )
    }

    const allVideos = await Video.aggregate([
        { 
          $match: { owner: channelId } 
        },
        {
          $lookup: {
            from: "likes", 
            localField: "_id", 
            foreignField: "video", 
            as: "likes" 
          }
        },
        {
          $addFields: {
            totalLikes: { $size: "$likes" }
          }
        }
      ]);

    return res.status(201).json(
        new ApiResponse(200 ,allVideos , "all videos fetched successfully"   )
    )

})

export {
    getChannelStats,
    getChannelVideos
}