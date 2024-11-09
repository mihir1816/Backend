import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {selectCurrentUser} from '../../app/Slices/authSlice.js'
import { useState , useEffect} from "react";
import { axiosInstance } from "../../helpers/axios.helper.js";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper";
import { toast } from "react-toastify";
import DeleteVideo from "./DeleteVideo.jsx";
import EditVideo from "./EditVideo.jsx";
import UploadVideo from "../Channel/UploadVideo.jsx";
import PleaseLogIn from "../../pages/PleaseLogIn.jsx";

function Dashboard() {

  const user = useSelector(selectCurrentUser);
  const [isLoading, setisLoading] = useState(true)

  
  console.log(user)

  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = String(date.getFullYear()).slice(-2); 
  
    return `${day}/${month}/${year}`; 
  };

  // for delete popup

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [videoIdToDelete, setVideoIdToDelete] = useState(null);

  const handleDeleteButtonClick = (videoId) => {
    setVideoIdToDelete(videoId); 
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false); 
    setVideoIdToDelete(null); 
  };

  // for update popup
  
  const [updateModelOpen, setupdateModelOpen] = useState(false)
  const [videoIdToUpdate, setVideoIdToUpdate] = useState(null);

  const handleUpdateButtonClick = (videoId) => {
    setVideoIdToUpdate(videoId); 
    setupdateModelOpen(true);
  };

  const closeUpdateModal = () => {
    setupdateModelOpen(false); 
    setVideoIdToUpdate(null); 
  };

      // For Publish Modal
    const [publishModalOpen, setPublishModalOpen] = useState(false); // State to track if publish modal is open

    const openPublishModal = () => {
      setPublishModalOpen(true); // Open the modal
    };

    const closePublishModal = () => {
      setPublishModalOpen(false); // Close the modal
    };
  

  // channel data

  const [channelData, setchannelData] = useState(null)

  const fetchChannelData = async () => {
    try {
      const response = await axiosInstance.get(`https://yt-backend-lo6n.onrender.com/api/v1/dashboard/stats`);
      // toast.success(response.data.message);
      console.log(response) ; 
      setchannelData(response.data.data);
    } catch (error) {
      // toast.error(parseErrorMessage(error?.response?.data));
      console.error("Error fetching channel stats:", error);
    }
  };

  // videos with likes

  const [videosWithLikes, setvideosWithLikes] = useState(null) ; 
  const fetchChannelVideoWithLikeData = async () => {
    try {
      const response = await axiosInstance.get(`https://yt-backend-lo6n.onrender.com/api/v1/dashboard/videos`);
      // toast.success(response.data.message);
      setvideosWithLikes(response.data.data);
    } catch (error) {
      // toast.error(parseErrorMessage(error?.response?.data));
      console.error("Error fetching videos with like count:", error);
    }
  };

  useEffect(() => {  
      const timer = setTimeout(() => {
        if(user){
          Promise.all([fetchChannelData(), fetchChannelVideoWithLikeData()])
          .finally(() => setisLoading(false));
        }   
    }, 300); 
    return () => clearTimeout(timer);
  }, []); 

  // for publish status

  const togglePublishStatus = async (videoId) => {
    try {
      const response = await axiosInstance.patch(`https://yt-backend-lo6n.onrender.com/api/v1/videos/toggle/publish/${videoId}`);
      toast.success(response.data.message);
      await fetchChannelVideoWithLikeData() ;
    } catch (error) {
      toast.error(parseErrorMessage(error?.response?.data));
      console.error("Error toggling publish status:", error);
    }
  }

  const reloadVideos = async () => {
    setisLoading(true)
    await fetchChannelVideoWithLikeData();
    setisLoading(false) ; 
  }

  if (!user) {
    return (
      <section className="mt-36">
      <PleaseLogIn />
      </section>
    )
    
  }

    // Skeleton Effect for loading
    if (isLoading)
      return (
        <h1 className="size-full text-center">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-y-6 px-4 py-8">
            {/* Wel-Coming header */}
            <div className="flex flex-wrap justify-between gap-4">
              {/* Welcoming Headers */}
              <div className="block">
                <h1 className=" w-64 h-6 rounded bg-gray-300/65 animate-pulse font-bold"></h1>
                <p className=" w-96 h-6 mt-2 rounded bg-gray-300/65 animate-pulse"></p>
              </div>
              {/* Video Upload Button */}
              <div className="block">
                <div className="inline-flex w-36 items-center gap-x-2 bg-gray-300/65 h-12 rounded animate-pulse px-3 py-2 font-semibold text-black"></div>
              </div>
            </div>
            {/* channel States */}
            <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4">
              <div className="border rounded bg-gray-300/10 animate-pulse p-4">
                <div className="mb-4 block h-16"></div>
                <h6 className="text-gray-300 h-8"></h6>
                <p className=" h-8"></p>
              </div>
              <div className="border rounded bg-gray-300/10 animate-pulse p-4">
                <div className="mb-4 block h-16"></div>
                <h6 className="text-gray-300 h-8"></h6>
                <p className=" h-8"></p>
              </div>
              <div className="border rounded bg-gray-300/10 animate-pulse p-4">
                <div className="mb-4 block h-16"></div>
                <h6 className="text-gray-300 h-8"></h6>
                <p className=" h-8"></p>
              </div>
              <div className="border rounded bg-gray-300/10 animate-pulse p-4">
                <div className="mb-4 block h-16"></div>
                <h6 className="text-gray-300 h-8"></h6>
                <p className=" h-8"></p>
              </div>
            </div>
            {/* search bar */}
            <div className="flex items-start">
              <div className="relative w-full max-w-2xl overflow-hidden">
                <input
                  className="w-full animate-pulse bg-gray-400/10 border py-1 pl-8 pr-3 outline-none sm:py-2"
                  disabled
                />
                <span className="absolute left-2.5 top-1/2 inline-block -translate-y-1/2"></span>
              </div>
              <div className=" border-r border-b border-t rounded-r-xl px-3 py-1 animate-pulse bg-gray-400/10">
                <div className=" size-6 sm:size-8 flex items-center "></div>
              </div>
            </div>
            {/* video Table */}
            <div className="w-full overflow-auto">
              <table className="w-full min-w-[1200px] border-collapse border text-white">
                <thead>
                  <tr className="h-11">
                    <th className="border-collapse border-b h-4 w-7 bg-slate-100/5 p-4 animate-pulse"></th>
                    <th className="border-collapse border-b h-4 w-7 bg-slate-100/5 p-4 animate-pulse"></th>
                    <th className="border-collapse border-b h-4 w-7 bg-slate-100/5 p-4 animate-pulse"></th>
                    <th className="border-collapse border-b h-4 w-7 bg-slate-100/5 p-4 animate-pulse"></th>
                    <th className="border-collapse border-b h-4 w-7 bg-slate-100/5 p-4 animate-pulse"></th>
                    <th className="border-collapse border-b h-4 w-7 bg-slate-100/5 p-4 animate-pulse"></th>
                    <th className="border-collapse border-b h-4 w-7 bg-slate-100/5 p-4 animate-pulse"></th>
                    <th className="border-collapse border-b h-4 w-7 bg-slate-100/5 p-4 animate-pulse"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="group border">
                    {/* Publish-Unpublished toggle box */}
                    <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className="flex justify-center">
                        <label className="relative inline-block w-14 cursor-pointer overflow-hidden">
                          <span className="inline-block border h-7 w-full rounded-2xl bg-gray-200/50 animate-pulse duration-50 mt-2"></span>
                        </label>
                      </div>
                    </td>
                    {/* Publish-Unpublished label */}
                    <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className="flex justify-center">
                        <span className="inline-block bg-slate-50/30 animate-pulse duration-50 rounded-2xl w-20 h-8 px-1.5 py-0.5"></span>
                      </div>
                    </td>
  
                    {/* Thumbnail & Title*/}
                    <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className="flex items-center gap-4">
                        <span className="h-10 w-10 rounded-full bg-slate-50/30 animate-pulse duration-50"></span>
                        <h3 className=" w-64 h-7 bg-slate-50/30 animate-pulse duration-50 rounded"></h3>
                      </div>
                    </td>
  
                    {/* upload date */}
                    <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className=" w-24 h-7 bg-slate-50/30 animate-pulse duration-50 rounded"></div>
                    </td>
  
                    <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className=" w-24 h-7 bg-slate-50/30 animate-pulse duration-50 rounded"></div>
                    </td>
  
                    <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className=" w-10 h-7 bg-slate-50/30 animate-pulse duration-50 rounded"></div>
                    </td>
  
                    {/* Like-Dislike Count */}
                    <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className="flex justify-center gap-4">
                        <span className="inline-block w-20 h-8 rounded-xl bg-green-200/50 animate-pulse duration-50 px-1.5 py-0.5"></span>
                        <span className="inline-block w-20 h-8 rounded-xl bg-red-200/50 animate-pulse duration-50 px-1.5 py-0.5"></span>
                      </div>
                    </td>
  
                    {/* Video Manipulation*/}
                    <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className="flex gap-4">
                        <div className="h-7 w-7 animate-pulse bg-slate-50/30 duration-50 rounded"></div>
                        <div className="h-7 w-7 animate-pulse bg-slate-50/30 duration-50 rounded"></div>
                      </div>
                    </td>
                  </tr>
                  <tr className="group border">
                    {/* Publish-Unpublished toggle box */}
                    <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className="flex justify-center">
                        <label className="relative inline-block w-14 cursor-pointer overflow-hidden">
                          <span className="inline-block border h-7 w-full rounded-2xl bg-gray-200/50 animate-pulse duration-50 mt-2"></span>
                        </label>
                      </div>
                    </td>
                    {/* Publish-Unpublished label */}
                    <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className="flex justify-center">
                        <span className="inline-block bg-slate-50/30 animate-pulse duration-50 rounded-2xl w-20 h-8 px-1.5 py-0.5"></span>
                      </div>
                    </td>
  
                    {/* Thumbnail & Title*/}
                    <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className="flex items-center gap-4">
                        <span className="h-10 w-10 rounded-full bg-slate-50/30 animate-pulse duration-50"></span>
                        <h3 className=" w-64 h-7 bg-slate-50/30 animate-pulse duration-50 rounded"></h3>
                      </div>
                    </td>
  
                    {/* upload date */}
                    <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className=" w-24 h-7 bg-slate-50/30 animate-pulse duration-50 rounded"></div>
                    </td>
  
                    <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className=" w-24 h-7 bg-slate-50/30 animate-pulse duration-50 rounded"></div>
                    </td>
  
                    <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className=" w-10 h-7 bg-slate-50/30 animate-pulse duration-50 rounded"></div>
                    </td>
  
                    {/* Like-Dislike Count */}
                    <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className="flex justify-center gap-4">
                        <span className="inline-block w-20 h-8 rounded-xl bg-green-200/50 animate-pulse duration-50 px-1.5 py-0.5"></span>
                        <span className="inline-block w-20 h-8 rounded-xl bg-red-200/50 animate-pulse duration-50 px-1.5 py-0.5"></span>
                      </div>
                    </td>
  
                    {/* Video Manipulation*/}
                    <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className="flex gap-4">
                        <div className="h-7 w-7 animate-pulse bg-slate-50/30 duration-50 rounded"></div>
                        <div className="h-7 w-7 animate-pulse bg-slate-50/30 duration-50 rounded"></div>
                      </div>
                    </td>
                  </tr>
                  <tr className="group border">
                    {/* Publish-Unpublished toggle box */}
                    <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className="flex justify-center">
                        <label className="relative inline-block w-14 cursor-pointer overflow-hidden">
                          <span className="inline-block border h-7 w-full rounded-2xl bg-gray-200/50 animate-pulse duration-50 mt-2"></span>
                        </label>
                      </div>
                    </td>
                    {/* Publish-Unpublished label */}
                    <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className="flex justify-center">
                        <span className="inline-block bg-slate-50/30 animate-pulse duration-50 rounded-2xl w-20 h-8 px-1.5 py-0.5"></span>
                      </div>
                    </td>
  
                    {/* Thumbnail & Title*/}
                    <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className="flex items-center gap-4">
                        <span className="h-10 w-10 rounded-full bg-slate-50/30 animate-pulse duration-50"></span>
                        <h3 className=" w-64 h-7 bg-slate-50/30 animate-pulse duration-50 rounded"></h3>
                      </div>
                    </td>
  
                    {/* upload date */}
                    <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className=" w-24 h-7 bg-slate-50/30 animate-pulse duration-50 rounded"></div>
                    </td>
  
                    <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className=" w-24 h-7 bg-slate-50/30 animate-pulse duration-50 rounded"></div>
                    </td>
  
                    <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className=" w-10 h-7 bg-slate-50/30 animate-pulse duration-50 rounded"></div>
                    </td>
  
                    {/* Like-Dislike Count */}
                    <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className="flex justify-center gap-4">
                        <span className="inline-block w-20 h-8 rounded-xl bg-green-200/50 animate-pulse duration-50 px-1.5 py-0.5"></span>
                        <span className="inline-block w-20 h-8 rounded-xl bg-red-200/50 animate-pulse duration-50 px-1.5 py-0.5"></span>
                      </div>
                    </td>
  
                    {/* Video Manipulation*/}
                    <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                      <div className="flex gap-4">
                        <div className="h-7 w-7 animate-pulse bg-slate-50/30 duration-50 rounded"></div>
                        <div className="h-7 w-7 animate-pulse bg-slate-50/30 duration-50 rounded"></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </h1>
      );


  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-y-6 px-4 py-8">
      <div className="flex flex-wrap justify-between gap-4">
        <div className="block">
          <h1 className="text-2xl font-bold">Welcome Back, {user?.username}</h1>
          <p className="text-sm text-gray-300">Seamless Video Management, Elevated Results.</p>
        </div>
        <div className="block"
        onClick={openPublishModal}
        >
          <button className="inline-flex items-center gap-x-2 bg-[#ae7aff] px-3 py-2 font-semibold text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
            </svg>{" "}
            Upload video
          </button>
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4">
        <div className="border p-4">
          <div className="mb-4 block">
            <span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
            </span>
          </div>
          <h6 className="text-gray-300">Total views</h6>
          <p className="text-3xl font-semibold">{channelData?.totalViews}</p>
        </div>
        <div className="border p-4">
          <div className="mb-4 block">
            <span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                ></path>
              </svg>
            </span>
          </div>
          <h6 className="text-gray-300">Total subscribers</h6>
          <p className="text-3xl font-semibold">{channelData?.totalSubscribers}</p>
        </div>
        <div className="border p-4">
          <div className="mb-4 block">
            <span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                ></path>
              </svg>
            </span>
          </div>
          <h6 className="text-gray-300">Total likes</h6>
          <p className="text-3xl font-semibold">{channelData?.totalLikesOnChannel}</p>
        </div>
      </div>


      <div className="w-full overflow-auto">
        <table className="w-full min-w-[1200px] border-collapse border text-white">
          <thead>
            <tr>
              <th className="border-collapse border-b p-4">Status</th>
              <th className="border-collapse border-b p-4">Status</th>
              <th className="border-collapse border-b p-4">Uploaded</th>
              <th className="border-collapse border-b p-4">Rating</th>
              <th className="border-collapse border-b p-4">Date uploaded</th>
              <th className="border-collapse border-b p-4"></th>
            </tr>
          </thead>
          <tbody>

      {Array.isArray(videosWithLikes) && videosWithLikes.map((video, index) => (
                <tr key={video._id} className="group border">
                  {/* Publish Status */}
                  <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                    <div className="flex justify-center">
                      <label
                        htmlFor={`vid-pub-${index}`}
                        className="relative inline-block w-12 cursor-pointer overflow-hidden"
                      >
                        <input
                          type="checkbox"
                          id={`vid-pub-${index}`}
                          className="peer sr-only"
                          checked={video.isPublished}
                          onChange={() => togglePublishStatus(video._id)}
                        />
                        <span className="inline-block h-6 w-full rounded-2xl bg-gray-200 duration-200 after:absolute after:bottom-1 after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-black after:duration-200 peer-checked:bg-[#ae7aff] peer-checked:after:left-7"></span>
                      </label>
                    </div>
                  </td>

                  {/* Publish Status Label */}
                  <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                    <div className="flex justify-center">
                      {video.isPublished ? (
                        <span className="inline-block rounded-2xl border px-1.5 py-0.5 border-green-600 text-green-600">
                          Published
                        </span>
                      ) : (
                        <span className="inline-block rounded-2xl border px-1.5 py-0.5 border-orange-600 text-orange-600">
                          Unpublished
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Video Title and Thumbnail */}
                  <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                    <div className="flex items-center gap-4">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={video.thumbnail} // Assume video has `thumbnailUrl` property
                        alt={video.title}
                      />
                      <h3 className="font-semibold">{video.title}</h3>
                    </div>
                  </td>

                  {/* Total Likes */}
                  <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                    <div className="flex justify-center gap-4">
                      <span className="inline-block rounded-xl bg-green-200 px-1.5 py-0.5 text-green-700">
                        {video.totalLikes} likes
                      </span>
                    </div>
                  </td>

                  {/* Video Date */}
                  <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                    {formatDate(video.createdAt)} {/* Format date */}
                  </td>

                  {/* Actions */}
                  <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                    <div className="flex gap-4">
                      {/* Delete Action */}
                      <button 
                      className="h-5 w-5 hover:text-[#ae7aff]"
                      onClick={() => handleDeleteButtonClick(video._id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          ></path>
                        </svg>
                      </button>

                      {/* Edit Action */}
                      <button className="h-5 w-5 hover:text-[#ae7aff]"
                      onClick={() => handleUpdateButtonClick(video._id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                          ></path>
                        </svg>
                      </button>
                      
                    </div>
                  </td>
                </tr>
              ))}

          </tbody>
        </table>
      </div>

      {isDeleteModalOpen && (
        <DeleteVideo videoId={videoIdToDelete} onClose={closeDeleteModal} onUpdateSuccess={reloadVideos}/>
      )}

      {
        updateModelOpen && 
        <EditVideo videoId={videoIdToUpdate} onClose={closeUpdateModal} onUpdateSuccess={reloadVideos}/>
      }

      {
        publishModalOpen && 
        <UploadVideo  onClose={closePublishModal} onUpdateSuccess={reloadVideos}/>
      }

    </div>
  );
}

export default Dashboard;
