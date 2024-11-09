import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideos, selectCurrentVideos } from "../../app/Slices/videoSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { axiosInstance } from "../../helpers/axios.helper";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import EmptyVideo from "./EmptyVideo";


function VideoGrid() {

  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [videos, setVideos] = useState(null)
  const [isLoading, setisLoading] = useState(true)


  useEffect(() => {
    const renderVideo = async () => {
      try {
        const response = await axiosInstance.get(`https://yt-backend-lo6n.onrender.com/api/v1/videos`);
        console.log(response);
        setVideos(response.data.data.docs);
      } catch (error) {
        toast.error(parseErrorMessage(error.response.data));
        setError(error.message || "Failed to fetch videos. Please try again...");
        console.error("getAllVideos dispatch error:", error);
      }
    }; 
    const timer = setTimeout(() => {
      renderVideo().finally(() => setisLoading(false));
    }, 300); 
    return () => clearTimeout(timer); 
  }, [dispatch]);
  

   const addToHistory = async (videoId) => {
    try {
      const response = await axiosInstance.post(`https://yt-backend-lo6n.onrender.com/api/v1/users/addVideoToWatchHistory`, { videoId });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      setError(
        error.message || "Failed to add video to watchhistory. Please try again..."
      );
      console.error("video is not added to watchhistory  :", error);
    }
  };


  const addview = async (videoId) => {
    try {
      const response = await axiosInstance.patch(`https://yt-backend-lo6n.onrender.com/api/v1/videos/add/view/${videoId}`);
      // toast.success(response.data.message);
    } catch (error) {
      const errorMessage = error.response ? error.response.data : "can not add view. Please try again...";
      toast.error(parseErrorMessage(errorMessage));
      console.error('Error add view :', error);
    }
};
  

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const timeSince = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;

    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;

    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;

    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;

    return `${Math.floor(seconds)} seconds ago`;
  };

  if (isLoading) {
    return (
      <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4 ">
          <div className="w-full rounded">
            <div className="relative mb-1 w-full pt-[50%]">
              <div className="absolute inset-0 bg-slate-100/10 rounded animate-pulse"></div>
            </div>
            <div className="mb-1 rounded bg-slate-100/10 animate-pulse h-8 w-full"></div>
            <div className="flex rounded text-gray-200 bg-slate-100/10 animate-pulse h-5 w-full"></div>
          </div>
          <div className="w-full rounded">
            <div className="relative mb-1 w-full pt-[50%]">
              <div className="absolute inset-0 bg-slate-100/10 rounded animate-pulse"></div>
            </div>
            <div className="mb-1 rounded bg-slate-100/10 animate-pulse h-8 w-full"></div>
            <div className="flex rounded text-gray-200 bg-slate-100/10 animate-pulse h-5 w-full"></div>
          </div>
          <div className="w-full rounded">
            <div className="relative mb-1 w-full pt-[50%]">
              <div className="absolute inset-0 bg-slate-100/10 rounded animate-pulse"></div>
            </div>
            <div className="mb-1 rounded bg-slate-100/10 animate-pulse h-8 w-full"></div>
            <div className="flex rounded text-gray-200 bg-slate-100/10 animate-pulse h-5 w-full"></div>
          </div>
          <div className="w-full rounded">
            <div className="relative mb-1 w-full pt-[50%]">
              <div className="absolute inset-0 bg-slate-100/10 rounded animate-pulse"></div>
            </div>
            <div className="mb-1 rounded bg-slate-100/10 animate-pulse h-8 w-full"></div>
            <div className="flex rounded text-gray-200 bg-slate-100/10 animate-pulse h-5 w-full"></div>
          </div>
          <div className="w-full rounded">
            <div className="relative mb-1 w-full pt-[50%]">
              <div className="absolute inset-0 bg-slate-100/10 rounded animate-pulse"></div>
            </div>
            <div className="mb-1 rounded bg-slate-100/10 animate-pulse h-8 w-full"></div>
            <div className="flex rounded text-gray-200 bg-slate-100/10 animate-pulse h-5 w-full"></div>
          </div>
          <div className="w-full rounded">
            <div className="relative mb-1 w-full pt-[50%]">
              <div className="absolute inset-0 bg-slate-100/10 rounded animate-pulse"></div>
            </div>
            <div className="mb-1 rounded bg-slate-100/10 animate-pulse h-8 w-full"></div>
            <div className="flex rounded text-gray-200 bg-slate-100/10 animate-pulse h-5 w-full"></div>
          </div>
          <div className="w-full rounded">
            <div className="relative mb-1 w-full pt-[50%]">
              <div className="absolute inset-0 bg-slate-100/10 rounded animate-pulse"></div>
            </div>
            <div className="mb-1 rounded bg-slate-100/10 animate-pulse h-8 w-full"></div>
            <div className="flex rounded text-gray-200 bg-slate-100/10 animate-pulse h-5 w-full"></div>
          </div>
          <div className="w-full rounded">
            <div className="relative mb-1 w-full pt-[50%]">
              <div className="absolute inset-0 bg-slate-100/10 rounded animate-pulse"></div>
            </div>
            <div className="mb-1 rounded bg-slate-100/10 animate-pulse h-8 w-full"></div>
            <div className="flex rounded text-gray-200 bg-slate-100/10 animate-pulse h-5 w-full"></div>
          </div>
          <div className="w-full rounded">
            <div className="relative mb-1 w-full pt-[50%]">
              <div className="absolute inset-0 bg-slate-100/10 rounded animate-pulse"></div>
            </div>
            <div className="mb-1 rounded bg-slate-100/10 animate-pulse h-8 w-full"></div>
            <div className="flex rounded text-gray-200 bg-slate-100/10 animate-pulse h-5 w-full"></div>
          </div>
          <div className="w-full rounded">
            <div className="relative mb-1 w-full pt-[50%]">
              <div className="absolute inset-0 bg-slate-100/10 rounded animate-pulse"></div>
            </div>
            <div className="mb-1 rounded bg-slate-100/10 animate-pulse h-8 w-full"></div>
            <div className="flex rounded text-gray-200 bg-slate-100/10 animate-pulse h-5 w-full"></div>
          </div>
          <div className="w-full rounded">
            <div className="relative mb-1 w-full pt-[50%]">
              <div className="absolute inset-0 bg-slate-100/10 rounded animate-pulse"></div>
            </div>
            <div className="mb-1 rounded bg-slate-100/10 animate-pulse h-8 w-full"></div>
            <div className="flex rounded text-gray-200 bg-slate-100/10 animate-pulse h-5 w-full"></div>
          </div>
          <div className="w-full rounded">
            <div className="relative mb-1 w-full pt-[50%]">
              <div className="absolute inset-0 bg-slate-100/10 rounded animate-pulse"></div>
            </div>
            <div className="mb-1 rounded bg-slate-100/10 animate-pulse h-8 w-full"></div>
            <div className="flex rounded text-gray-200 bg-slate-100/10 animate-pulse h-5 w-full"></div>
          </div>
        </div>
      </section>
    );
  }


  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      {error && <p>{error}</p>}
      {Array.isArray(videos) && videos.length === 0 ? 
        <EmptyVideo/>
      : 
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4 ">
      {
      Array.isArray(videos) &&
        videos.map((video) => (
          <div className="w-full" key={video._id}>

          <NavLink to={`/video/${video._id}`}>
            <div 
            onClick={() => {  
              addview(video._id);
              addToHistory(video._id); 
          }}
            className="relative mb-2 w-full pt-[56%] ">
              <div className="absolute inset-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-full w-full"
                />
              </div>
              <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                {formatDuration(video.duration)}
              </span>
            </div>
          </NavLink>

            <div className="flex gap-x-2">
              <div className="h-10 w-10 shrink-0">
              <NavLink to={`/user/${video.owner.username}/${video.owner._id}`}>
                <img
                  src={video.owner.avatar}
                  alt="expresslearner"
                  className="h-full w-full rounded-full"
                />
                </NavLink>
              </div>
              <div className="w-full">
                <h6 className="mb-1 font-semibold">{video.title}</h6>
                <p className="flex text-sm text-gray-200">
                  {video.views} Views · {timeSince(new Date(video.createdAt))}
                </p>
                <p className="text-sm text-gray-200">{video.owner.username}</p>
              </div>
            </div>

          </div>
        ))}
        
        </div>
      }

      
    </section>
  );
}

export default VideoGrid;
