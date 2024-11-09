import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const getAllVideos = asyncHandler(async (req, res) => {
  const sortBy = 'durationInSeconds', sortType = -1;

  try {
    const matchStage = {
      duration: { $gt: 15 },
      isPublished: true
    };

    const sortOptions = { [sortBy]: parseInt(sortType), createdAt: -1, title: 1, views: -1 };

   
    const result = await Video.find(matchStage)
      .sort(sortOptions)
      .populate('owner', 'username avatar') 

    
    return res.status(200).json(
      new ApiResponse(200, { docs: result }, "All videos are loaded successfully")
    );

  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Failed to load videos"));
  }
});

const getAllUserVideos = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const sortBy = 'durationInSeconds', sortType = -1;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json(new ApiError(400, "Invalid user ID"));
    }

    console.log(`Fetching videos for user: ${userId}`); 

    const matchStage = {
      owner: new mongoose.Types.ObjectId(userId),
      isPublished: true
    };

    console.log("Match stage:", matchStage); 

    const sortOptions = { [sortBy]: parseInt(sortType), createdAt: -1, title: 1, views: -1 };

    const result = await Video.find(matchStage)
      .sort(sortOptions)
      .populate('owner', 'username avatar') 

    if (!result || result.length === 0) {
      console.error("No videos found for user");  
      return res.status(404).json(new ApiError(404, "No videos found for this user"));
    }

    console.log("Found videos:", result.length); 

    const totalDocs = await Video.countDocuments(matchStage);

    console.log("Total video documents:", totalDocs); 
    console.log(result)
    return res.status(200).json(
      new ApiResponse(200, { result }, "User's videos loaded successfully")
    );

  } catch (error) {
    console.error("Error loading user's videos:", error.message);  // Log error message
    return res.status(500).json(new ApiError(500, "Failed to load user's videos"));
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  if (title?.trim() === "" || description?.trim() === "") {
    throw new ApiError(400, "title and description are required");
  }

  const videoLocalPath = req.files?.videoFile && req.files?.videoFile[0]?.path;
  const thumbnailLocalPath =
    req.files?.thumbnail && req.files?.thumbnail[0]?.path;

  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "video or thumbnail are required");
  }

  const video = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!video || !thumbnail) {
    throw new ApiError(400, "video or thumbnail is not uploded on cloudinary");
  }

  const videoOwner = req.user?._id;

  const durationInSeconds = video?.duration;

  const newVideo = await Video.create({
    videoFile: video?.url,
    thumbnail: thumbnail?.url,
    title,
    description,
    duration: durationInSeconds,
    views: 0, 
    isPublished: true,
    owner: videoOwner,
  });

  if (!newVideo) {
    throw new ApiError(500, "something went wrong while uploading video");
  }

  const createdVideo = await User.findById(newVideo._id).select("-isPublished");

  return res
    .status(201)
    .json(new ApiResponse(200, createdVideo, "video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id

  if (!isValidObjectId(videoId)) {
    throw new ApiError( 400 , "invalid video object Id" )
  }

  const searchedVideo = await Video.findById(videoId).select("-isPublished").populate('owner', 'username avatar');

  if( !searchedVideo ){
    throw new ApiError(400 , "video was not found or doesnt exist")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, searchedVideo, "video searched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  //TODO: update video details like title, description, thumbnail

  if (!isValidObjectId(videoId)) {
    throw new ApiError( 400 , "invalid video object Id" )
  }

  const searchedVideo = await Video.findById(videoId);

  if( !searchedVideo ){
    throw new ApiError(400 , "video was not found or doesnt exist")
  }

  if (title.trim() !== "") {
    searchedVideo.title = title;
  }
  if (description.trim() !== "") {
    searchedVideo.description = description;
  }
  // here can be error
  const thumbnailLocalPath = req.file?.path;
  if (thumbnailLocalPath) {
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail.url) {
      throw new ApiError(
        400,
        "error while uploading thumbnail on cloudinary during updating thumbnail"
      );
    }
    searchedVideo.thumbnail = thumbnail.url;
  }

  await searchedVideo.save({
    validateBeforeSave: false,
  });

  return res.json(
    new ApiResponse(200, searchedVideo, "video details updated successfully")
  );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError( 400 , "invalid video object Id" )
  }

  try {
    const result = await Video.findByIdAndDelete(videoId);

    if (result) {
      console.log("Video deleted successfully");
    } else {
      throw new ApiError(400, "this video doesn't exist" + err);
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "video deleted successfully"));
    

  } catch (err) {
    throw new ApiError(400, "error while deleting video" + err);
  }

});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError( 400 , "invalid video object Id" )
  }

  const searchedVideo = await Video.findById(videoId);
  if (!searchedVideo) {
    throw new ApiError(400, "invalid video id");
  }
  const videoOwner = searchedVideo?.owner;
  const currentUser = req.user?._id;

  console.log(videoOwner +  " " + currentUser ) ;; 

  if (videoOwner.toString() !== currentUser.toString() ) {
    throw new ApiError(
      400,
      "current user is not owner of this video , so user cannot change in publishification of the video"
    );
  }

  searchedVideo.isPublished = !searchedVideo.isPublished;

  await searchedVideo.save({
    validateBeforeSave: false,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, searchedVideo, "isPublish toggled successfully"));
});

const addView = asyncHandler(async (req, res) => {

  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError( 400 , "invalid video object Id" )
  }

  const searchedVideo = await Video.findById(videoId);
  if (!searchedVideo) {
    throw new ApiError(400, "invalid video id");
  }

  searchedVideo.views = searchedVideo.views + 1;

  await searchedVideo.save({
    validateBeforeSave: false,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, searchedVideo, "view added successfully"));

});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  addView , 
  getAllUserVideos
};
