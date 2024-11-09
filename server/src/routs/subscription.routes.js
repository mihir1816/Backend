import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
    getsubscribeStatus
} from "../controllers/subscription.controller.js"
import {verifyJwt} from "../middlewares/auth.middleware.js"

const router = Router(); 
router.use(verifyJwt);   // Apply verifyJWT middleware to all routes in this file

router.route("/c/:channelId").get(getUserChannelSubscribers)
    
router.route("/t/:channelId").post(toggleSubscription);

router.route("/u/:subscriberId").get(getSubscribedChannels);
router.route("/subStatus").post(getsubscribeStatus);

export default router 

