import { Router } from "express";
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    addView , 
    getAllUserVideos
} from "../controllers/video.controller.js"
import {verifyJwt} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
router.use(verifyJwt); 

router
    .route("/")
    .get((req, res, next) => {
        console.log("get all videos fun has been called...");
        next();  
    }, getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);
    
router.route("/allVideosOfUser/:userId").get(getAllUserVideos); 

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
router.route("/add/view/:videoId").patch(addView);

export default router