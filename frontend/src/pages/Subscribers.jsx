import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../app/Slices/authSlice.js";
import { useEffect} from "react";
import { axiosInstance } from "../helpers/axios.helper.js";
import { parseErrorMessage } from "../helpers/parseErrMsg.helper.js";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

function Subscribers() {
  const [subscriberList, setsubscriberList] = useState(null);

  const [isLoading, setisLoading] = useState(true)

  const user = useSelector(selectCurrentUser);

  const fetchSubList = async () => {
    try {
      const response = await axiosInstance.get(`/api/subscriptions/c/${user?._id}`);
      setsubscriberList(response.data.data)
      // toast.success(response.data.message);
    } catch (error) {
      // toast.error(parseErrorMessage(error?.response?.data));
      console.error("Error fetching sub list and count data:", error);
    }
  };

  const toggleSub = async (channelId) => {
    try {
      const response = await axiosInstance.post(`/api/subscriptions/t/${channelId}`);
      // toast.success(response.data.message);
      await fetchSubList();
    } catch (error) {
      // toast.error(parseErrorMessage(error?.response?.data));
      console.error("Error toggleing subs:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if(user){
        fetchSubList().finally(() => setisLoading(false));
      }
    }, 300); 
    return () => clearTimeout(timer); 
  }, []); 

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-4 pt-1 w-full">
        <div className="flex flex-col gap-y-5 pt-4">

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

  return Array.isArray(subscriberList) && subscriberList.length === 0 ? (
    <section class="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div className="flex justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <p className="mb-3 w-full">
            <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
              <span className="inline-block w-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  ></path>
                </svg>
              </span>
            </span>
          </p>
          <h5 className="mb-2 font-semibold">No people subscribers</h5>
          <p>
            Your channel has yet to <strong>subscribe</strong> a new channel.
          </p>
        </div>
      </div>
    </section>
  ) : (
    <section class="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div class="p-10">
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

          {Array.isArray(subscriberList) && subscriberList.map((subscriber) => (
          <div key={subscriber?.subscriberId} className="flex w-full justify-between mb-4">
            <div className="flex items-center gap-x-2">
              <div className="h-14 w-14 shrink-0">
              <NavLink to={`/user/${subscriber.username}/${subscriber.subscriberId}`}>
                <img
                  src={subscriber?.avatar}
                  alt={subscriber?.username}
                  className="h-full w-full rounded-full"
                />
                </NavLink>
              </div>
              <div className="block">
                <h6 className="font-semibold">{subscriber?.username}</h6>
                <p className="text-sm text-gray-300">{subscriber?.subscriberCount} Subscribers</p>
              </div>
            </div>
            <div className="block">

            <button
              className={`px-3 py-2 text-black ${
                subscriber.isSubscribedByMe ? 'bg-gray-300' : 'bg-[#ae7aff]'
              }`}
              onClick={() => toggleSub(subscriber?.subscriberId)}
            >
              {subscriber?.isSubscribedByMe ? 'Unsubscribe' : 'Subscribe'}
            </button>

            </div>
          </div>
        ))}

        
        </div>
      </div>
    </section>
  );
}

export default Subscribers;
