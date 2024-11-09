import React, { useState } from "react";
import MyChannelEmptySubscribed from "./MyChannelEmptySubscribed";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../app/Slices/authSlice.js";
import { axiosInstance } from "../../helpers/axios.helper.js";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper.js";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

function MyChannelSubscribed() {

  const user = useSelector(selectCurrentUser);
  const [isLoading, setisLoading] = useState(true)

  const [subscribedChannels, setSubscribedChannels] = useState(null);
 
  const rendersubscribedChannels = async () => {
    try {
      const response = await axiosInstance.get(`https://yt-backend-lo6n.onrender.com/api/v1/subscriptions/u/${user?._id}`);
      toast.success(response.data.message);
      setSubscribedChannels(response.data.data);
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      setError(error.message || "Failed to fetch subscribed Channels. Please try again...");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        if(user){
          rendersubscribedChannels().finally(() => setisLoading(false));
        }
    }, 300);
    return () => clearTimeout(timer); 
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-4 pt-1">
        <div className="flex flex-col gap-y-4 pt-4">
          <div className="relative mb-2 rounded-sm bg-slate-100/10 animate-pulse py-2 pl-8 pr-3">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"></span>
            <div className="w-full h-6 bg-transparent outline-none" />
          </div>
          <div className="flex w-full justify-between">
            <div className="flex items-center gap-x-2">
              <div className="h-14 w-14 shrink-0 bg-slate-100/10 rounded-full animate-pulse"></div>
              <div className="block">
                <h6 className="font-semibold mb-2 bg-slate-100/10 animate-pulse h-4 w-24 rounded"></h6>
                <p className="text-sm text-gray-300 bg-slate-100/10 animate-pulse h-4 w-32 rounded"></p>
              </div>
            </div>
            <div className="block">
              <div className="group/btn px-3 py-2 text-black bg-slate-100/10 rounded-sm animate-pulse">
                <span className="inline-block w-24 h-4 rounded"></span>
              </div>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="flex items-center gap-x-2">
              <div className="h-14 w-14 shrink-0 bg-slate-100/10 rounded-full animate-pulse"></div>
              <div className="block">
                <h6 className="font-semibold mb-2 bg-slate-100/10 animate-pulse h-4 w-24 rounded"></h6>
                <p className="text-sm text-gray-300 bg-slate-100/10 animate-pulse h-4 w-32 rounded"></p>
              </div>
            </div>
            <div className="block">
              <div className="group/btn px-3 py-2 text-black bg-slate-100/10 rounded-sm animate-pulse">
                <span className="inline-block w-24 h-4 rounded"></span>
              </div>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="flex items-center gap-x-2">
              <div className="h-14 w-14 shrink-0 bg-slate-100/10 rounded-full animate-pulse"></div>
              <div className="block">
                <h6 className="font-semibold mb-2 bg-slate-100/10 animate-pulse h-4 w-24 rounded"></h6>
                <p className="text-sm text-gray-300 bg-slate-100/10 animate-pulse h-4 w-32 rounded"></p>
              </div>
            </div>
            <div className="block">
              <div className="group/btn px-3 py-2 text-black bg-slate-100/10 rounded-sm animate-pulse">
                <span className="inline-block w-24 h-4 rounded"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return Array.isArray(subscribedChannels) && subscribedChannels.length === 0 ? (
    <MyChannelEmptySubscribed />
  ) : (
    <div className="flex flex-col gap-y-4 py-4">
      <div className="relative mb-2 rounded-lg bg-white py-2 pl-8 pr-3 text-black">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            aria-hidden="true"
            className="h-5 w-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            ></path>
          </svg>
        </span>
        <input className="w-full bg-transparent outline-none" placeholder="Search" />
      </div>

      {Array.isArray(subscribedChannels) && subscribedChannels.map((channel) => (
        <div key={channel.channelId} className="flex w-full justify-between mb-4">
          <div className="flex items-center gap-x-2">
            <div className="h-14 w-14 shrink-0">
            <NavLink to={`/user/${channel.username}/${channel.channelId}`}>
              <img
                src={channel.avatar}
                alt={channel.username}
                className="h-full w-full rounded-full"
              />
              </NavLink>
            </div>
            <div className="block">
              <h6 className="font-semibold">{channel.username}</h6>
              <p className="text-sm text-gray-300">{channel.subscriberCount} Subscribers</p>
            </div>
          </div>
          
        </div>
      ))}
 
    </div>
  );
}

export default MyChannelSubscribed;
