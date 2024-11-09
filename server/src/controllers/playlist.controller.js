import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from '../models/video.model.js'
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const owner = req.user?._id ; 
    //TODO: create playlist

    if( !name ){
        throw new ApiError( 400 , "name are required" )
    }   

    const existedPlayList = await Playlist.findOne( {
        name 
    } )

    if( existedPlayList ){
        throw new ApiError( 409 ,"playlist with name is already exist" )
    }

    const thumbnailLocalPath = req.file?.path ; 
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    const newPlaylist = await Playlist.create( {
        name , 
        description : description || "", 
        owner , 
        thumbnail: thumbnail?.url || "", 
    })

    if( !newPlaylist ){
        throw new ApiError( 500 , "error while creating playlist" )
    }

    return res.status(201).json(
        new ApiResponse(200 ,newPlaylist , "playList created successfully"   )
    )

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if (!isValidObjectId(userId)) {
        throw new ApiError( 400 , "invalid playlist object Id" )
    }

    const userPlayLists = await Playlist.find({
        owner: userId
    })

    return res.status(201).json(
        new ApiResponse(200 , userPlayLists , "playlists of user fetched successfully"   )
    )

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if (!isValidObjectId(playlistId)) {
        throw new ApiError( 400 , "invalid playlist object Id" )
    }

    const getPlayList = await Playlist.findById( playlistId )

    if( !getPlayList ){
        throw new ApiError( 400 , "there is no playlist exist with this id OR error while finding playlist" )
    }

    return res.status(201).json(
        new ApiResponse(200 ,getPlayList , "playList found successfully"   )
    )

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError( 400 , "invalid playlist object Id" )
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError( 400 , "invalid video object Id" )
    }

    const videoAlreadyAvialableInPlaylist = await Playlist.findOne({
        _id: playlistId,
        videos: videoId
    })

    if( videoAlreadyAvialableInPlaylist ){
        return res.status(200).json(
            new ApiResponse(200 ,{} , "video is already avialable in playlist successfully"   )
        )
    }

    const video = await Video.findById(videoId);

    if (!video) { 
      throw new ApiError(400 , 'Video not found');
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { 
            $push: { videos: videoId }
        },
        { 
            new: true
        }  // Returns the updated document
    )

    if (!updatedPlaylist) {
        throw new Error(400 , 'Playlist not found');
    }

    return res.status(200).json(
        new ApiResponse(200 ,updatedPlaylist , "video added to playlist successfully"   )
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError( 400 , "invalid playlist object Id" )
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError( 400 , "invalid video object Id" )
    }
    
    const video = await Video.findById(videoId);
    if (!video) {
      throw new Error('Video not found');
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { 
            $pull: { videos: videoId }
        },
        { 
            new: true
        }  // Returns the updated document
    )

    if (!updatedPlaylist) {
        throw new Error(400 , 'Playlist not found');
    }

    return res.status(200).json(
        new ApiResponse(200 ,updatedPlaylist , "video removed to playlist successfully"   )
    )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError( 400 , "invalid playlist object Id" )
    }

    const getPlayList = await Playlist.findByIdAndDelete( playlistId )

    if( ! getPlayList ){
        throw new ApiError( 500 , "error while deleting playlistId" )
    }

    return res.status(201).json(
        new ApiResponse(200 ,{} , "playlist deleted successfully")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError( 400 , "invalid playlist object Id" )
    }

    const searchedPlaylist = await Playlist.findById(playlistId);

    if( !searchedPlaylist ){
        throw new ApiError( 400 , "there is no playlist exist with this id " )
    }

    if (name.trim() !== "") {
        searchedPlaylist.name = name;
    }
    if (description.trim() !== "") {
        searchedPlaylist.description = description;
    }

    const thumbnailLocalPath = req.file?.path;
    if (thumbnailLocalPath) {
      const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
      if (!thumbnail.url) {
        throw new ApiError(
          400,
          "error while uploading thumbnail on cloudinary during updating thumbnail"
        );
      }
      searchedPlaylist.thumbnail = thumbnail.url;
    }

    await searchedPlaylist.save({
        validationBeforeSave : false 
    })

    return res.status(200).json(
        new ApiResponse(200 ,searchedPlaylist , "playlist updated successfully"   )
    )

})

const getAllvideoOfPlayList = asyncHandler(async (req, res) => {
    
    const {playlistId} = req.params ; 

    if (!isValidObjectId(playlistId)) {
        throw new ApiError( 400 , "invalid playlist object Id" )
    }

    const playlist = await Playlist.findById(playlistId)
      .populate({
        path: 'videos',  
        populate: {
          path: 'owner',  
          select: 'username avatar _id',  
        },
      })
      .exec();

      return res.status(200).json(
        new ApiResponse(200 , playlist , "playlist updated successfully"   )
    )   
    
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist ,
    getAllvideoOfPlayList 
}
