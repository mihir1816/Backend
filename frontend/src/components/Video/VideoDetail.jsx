import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { axiosInstance } from "../../helpers/axios.helper";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import SaveToPlayList from "../Playlist/SaveToPlayList";

function VideoDetail() {



  const location = useLocation();
  const path = location.pathname;
  const videoId = path.split("/").pop();

  const [playingVideo, setPlayingVideo] = useState(null);
  const [ownerId, setOwnerId] = useState(null);
  
  // For number of subscribers of user
  const [noOfSubscribers, setNoOfSubscribers] = useState(510);
  
  
  // Function to fetch number of subscribers
  const fetchNoOfSub = async () => {
    try {
      if (!ownerId) {
        console.error("Owner ID is not available.");
        return;
      }
      const response = await axiosInstance.get(`https://yt-backend-lo6n.onrender.com/api/v1/subscriptions/c/${ownerId}`);
      setNoOfSubscribers(response.data.data.length);
      // toast.success(response.data.message);
    } catch (error) {
      toast.error(parseErrorMessage(error?.response?.data));
      console.error("Error fetching sub list and count data:", error);
    }
  };
  
  // Function to fetch video data and ownerId
  const fetchVideoData = async () => {
    try {
      const response = await axiosInstance.get(`https://yt-backend-lo6n.onrender.com/api/v1/videos/${videoId}`);
      setPlayingVideo(response.data.data);
      setOwnerId(response?.data?.data?.owner?._id);
      // toast.success(response.data.message);
    } catch (error) {
      // toast.error(parseErrorMessage(error.response.data));
      console.error("Error fetching video data:", error);
    }
  };

  //for adding view
  const addview = async (videoId) => {
    try {
      const response = await axiosInstance.patch(`https://yt-backend-lo6n.onrender.com/api/v1/videos/add/view/${videoId}`);   
      // toast.success(response.data.message);   
      await renderVideo() ;  
    } catch (error) {
      const errorMessage = error.response ? error.response.data : "can not add view. Please try again...";
      // toast.error(parseErrorMessage(errorMessage));
      console.error('Error add view :', error);
    }
  };

  // to add to watch history
  const addToHistory = async (videoId) => {
    try {
      const response = await axiosInstance.post(`https://yt-backend-lo6n.onrender.com/api/v1/users/addVideoToWatchHistory`, { videoId });
      // toast.success(response.data.message);
    } catch (error) {
      // toast.error(parseErrorMessage(error.response.data));
      setError(
        error.message || "Failed to add video to watchhistory. Please try again..."
      );
      console.error("video is not added to watchhistory  :", error);
    }
  };

  
   // For subscription status
   const [subStatus, setSubStatus] = useState(true);
  const fetchSubStatus = async () => {
    try {
      const response = await axiosInstance.post(`https://yt-backend-lo6n.onrender.com/api/v1/subscriptions/subStatus`, {
        channelId: ownerId 
      });
      setSubStatus(response.data.data.alreadySubscribed); 
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error fetching subscription status';
      // toast.error(errorMessage);
      console.error("Error fetching subscription status:", error);
    }
  };
  useEffect(() => {
    if(ownerId){
      fetchSubStatus() ;
    }
  }, [])

  
  
  // Function to toggle subscription
  const toggleSub = async () => {
    try {
      const response = await axiosInstance.post(`https://yt-backend-lo6n.onrender.com/api/v1/subscriptions/t/${ownerId}`);
      await fetchSubStatus() ;
      await fetchNoOfSub();
      toast.success(response.data.message);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Unable to toggle subscription. Please try again.';
      toast.error(errorMessage);
      console.error("Error toggling subscription:", error);
    }
  };
  
  // useEffect to fetch video data and add view
  useEffect(() => {
    const updateVideoDataAndAddView = async () => {
      try {
        await addview(videoId);
        await addToHistory(videoId) ; 
        await fetchVideoData(); 
      } catch (error) {
        console.error("Error updating video data or adding view:", error);
      }
    };
    updateVideoDataAndAddView();
  }, [videoId]);
  
  
  useEffect(() => {
    if (ownerId) {
      fetchNoOfSub();  
      fetchSubStatus();  
    }
  }, [ownerId]);  

      

  // for side videos 
  const [videos, setVideos] = useState(null);
  const renderVideo = async () => {
    try {
      const response = await axiosInstance.get(`https://yt-backend-lo6n.onrender.com/api/v1/videos`);
      // toast.success(response.data.message);
      setVideos(response.data.data.docs);
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      setError(
        error.message || "Failed to fetch videos. Please try again..."
      );
      console.error("side videos are not fetched :", error);
    }
  };
  useEffect(() => {
    renderVideo();
  }, [videoId]);

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

 

  // to add comment on video 
      const [newComment, setNewComment] = useState("");
      const [allComments, setAllComments] = useState(null);
      const [noOfComment, setNoOfComment] = useState(0);
      // Function to load all comments for the video
      const renderComments = async () => {
        try {
          const response = await axiosInstance.get(`https://yt-backend-lo6n.onrender.com/api/v1/comments/${videoId}`);
          toast.success(response.data.message);
          console.log(response);
          setAllComments(response.data.data.docs);
          setNoOfComment(response.data.data.docs.length);
        } catch (error) {
          toast.error(parseErrorMessage(error.response.data));
          setError(error.message || "Failed to fetch all comments on videos. Please try again...");
        }
      };

  // Add comment function
      const addComment = async () => {
        if (newComment.trim()) {
          try {
            console.log("Creating comment with data: " + newComment);
            const response = await axiosInstance.post(`https://yt-backend-lo6n.onrender.com/api/v1/comments/${videoId}`, { commentContent: newComment });
            // toast.success(response.data.message);
            // Refresh comments after adding a new one
            await renderComments(); // Call renderComments to refresh the list
            console.log(response);
            setNewComment("");
          } catch (error) {
            const errorMessage = error.response ? error.response.data : "Failed to post comment. Please try again...";
            toast.error(parseErrorMessage(errorMessage));
            console.error('Error posting comment:', error);
          }
        } else {
          toast.error("Add some text to comment");
        }
      }; 
      useEffect(() => {    // Load comments on component mount or when videoId changes
        renderComments(); // Initial load of comments
      }, [videoId]);


      // for like count 

      const [noOfLikes, setNoOfLikes] = useState(0)
      const [likeStatus, setLikeStatus] = useState(false)
      const fetchnoOfLikes= async () => {
        try {
          const response = await axiosInstance.get(`https://yt-backend-lo6n.onrender.com/api/v1/likes/likecount/v/${videoId}`);
          // toast.success(response.data.message);
          console.log(response); 
          setNoOfLikes(response.data.count); 
          setLikeStatus(response.data.likeStatus) ; 
        } catch (error) {
          toast.error(parseErrorMessage(error.response.data)); 
          console.error("Error fetching sub list and count data:", error);
        }
      };
      const toggleLike = async () => {
          try {
            const response = await axiosInstance.post(`https://yt-backend-lo6n.onrender.com/api/v1/likes/toggle/v/${videoId}`);
            await fetchnoOfLikes()
            // toast.success(response.data.message);
          } catch (error) {
            const errorMessage = error.response ? error.response.data : "can not toggle like. Please try again...";
            toast.error(parseErrorMessage(errorMessage));
            console.error('Error posting comment:', error);
          }
      };
      useEffect(() => {
        fetchnoOfLikes();
      }, [videoId]);

       // for playlist 
        const [isSaveModalOpen, setSaveModalOpen] = useState(false);
        const [videoIdToAdd, setVideoIdToAdd] = useState(null);

        const openSaveModal = (videoId) => {
          setVideoIdToAdd(videoId); 
          setSaveModalOpen(true);
        };

        const closeSaveModal = () => {
          setSaveModalOpen(false); 
          setVideoIdToAdd(null); 
        };

        if (!allComments || !playingVideo || !videos )
          return (
            <section className="w-full pb-[70px] sm:pb-0">
              {/* sm:ml-[70px] */}
              <div className="flex w-full flex-wrap gap-4 p-4 lg:flex-nowrap">
                <div className="col-span-12 w-full">
                  {/* video */}
                  <div className="relative mb-4 w-full pt-[56%]">
                    <div className="absolute inset-0">
                      <div className="size-full bg-slate-100/10 rounded animate-pulse"></div>
                    </div>
                  </div>
      
                  {/* video, Playlist, Like and owner data */}
                  <div
                    className="group mb-4 w-full rounded-lg border p-4 duration-200 hover:bg-white/5 focus:bg-white/5"
                    role="button"
                    tabIndex="0"
                  >
                    <div className="flex flex-wrap gap-y-2">
                      {/* video metadata */}
                      <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                        <h1 className=" w-full h-9 text-transparent bg-slate-100/10 rounded animate-pulse"></h1>
                        <h1 className=" w-1/2 h-5 mt-3 text-transparent bg-slate-100/10 rounded animate-pulse"></h1>
                      </div>
                      {/* Like and playlist component */}
                      <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                        <div className="flex items-center justify-between gap-x-4 md:justify-end lg:justify-between xl:justify-end">
                          <div className="relative block">
                            <div className="peer flex w-32 h-10 items-center gap-x-2 px-4 py-1.5 text-transparent bg-slate-100/10 rounded animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>                
                    <hr className="my-4 border-white" />
                  </div>

                </div>
                {/* side video suggegtions */}
                <div className="col-span-12 flex w-full shrink-0 flex-col gap-3 lg:w-[350px] xl:w-[400px]">
                  <div className="w-full gap-x-2 border pr-2 md:flex">
                    <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                      <div className="w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <div className="bg-slate-100/10 rounded animate-pulse h-full w-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                      <div className="h-12 w-12 shrink-0 md:hidden">
                        <div className="bg-slate-100/10 animate-pulse h-full w-full rounded-full"></div>
                      </div>
                      <div className="w-full pt-1 md:pt-0">
                        <h6 className="mb-1 mt-2 text-sm w-full h-5 rounded font-semibold bg-slate-100/10 animate-pulse text-transparent"></h6>
                        <p className="mb-0.5 mt-2 w-2/3 rounded h-4 text-sm bg-slate-100/10 animate-pulse text-transparent"></p>
                        <p className="mb-0.5 mt-2 w-1/2 rounded h-4 text-sm bg-slate-100/10 animate-pulse text-transparent"></p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-x-2 border pr-2 md:flex">
                    <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                      <div className="w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <div className="bg-slate-100/10 rounded animate-pulse h-full w-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                      <div className="h-12 w-12 shrink-0 md:hidden">
                        <div className="bg-slate-100/10 animate-pulse h-full w-full rounded-full"></div>
                      </div>
                      <div className="w-full pt-1 md:pt-0">
                        <h6 className="mb-1 mt-2 text-sm w-full h-5 rounded font-semibold bg-slate-100/10 animate-pulse text-transparent"></h6>
                        <p className="mb-0.5 mt-2 w-2/3 rounded h-4 text-sm bg-slate-100/10 animate-pulse text-transparent"></p>
                        <p className="mb-0.5 mt-2 w-1/2 rounded h-4 text-sm bg-slate-100/10 animate-pulse text-transparent"></p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-x-2 border pr-2 md:flex">
                    <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                      <div className="w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <div className="bg-slate-100/10 rounded animate-pulse h-full w-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                      <div className="h-12 w-12 shrink-0 md:hidden">
                        <div className="bg-slate-100/10 animate-pulse h-full w-full rounded-full"></div>
                      </div>
                      <div className="w-full pt-1 md:pt-0">
                        <h6 className="mb-1 mt-2 text-sm w-full h-5 rounded font-semibold bg-slate-100/10 animate-pulse text-transparent"></h6>
                        <p className="mb-0.5 mt-2 w-2/3 rounded h-4 text-sm bg-slate-100/10 animate-pulse text-transparent"></p>
                        <p className="mb-0.5 mt-2 w-1/2 rounded h-4 text-sm bg-slate-100/10 animate-pulse text-transparent"></p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-x-2 border pr-2 md:flex">
                    <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                      <div className="w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <div className="bg-slate-100/10 rounded animate-pulse h-full w-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                      <div className="h-12 w-12 shrink-0 md:hidden">
                        <div className="bg-slate-100/10 animate-pulse h-full w-full rounded-full"></div>
                      </div>
                      <div className="w-full pt-1 md:pt-0">
                        <h6 className="mb-1 mt-2 text-sm w-full h-5 rounded font-semibold bg-slate-100/10 animate-pulse text-transparent"></h6>
                        <p className="mb-0.5 mt-2 w-2/3 rounded h-4 text-sm bg-slate-100/10 animate-pulse text-transparent"></p>
                        <p className="mb-0.5 mt-2 w-1/2 rounded h-4 text-sm bg-slate-100/10 animate-pulse text-transparent"></p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-x-2 border pr-2 md:flex">
                    <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                      <div className="w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <div className="bg-slate-100/10 rounded animate-pulse h-full w-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                      <div className="h-12 w-12 shrink-0 md:hidden">
                        <div className="bg-slate-100/10 animate-pulse h-full w-full rounded-full"></div>
                      </div>
                      <div className="w-full pt-1 md:pt-0">
                        <h6 className="mb-1 mt-2 text-sm w-full h-5 rounded font-semibold bg-slate-100/10 animate-pulse text-transparent"></h6>
                        <p className="mb-0.5 mt-2 w-2/3 rounded h-4 text-sm bg-slate-100/10 animate-pulse text-transparent"></p>
                        <p className="mb-0.5 mt-2 w-1/2 rounded h-4 text-sm bg-slate-100/10 animate-pulse text-transparent"></p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-x-2 border pr-2 md:flex">
                    <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                      <div className="w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <div className="bg-slate-100/10 rounded animate-pulse h-full w-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                      <div className="h-12 w-12 shrink-0 md:hidden">
                        <div className="bg-slate-100/10 animate-pulse h-full w-full rounded-full"></div>
                      </div>
                      <div className="w-full pt-1 md:pt-0">
                        <h6 className="mb-1 mt-2 text-sm w-full h-5 rounded font-semibold bg-slate-100/10 animate-pulse text-transparent"></h6>
                        <p className="mb-0.5 mt-2 w-2/3 rounded h-4 text-sm bg-slate-100/10 animate-pulse text-transparent"></p>
                        <p className="mb-0.5 mt-2 w-1/2 rounded h-4 text-sm bg-slate-100/10 animate-pulse text-transparent"></p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-x-2 border pr-2 md:flex">
                    <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                      <div className="w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <div className="bg-slate-100/10 rounded animate-pulse h-full w-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                      <div className="h-12 w-12 shrink-0 md:hidden">
                        <div className="bg-slate-100/10 animate-pulse h-full w-full rounded-full"></div>
                      </div>
                      <div className="w-full pt-1 md:pt-0">
                        <h6 className="mb-1 mt-2 text-sm w-full h-5 rounded font-semibold bg-slate-100/10 animate-pulse text-transparent"></h6>
                        <p className="mb-0.5 mt-2 w-2/3 rounded h-4 text-sm bg-slate-100/10 animate-pulse text-transparent"></p>
                        <p className="mb-0.5 mt-2 w-1/2 rounded h-4 text-sm bg-slate-100/10 animate-pulse text-transparent"></p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-x-2 border pr-2 md:flex">
                    <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                      <div className="w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <div className="bg-slate-100/10 rounded animate-pulse h-full w-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                      <div className="h-12 w-12 shrink-0 md:hidden">
                        <div className="bg-slate-100/10 animate-pulse h-full w-full rounded-full"></div>
                      </div>
                      <div className="w-full pt-1 md:pt-0">
                        <h6 className="mb-1 mt-2 text-sm w-full h-5 rounded font-semibold bg-slate-100/10 animate-pulse text-transparent"></h6>
                        <p className="mb-0.5 mt-2 w-2/3 rounded h-4 text-sm bg-slate-100/10 animate-pulse text-transparent"></p>
                        <p className="mb-0.5 mt-2 w-1/2 rounded h-4 text-sm bg-slate-100/10 animate-pulse text-transparent"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );

 
  return (
    <section className="w-full pb-[70px] sm:pb-0">
      {/* sm:ml-[70px] */}
      <div className="flex w-full flex-wrap gap-4 p-4 lg:flex-nowrap">
        <div className="col-span-12 w-full">
          <div className="relative mb-4 w-full pt-[56%]">
            <div className="absolute inset-0">
            {playingVideo && (
              <video
                className="h-full w-full"
                controls
                autoPlay
                muted
                poster={playingVideo.thumbnail}
              >
                <source src={playingVideo.videoFile} type="video/mp4" />
              </video>
            )}
            </div>
          </div>

          <div
            className="group mb-4 w-full rounded-lg border p-4 duration-200 hover:bg-white/5 focus:bg-white/5"
            role="button"
            tabIndex="0"
          >
            <div className="flex flex-wrap gap-y-2">
              <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                <h1 className="text-lg font-bold">{playingVideo?.title}</h1>{" "}
                {/* Use dynamic title */}
                <p className="flex text-sm text-gray-200">
                  {playingVideo?.views} Views ·{" "}
                  {timeSince(new Date(playingVideo?.createdAt))}
                </p>{" "}
                {/* Dynamic views and date */}
              </div>

              <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                <div className="flex items-center justify-between gap-x-4 md:justify-end lg:justify-between xl:justify-end">

                <div className="flex overflow-hidden rounded-lg border">
                  <button
                    className="group/btn flex items-center gap-x-2 border-r border-gray-700 px-2 py-1 after:content-[attr(data-like)] hover:bg-white/10 focus:after:content-[attr(data-like-alt)]"
                    onClick={toggleLike}
                  >
                     <span className="inline-block flex items-center gap-x-1 group/btn">
                      <button  
                          // className={`flex items-center gap-x-1 ${liked ? 'text-[#ae7aff]' : 'text-gray-500'}`} // Change color based on liked status
                      >
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="20"
                              height="20"
                              fill={likeStatus ? 'red' : 'none'} 
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ cursor: 'pointer' }}
                            >
                              <path
                                d="M12 21C12 21 4 14.36 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12 4 12 4C12 4 12.76 3 14.5 3C17.58 3 20 5.42 20 8.5C20 14.36 12 21 12 21Z"
                              />
                            </svg>
                          
                      </button>
                      <span className="text-sm">{formatNumber(noOfLikes)}</span> {/* Counter for likes */}
                  </span>
                  </button>
                  
                </div>

                  <div className="relative block">
                    <button className="peer flex items-center gap-x-2 rounded-lg bg-white px-4 py-1 text-black"
                    onClick={() => {openSaveModal(videoId)}}
                    >
                        <span className="inline-block w-5">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 3H14V1H10V3H7V8H17V3ZM18 8H6V20H18V8ZM16 10V18H8V10H16Z"/>
                      </svg>

                      </span>
                      Save
                    </button>
                    {
                    isSaveModalOpen && 
                    <SaveToPlayList videoId={videoIdToAdd} userId={ownerId} onClose={closeSaveModal} />
                  }
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-x-4">
                <div className="mt-2 h-12 w-12 shrink-0">
                <NavLink to={`/user/${playingVideo?.owner?.username}/${playingVideo?.owner?._id}`}>
                <img
                  src={playingVideo?.owner?.avatar || ""} 
                  alt={playingVideo?.owner?.username || "User Avatar"} 
                  className="h-full w-full rounded-full"
                />
                </NavLink>
                </div>
                <div className="block">
                  <p className="text-gray-200">{playingVideo?.owner?.username}  </p>{" "}
                  {/* Dynamic channel name */}
                  <p className="text-sm text-gray-400">
                  {noOfSubscribers} Subscribers
                  </p>{" "}
                  {/* Dynamic subscribers */}
                </div>
              </div>
              <div className="block">

              <button
                className={`group/btn mr-1 flex w-full items-center gap-x-2 
                  bg-[${subStatus ? '#ff4f4f' : '#ae7aff'}]  
                  text-[${subStatus ? '#000' : '#fff'}]       
                  px-1 py-1 text-center font-bold 
                  shadow-[5px_5px_0px_0px_#4f4e4e] transition-all 
                  duration-150 ease-in-out 
                  group-hover:bg-[${subStatus ? '#9a63ff' : '#e63939'}] 
                  active:translate-x-[5px] active:translate-y-[5px] 
                  active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto`}
                onClick={toggleSub}
              >
                <span className="inline-block w-1">
                </span>
                <span className={`${subStatus ? 'hidden' : 'block'} `}>
                  Subscribe
                </span>
                <span className={`${subStatus ? 'block' : 'hidden'}`}>
                  Unsubscribed
                </span>
              </button>



              </div>
            </div>

            <hr className="my-4 border-white" />
            <div className="h-5 overflow-hidden group-focus:h-auto">
              <p className="text-sm">{playingVideo?.description}</p>{" "}
              {/* Dynamic description */}
            </div>
          </div>

          {/* Comments Section */}
          <button className="peer w-full rounded-lg border p-4 text-left duration-200 hover:bg-white/5 focus:bg-white/5 sm:hidden">
            <h6 className="font-semibold">{noOfComment} Comments...</h6>
          </button>
          <div className="fixed inset-x-0 top-full z-[60] h-[calc(100%-69px)] overflow-auto rounded-lg border bg-[#121212] p-4 duration-200 hover:top-[67px] peer-focus:top-[67px] sm:static sm:h-auto sm:max-h-[500px] lg:max-h-none">

            <div className="block ">
              <h6 className="mb-4 font-semibold">{noOfComment} Comments</h6>
              <div className="flex gap-4">
                  <input
                    type="text"
                    className="w-full rounded-lg border bg-transparent px-2 py-1 placeholder-white"
                    placeholder="Add a Comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)} 
                  />
                  <button 
                  className="bg-[#ae7aff] px-3 py-2 font-semibold text-black border rounded-lg"
                  onClick={addComment} 
                  >
                    Send
                  </button>
              </div>
            </div>

            <hr className="my-4 border-white" />
            {/* comments */}
            <div>
            { Array.isArray(allComments) && allComments.map((comment) =>  (
              <div key={comment._id}>
                <div className="flex gap-x-4">
                  <div className="mt-2 h-11 w-11 shrink-0">
                    <img
                      src={comment?.owner?.avatar} 
                      alt={comment?.ownerInfo?.username} 
                      className="h-full w-full rounded-full"
                    />
                  </div>
                  <div className="block">
                    <p className="flex items-center text-gray-200">
                      {comment?.ownerInfo?.fullName} · 
                      <span className="text-sm">
                      {timeSince(new Date(comment.createdAt))} 
                      </span>
                    </p>
                    <p className="text-sm text-gray-200">@{comment?.ownerInfo?.username}</p>
                    <p className="mt-3 text-sm">{comment?.content}</p>
                  </div>
                </div>
                <hr className="my-4 border-white" />
              </div>
            ))}


          </div>

          
          </div>
        </div>

        {/* {side Videos} */}
        <div className="col-span-12 flex w-full shrink-0 flex-col gap-3 lg:w-[350px] xl:w-[400px]">
          <div className="flex flex-col w-full gap-4">
            {Array.isArray(videos) && videos.map((video) => (
              <NavLink to={`/video/${video._id}`}>
                <div
                  key={video._id}
                  className="w-full border-b pb-4 flex items-start"
                  onClick={() => {
                    addview(video._id);
                    addToHistory(video._id); 
                }}
                >
                  <div className="relative w-1/3">
                    <div className="relative pt-[56%]">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-xs text-white">
                        {formatDuration(video.duration)}
                      </span>
                    </div>
                  </div>

                  <div className="w-2/3 pl-4">
                    <h6 className="mb-1 text-sm font-semibold text-white truncate">
                      {video.title}
                    </h6>
                    <p className="text-xs text-gray-400 truncate">
                      {video.owner.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      {video.views} Views ·{" "}
                      {timeSince(new Date(video.createdAt))}
                    </p>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

    

    </section>
  );
}

export default VideoDetail;


