import React from "react";
import { MyChannelEmptyVideo } from "../components";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../app/Slices/authSlice.js";
import { useState , useEffect} from "react";
import { axiosInstance } from "../helpers/axios.helper.js";
import { parseErrorMessage } from "../helpers/parseErrMsg.helper.js";
import { toast } from "react-toastify";


function MyChannel() {

  const user = useSelector(selectCurrentUser);
  const [isLoading, setisLoading] = useState(true)


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
    if (num === null || num === undefined || isNaN(num)) {
      return "0"; 
    }
  
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + "B";
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + "M"; 
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + "K"; 
    } else {
      return num.toString(); 
    }
  }
  
  
  const [noOfSub, setnoOfSub] = useState(null)

  const fetchNoOfSub = async () => {
    try {
      console.log(user?._id); 
      const response = await axiosInstance.get(`https://yt-backend-lo6n.onrender.com/api/v1/subscriptions/c/${user?._id}`);
      setnoOfSub(response.data.data.length);
      // toast.success(response.data.message);
    } catch (error) {
      // toast.error(parseErrorMessage(error?.response?.data));
      console.error("Error fetching sub list and count data:", error);
    }
  };

  const [subscribedChannels, setsubscribedChannels] = useState(null)

  const mySubscription = async () => {
    try {
      console.log(user?._id); 
      const response = await axiosInstance.get(`https://yt-backend-lo6n.onrender.com/api/v1/subscriptions/u/${user?._id}`);
      setsubscribedChannels(response.data.data.length);
      // toast.success(response.data.message);
    } catch (error) {
      // toast.error(parseErrorMessage(error?.response?.data));
      console.error("Error fetching sub list and count data:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        Promise.all([fetchNoOfSub(), mySubscription()])
          .finally(() => setisLoading(false));
      }
    }, 300); 
    return () => clearTimeout(timer);
  }, []);
  
  if(isLoading ){
      return (
        <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        {/* Cover Image Skeleton */}
        <div className="relative min-h-[150px] w-full pt-[16.28%] bg-gray-800 animate-pulse">
          <div className="absolute inset-0 overflow-hidden">
            {/* Placeholder for the cover image */}
          </div>
        </div>
  
        <div className="px-4 pb-4">
          {/* Channel Metadata Skeleton */}
          <div className="flex flex-wrap gap-4 pb-4 pt-6">
            <div className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full bg-gray-800 animate-pulse"></div>
            <div className="mr-auto inline-block">
              <div className="h-5 w-32 bg-gray-800 rounded animate-pulse"></div>
              <div className="mt-2 h-3 w-24 bg-gray-800 rounded animate-pulse"></div>
              <div className="mt-2 h-3 w-40 bg-gray-800 rounded animate-pulse"></div>
            </div>
            <div className="inline-block">
              <div className="inline-flex min-w-[145px] justify-end">
                <div className="h-10 w-32 bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
  
          {/* List Options Skeleton */}
          <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 bg-[#121212] py-2 sm:top-[82px]">
            <li className="w-full">
              <div className="h-10 w-full bg-gray-800 rounded animate-pulse"></div>
            </li>
            <li className="w-full">
              <div className="h-10 w-full bg-gray-800 rounded animate-pulse"></div>
            </li>
            <li className="w-full">
              <div className="h-10 w-full bg-gray-800 rounded animate-pulse"></div>
            </li>
            <li className="w-full">
              <div className="h-10 w-full bg-gray-800 rounded animate-pulse"></div>
            </li>
          </ul>
  
          {/* Outlet Skeleton */}
          <div className="h-64 w-full bg-gray-800 rounded animate-pulse"></div>
        </div>
      </section>
      )
  }

  return (
    <section className="relative w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div className="relative min-h-[150px] w-full pt-[16.28%]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={user?.coverImage}
            alt="cover-photo"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className=" px-4 pb-4">
        <div className="flex flex-wrap gap-4 pb-4 pt-6">
          <span className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2">
            <img
              src={user?.avatar }
              alt="Channel"
              className="h-full w-full"
            />
          </span>
          <div className="mr-auto inline-block">
            <h1 className="font-bolg text-xl">{user?.fullName}</h1>
            <p className="text-sm text-gray-400">@{user?.username}</p>
            <p className="text-sm text-gray-400">{formatNumber(noOfSub)} Subscribers · {formatNumber(subscribedChannels)} Subscribed</p>
          </div>
          <div className="inline-blmyVideosock">
            <button className="group/btn mr-1 flex w-full items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto">
              <span className="inline-block w-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                  ></path>
                </svg>
              </span>
              Edit
            </button>
          </div>
        </div>
        <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2  border-b-2 border-gray-400 bg-[#121212] py-2 sm:top-[82px]">
          <li className="w-full">
            <NavLink to={"myVideos"} className={({ isActive }) =>
                isActive
                  ? "w-full border-b-2 border-[#ae7aff] bg-white px-3 py-1.5 text-[#ae7aff]"
                  : "w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400"
              }>
              <button className="w-full">Videos</button>
            </NavLink>
          </li>

          <li className="w-full">
            <NavLink to={"playlists"} className={({ isActive }) =>
                isActive
                  ? "w-full border-b-2 border-[#ae7aff] bg-white px-3 py-1.5 text-[#ae7aff]"
                  : "w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400"
              }>
              <button className="w-full">Playlist</button>
            </NavLink>
          </li>

          <li className="w-full">
            <NavLink to={"tweets"} className={({ isActive }) =>
                isActive
                  ? "w-full border-b-2 border-[#ae7aff] bg-white px-3 py-1.5 text-[#ae7aff]"
                  : "w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400"
              }>
              <button className="w-full">Tweets</button>
            </NavLink>
          </li>

          <li className="w-full">
            <NavLink to={"subscribed"} className={({ isActive }) =>
                isActive
                  ? "w-full border-b-2 border-[#ae7aff] bg-white px-3 py-1.5 text-[#ae7aff]"
                  : "w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400"
              }>
              <button className="w-full">Subscribed</button>
            </NavLink>
          </li>

          <li className="w-full">
            <NavLink to={"about"} className={({ isActive }) =>
                isActive
                  ? "w-full border-b-2 border-[#ae7aff] bg-white px-3 py-1.5 text-[#ae7aff]"
                  : "w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400"
              }>
              <button className="w-full">About</button>
            </NavLink>
          </li>
        </ul>

        <Outlet />
      </div>
    </section>
  );
}

export default MyChannel;
