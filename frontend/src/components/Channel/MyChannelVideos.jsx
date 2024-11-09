import React, { useState } from "react";
import MyChannelEmptyVideo from "./MyChannelEmptyVideo";
import UploadVideo from "./UploadVideo";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../app/Slices/authSlice.js";
import { axiosInstance } from "../../helpers/axios.helper.js";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper.js";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";



function MyChannelVideos() {

  const user = useSelector(selectCurrentUser);
  const [isLoading, setisLoading] = useState(true)



  const [videos, setVideos] = useState(null);

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
  function formatNumber(num) {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(1) + "B"; // Convert to Billion (B)
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(1) + "M"; // Convert to Million (M)
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + "K"; // Convert to Thousand (K)
    } else {
        return num.toString(); // Less than 1000, return as is
    }
  }
  
  
  const addToHistory = async (videoId) => {
    try {
      const response = await axiosInstance.post(`https://yt-backend-lo6n.onrender.com/api/v1/users/addVideoToWatchHistory`, { videoId });
      //  toast.success(response.data.message);
    } catch (error) {
      // toast.error(parseErrorMessage(error.response.data));
      console.error("video is not added to watchhistory  :", error);
    }
  };

  const addview = async (videoId) => {
    try {
      const response = await axiosInstance.patch(`https://yt-backend-lo6n.onrender.com/api/v1/videos/add/view/${videoId}`);
      // toast.success(response.data.message);
    } catch (error) {
      const errorMessage = error.response ? error.response.data : "can not add view. Please try again...";
      // toast.error(parseErrorMessage(errorMessage));
      console.error('Error add view :', error);
    }
};
  
const renderVideo = async () => {
  try {
    const response = await axiosInstance.get(`https://yt-backend-lo6n.onrender.com/api/v1/videos/allVideosOfUser/${user?._id}`); 
    // toast.success(response.data.message); 
    console.log(response); 
    setVideos(response.data.data.result) ; 
  } catch (error) {
    // toast.error(parseErrorMessage(error.response.data));
    // setError(error.message || "Failed to fetch videos. Please try again...");
    console.error("getAllVideos dispatch error:", error);
}
};

  useEffect(() => {
    const timer = setTimeout(() => {
      renderVideo().finally(() => setisLoading(false));
    }, 300);
    return () => clearTimeout(timer); 
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 pt-4">
        <div className="w-full">
          <div className="relative mb-2 w-full pt-[56%]">
            <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
            <span className="absolute bottom-1 right-1 inline-block rounded bg-gray-800 animate-pulse w-16 h-6"></span>
          </div>
          <div className="mb-1 font-semibold bg-gray-800 animate-pulse h-6 w-full"></div>
          <div className="flex text-sm text-gray-200 bg-gray-800 animate-pulse h-4 w-full"></div>
        </div>
        <div className="w-full">
          <div className="relative mb-2 w-full pt-[56%]">
            <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
            <span className="absolute bottom-1 right-1 inline-block rounded bg-gray-800 animate-pulse w-16 h-6"></span>
          </div>
          <div className="mb-1 font-semibold bg-gray-800 animate-pulse h-6 w-full"></div>
          <div className="flex text-sm text-gray-200 bg-gray-800 animate-pulse h-4 w-full"></div>
        </div>
        <div className="w-full">
          <div className="relative mb-2 w-full pt-[56%]">
            <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
            <span className="absolute bottom-1 right-1 inline-block rounded bg-gray-800 animate-pulse w-16 h-6"></span>
          </div>
          <div className="mb-1 font-semibold bg-gray-800 animate-pulse h-6 w-full"></div>
          <div className="flex text-sm text-gray-200 bg-gray-800 animate-pulse h-4 w-full"></div>
        </div>
        <div className="w-full">
          <div className="relative mb-2 w-full pt-[56%]">
            <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
            <span className="absolute bottom-1 right-1 inline-block rounded bg-gray-800 animate-pulse w-16 h-6"></span>
          </div>
          <div className="mb-1 font-semibold bg-gray-800 animate-pulse h-6 w-full"></div>
          <div className="flex text-sm text-gray-200 bg-gray-800 animate-pulse h-4 w-full"></div>
        </div>
      </div>
    );
  }
  
  return Array.isArray(videos) && videos.length === 0 ? (
    <MyChannelEmptyVideo />
  ) : (
    <>
     <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
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
                  <img
                    src={user?.avatar}
                    alt="expresslearner"
                    className="h-full w-full rounded-full"
                  />
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
    </section>
    </>
  );
}

export default MyChannelVideos;
