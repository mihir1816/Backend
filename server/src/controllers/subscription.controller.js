import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import {Subscription} from "../models/subscription.model.js" 
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {

    const {channelId} = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError( 400 , "invalid channel object Id" )
    }
    
    const currentUser = req.user?._id ; 
    // TODO: toggle subscription

    const alreadySubscribed = await Subscription.findOne({
        $and: [{ subscriber: currentUser }, { channel: channelId }]
    })

    if( alreadySubscribed ){
        // delete that documents

         await Subscription.deleteOne( alreadySubscribed );
        
        return res.status(201).json(
            new ApiResponse(200 ,{} , "user unsubscribed the channel successfully")
        )

    } else {

        const sunscribeDocument = await Subscription.create( {
            subscriber : currentUser , 
            channel : channelId
        })

        if( !sunscribeDocument ){
            throw new ApiError( 400 , "failed to subscribe the channel" )
        }

        return res.status(201).json(
            new ApiResponse(201 ,sunscribeDocument , "user subscribed the channel successfully")
        )

    }

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel object Id");
    }

    const SubscribeToList = await Subscription.find({ channel: channelId })
        .populate('subscriber', 'avatar username')
        .exec();

    if (!SubscribeToList || SubscribeToList.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "User has not subscribed to any channel")
        );
    }

    const subscribersWithCountAndStatus = await Promise.all(
        SubscribeToList.map(async (subscription) => {
            const subscriber = subscription.subscriber;

            const subscriberCount = await Subscription.countDocuments({ channel: subscriber._id });

            const subStatus = await Subscription.findOne({
                subscriber: channelId,
                channel: subscriber._id
            });

            return {
                subscriberId: subscriber._id,
                username: subscriber.username,
                avatar: subscriber.avatar,
                subscriberCount,
                isSubscribedByMe: !!subStatus
            };
        })
    );

    return res.status(200).json(
        new ApiResponse(200, subscribersWithCountAndStatus, "List of subscribers fetched successfully")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid channel object Id");
    }

    const subscribedChannels = await Subscription.find({ subscriber: subscriberId })
        .populate('channel', 'avatar username') 
        .exec();

    if (!subscribedChannels || subscribedChannels.length === 0) {
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                [],
                "user has not subscribed any channel"
            )
        );
    }
    
    const channelsWithSubscriberCount = await Promise.all(
        subscribedChannels.map(async (subscription) => {
            const channel = subscription.channel;

            const subscriberCount = await Subscription.countDocuments({ channel: channel._id });
            return {
                channelId: channel._id,
                username: channel.username,
                avatar: channel.avatar,
                subscriberCount,  
            };
        })
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                channelsWithSubscriberCount,
                "List of channels which user has subscribed fetched successfully"
            )
        );
});


const getsubscribeStatus = asyncHandler(async (req, res) => {
    const userId = req.user._id;  
    const { channelId } = req.body; 
         
        const subscription = await Subscription.findOne({
            subscriber: userId,
            channel: channelId
        });

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {alreadySubscribed : subscription ? true : false} ,
                "channel subscription status fetched successfully"
            )
        )  
    
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels ,
    getsubscribeStatus
}