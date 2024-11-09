import { Router } from 'express';
import {upload} from '../middlewares/multer.middleware.js'
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
    getAllvideoOfPlayList 
    
} from "../controllers/playlist.controller.js"
import {verifyJwt} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

// router.route("/").post(createPlaylist)
router.route("/").post(verifyJwt, upload.single("thumbnail"), createPlaylist)

router
    .route("/:playlistId")
    .get(getPlaylistById)
    .patch(upload.single("thumbnail") , updatePlaylist)
    .delete(deletePlaylist);

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);

router.route("/user/:userId").get(getUserPlaylists);
router.route("/user/allvideos/:playlistId").get(getAllvideoOfPlayList);
export default router