import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { axiosInstance } from "../helpers/axios.helper";
import { parseErrorMessage } from "../helpers/parseErrMsg.helper";
import { toast } from "react-toastify";


function Channel() {
  
  const location = useLocation();
  const path = location.pathname.split("/");
  const username = path[2]; 
  

  const [user, setUser] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get(`https://yt-backend-lo6n.onrender.com/api/v1/users/c/${username}`);
      setUser(response.data.data);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      console.error("Error fetching user data:", error);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num?.toString();
  };

  const toggleSub = async (channelId) => {
    try {
      const response = await axiosInstance.post(`https://yt-backend-lo6n.onrender.com/api/v1/subscriptions/t/${channelId}`);
      toast.success(response.data.message);
      await fetchUserData();
    } catch (error) {
      toast.error(parseErrorMessage(error?.response?.data));
      console.error("Error toggleing subs:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (username) {
        fetchUserData();
      }
    }, 300); 
    return () => clearTimeout(timer);
  }, [username]);

  if(!user ){
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
          <img src={user?.coverImage} alt="cover-photo" 
          className="w-full h-full object-cover"/>
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-4 pb-4 pt-6">
          <span className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2">
            <img src={user?.avatar} alt="Channel" className="h-full w-full" />
          </span>
          <div className="mr-auto inline-block">
            <h1 className="font-bold text-xl">{user?.fullName}</h1>
            <p className="text-sm text-gray-400">@{user?.username}</p>
            <p className="text-sm text-gray-400">
              {formatNumber(user?.subscribersCount)} Subscribers · {formatNumber(user?.channelsSubscribedToCount)} Subscribed
            </p>
          </div>
          <div className="flex gap-5">
          <button
            className={`group/btn mr-1 flex items-center justify-center h-9 gap-x-1 px-4 text-center font-bold text-sm transition-all duration-150 ease-in-out active:translate-x-[3px] active:translate-y-[3px] sm:w-auto 
              ${user?.isSubscribed 
                ? 'bg-white text-black shadow-[3px_3px_0px_0px_#4f4e4e] active:shadow-[0px_0px_0px_0px_#ae7aff]' 
                : 'bg-[#ae7aff] text-[#ffffff] shadow-[3px_3px_0px_0px_#4f4e4e] active:shadow-[0px_0px_0px_0px_#ffffff]'
              }`}
            onClick={() => { toggleSub(user?._id) }}
          >
            {user?.isSubscribed ? "Unsubscribe" : "Subscribe"}
          </button>


          </div>
        </div>
        <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 border-b-2 border-gray-400 bg-[#121212] py-2 sm:top-[82px]">
          <li className="w-full">
            <NavLink
              to={"videos"} 
              className={({ isActive }) =>
                isActive
                  ? "w-full border-b-2 border-[#ae7aff] bg-white px-3 py-1.5 text-[#ae7aff]"
                  : "w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400"
              }
            >
              <button className="w-full">Videos</button>
            </NavLink>
          </li>

          <li className="w-full">
            <NavLink
              to={"playlists"}
              className={({ isActive }) =>
                isActive
                  ? "w-full border-b-2 border-[#ae7aff] bg-white px-3 py-1.5 text-[#ae7aff]"
                  : "w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400"
              }
            >
              <button className="w-full">Playlist</button>
            </NavLink>
          </li>

          <li className="w-full">
            <NavLink
              to={"tweets"}
              className={({ isActive }) =>
                isActive
                  ? "w-full border-b-2 border-[#ae7aff] bg-white px-3 py-1.5 text-[#ae7aff]"
                  : "w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400"
              }
            >
              <button className="w-full">Tweets</button>
            </NavLink>
          </li>

          <li className="w-full">
            <NavLink
              to={"subscribed"}
              className={({ isActive }) =>
                isActive
                  ? "w-full border-b-2 border-[#ae7aff] bg-white px-3 py-1.5 text-[#ae7aff]"
                  : "w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400"
              }
            >
              <button className="w-full">Subscribed</button>
            </NavLink>
          </li>

          <li className="w-full">
            <NavLink
              to={"about"}
              className={({ isActive }) =>
                isActive
                  ? "w-full border-b-2 border-[#ae7aff] bg-white px-3 py-1.5 text-[#ae7aff]"
                  : "w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400"
              }
            >
              <button className="w-full">About</button>
            </NavLink>
          </li>
        </ul>

        <Outlet />
      </div>
    </section>
  );
}

export default Channel;
