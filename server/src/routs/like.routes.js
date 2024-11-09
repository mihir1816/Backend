import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    countLikesOnVideo , 
    countLikesOnTweet , 
    countLikesOnComment
} from "../controllers/like.controller.js"
import {verifyJwt} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);
router.route("/likecount/v/:videoId").get(countLikesOnVideo);
router.route("/likecount/c/:commentId").get(countLikesOnComment);
router.route("/likecount/t/:tweetId").get(countLikesOnTweet);

export default router

