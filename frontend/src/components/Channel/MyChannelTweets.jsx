import React, { useState } from "react";
import MyChannelEmptyTweet from "./MyChannelEmptyTweet";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../app/Slices/authSlice.js";
import { axiosInstance } from "../../helpers/axios.helper.js";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper.js";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import EditTweet from "../Tweet/EditTweet.jsx";

function MyChannelTweets() {
  const user = useSelector(selectCurrentUser);

  const [isLoading, setisLoading] = useState(true)

  const [tweets, setTweets] = useState(null);
  const [error, setError] = useState(null);

  const renderTweets = async () => {
    try {
      const response = await axiosInstance.get(`https://yt-backend-lo6n.onrender.com/api/v1/tweets/user/${user?._id}`);
      // toast.success(response.data.message);
      console.log(response);
      setTweets(response.data.data);
    } catch (error) {
      // toast.error(parseErrorMessage(error.response.data));
      setError(error.message || "Failed to fetch videos. Please try again...");
    }
  };

  const [newtweet, setNewTweet] = useState("");

  const addTweet = async () => {
    if (newtweet.trim()) {
      try {
        console.log("creating tweet with data : " + newtweet);
        const response = await axiosInstance.post("https://yt-backend-lo6n.onrender.com/api/v1/tweets/", {
          content: newtweet,
        });
        // toast.success(response.data.message);
        await renderTweets();
        console.log(response);
        setNewTweet("");
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data
          : "Failed to post tweet. Please try again...";
        // toast.error(parseErrorMessage(errorMessage));
        console.error("Error posting tweet:", error);
      }
    } else {
      toast.error("Add some text to tweet");
    }
  };

  const handleDeleteButtonClick = async (tweetId) => {
    try {
      const response = await axiosInstance.delete(`https://yt-backend-lo6n.onrender.com/api/v1/tweets/${tweetId}`);
      // toast.success(response.data.message);
      await renderTweets();
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to delete tweet. Please try again...";
      // toast.error(parseErrorMessage(errorMessage));
      console.error("Error deleting tweet:", error);
    }
  };

  const toggleLike = async (tweetId) => {
    try {
      const response = await axiosInstance.post(`https://yt-backend-lo6n.onrender.com/api/v1/likes/toggle/t/${tweetId}`);
      // toast.success(response.data.message);
      await renderTweets();
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "can not toggle like. Please try again...";
      // toast.error(parseErrorMessage(errorMessage));
      console.error("Error toggling like:", error);
    }
  };

useEffect(() => {
  const timer = setTimeout(() => {
    renderTweets().finally(() => setisLoading(false));
  }, 300); 
  return () => clearTimeout(timer); 
}, []);


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

  const [updateModelOpen, setupdateModelOpen] = useState(false)
  const [tweetIdToUpdate, setTweetIdToUpdate] = useState(null);

  const handleUpdateButtonClick = (TweetId) => {
    setTweetIdToUpdate(TweetId); 
    setupdateModelOpen(true);
  };

  const closeUpdateModal = () => {
    setupdateModelOpen(false); 
    setTweetIdToUpdate(null); 
  };

  const reloadTweet = async () => {
    setisLoading(true) ;
    await renderTweets();
    setisLoading(false) ;   
  }

  if (isLoading) {
    return (
      <section className="w-full py-1 px-3 pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        <div className="mt-2 border pb-2 text-transparent bg-slate-100/10 rounded animate-pulse">
          <div className="mb-2 h-12 w-full resize-none border-none px-3 pt-2"></div>

          <div className="flex items-center justify-end gap-x-3 px-3">
            <div className="w-20 h-10 bg-slate-100/20 rounded animate-pulse"></div>
          </div>
        </div>
        <hr className=" border-[#ae7aff]/0 animate-pulse my-2" />
        <div className=" px-1">
          <div className="flex justify-between ">
            {/* comment content */}
            <span className="flex w-full gap-x-4 ">
              {/* avatar */}
              <div className="mt-2 h-12 w-12 shrink-0 ">
                <div className="h-full w-full rounded-full border-white bg-slate-100/10 animate-pulse"></div>
              </div>
              {/* Content */}
              <div className="block w-full">
                <div className="flex items-center">
                  <span className="bg-slate-100/10 rounded animate-pulse w-44 h-6 mr-1"></span>
                  <span className="bg-slate-100/10 rounded animate-pulse w-16 h-6"></span>
                </div>
                <div className="bg-slate-100/10 rounded animate-pulse w-32 mt-1 h-4"></div>
                <p className="my-1 text-[14px]">
                  <div className="text-transparent h-6 bg-slate-100/10 rounded animate-pulse w-[50%] outline-none border-b-[1px] border-transparent"></div>
                </p>
              </div>
            </span>
          </div>
          <hr className="my-2 border-slate-100/50 animate-pulse" />
        </div>{" "}
        <div className=" px-1">
          <div className="flex justify-between ">
            {/* comment content */}
            <span className="flex w-full gap-x-4 ">
              {/* avatar */}
              <div className="mt-2 h-12 w-12 shrink-0 ">
                <div className="h-full w-full rounded-full border-white bg-slate-100/10 animate-pulse"></div>
              </div>
              {/* Content */}
              <div className="block w-full">
                <div className="flex items-center">
                  <span className="bg-slate-100/10 rounded animate-pulse w-44 h-6 mr-1"></span>
                  <span className="bg-slate-100/10 rounded animate-pulse w-16 h-6"></span>
                </div>
                <div className="bg-slate-100/10 rounded animate-pulse w-32 mt-1 h-4"></div>
                <p className="my-1 text-[14px]">
                  <div className="text-transparent h-6 bg-slate-100/10 rounded animate-pulse w-[50%] outline-none border-b-[1px] border-transparent"></div>
                </p>
              </div>
            </span>
          </div>
          <hr className="my-2 border-slate-100/50 animate-pulse" />
        </div>{" "}
        <div className=" px-1">
          <div className="flex justify-between ">
            {/* comment content */}
            <span className="flex w-full gap-x-4 ">
              {/* avatar */}
              <div className="mt-2 h-12 w-12 shrink-0 ">
                <div className="h-full w-full rounded-full border-white bg-slate-100/10 animate-pulse"></div>
              </div>
              {/* Content */}
              <div className="block w-full">
                <div className="flex items-center">
                  <span className="bg-slate-100/10 rounded animate-pulse w-44 h-6 mr-1"></span>
                  <span className="bg-slate-100/10 rounded animate-pulse w-16 h-6"></span>
                </div>
                <div className="bg-slate-100/10 rounded animate-pulse w-32 mt-1 h-4"></div>
                <p className="my-1 text-[14px]">
                  <div className="text-transparent h-6 bg-slate-100/10 rounded animate-pulse w-[50%] outline-none border-b-[1px] border-transparent"></div>
                </p>
              </div>
            </span>
          </div>
          <hr className="my-2 border-slate-100/50 animate-pulse" />
        </div>{" "}
        <div className=" px-1">
          <div className="flex justify-between ">
            {/* comment content */}
            <span className="flex w-full gap-x-4 ">
              {/* avatar */}
              <div className="mt-2 h-12 w-12 shrink-0 ">
                <div className="h-full w-full rounded-full border-white bg-slate-100/10 animate-pulse"></div>
              </div>
              {/* Content */}
              <div className="block w-full">
                <div className="flex items-center">
                  <span className="bg-slate-100/10 rounded animate-pulse w-44 h-6 mr-1"></span>
                  <span className="bg-slate-100/10 rounded animate-pulse w-16 h-6"></span>
                </div>
                <div className="bg-slate-100/10 rounded animate-pulse w-32 mt-1 h-4"></div>
                <p className="my-1 text-[14px]">
                  <div className="text-transparent h-6 bg-slate-100/10 rounded animate-pulse w-[50%] outline-none border-b-[1px] border-transparent"></div>
                </p>
              </div>
            </span>
          </div>
          <hr className="my-2 border-slate-100/50 animate-pulse" />
        </div>{" "}
        <div className=" px-1">
          <div className="flex justify-between ">
            {/* comment content */}
            <span className="flex w-full gap-x-4 ">
              {/* avatar */}
              <div className="mt-2 h-12 w-12 shrink-0 ">
                <div className="h-full w-full rounded-full border-white bg-slate-100/10 animate-pulse"></div>
              </div>
              {/* Content */}
              <div className="block w-full">
                <div className="flex items-center">
                  <span className="bg-slate-100/10 rounded animate-pulse w-44 h-6 mr-1"></span>
                  <span className="bg-slate-100/10 rounded animate-pulse w-16 h-6"></span>
                </div>
                <div className="bg-slate-100/10 rounded animate-pulse w-32 mt-1 h-4"></div>
                <p className="my-1 text-[14px]">
                  <div className="text-transparent h-6 bg-slate-100/10 rounded animate-pulse w-[50%] outline-none border-b-[1px] border-transparent"></div>
                </p>
              </div>
            </span>
          </div>
          <hr className="my-2 border-slate-100/50 animate-pulse" />
        </div>{" "}
        <div className=" px-1">
          <div className="flex justify-between ">
            {/* comment content */}
            <span className="flex w-full gap-x-4 ">
              {/* avatar */}
              <div className="mt-2 h-12 w-12 shrink-0 ">
                <div className="h-full w-full rounded-full border-white bg-slate-100/10 animate-pulse"></div>
              </div>
              {/* Content */}
              <div className="block w-full">
                <div className="flex items-center">
                  <span className="bg-slate-100/10 rounded animate-pulse w-44 h-6 mr-1"></span>
                  <span className="bg-slate-100/10 rounded animate-pulse w-16 h-6"></span>
                </div>
                <div className="bg-slate-100/10 rounded animate-pulse w-32 mt-1 h-4"></div>
                <p className="my-1 text-[14px]">
                  <div className="text-transparent h-6 bg-slate-100/10 rounded animate-pulse w-[50%] outline-none border-b-[1px] border-transparent"></div>
                </p>
              </div>
            </span>
          </div>
          <hr className="my-2 border-slate-100/50 animate-pulse" />
        </div>{" "}
        <div className=" px-1">
          <div className="flex justify-between ">
            {/* comment content */}
            <span className="flex w-full gap-x-4 ">
              {/* avatar */}
              <div className="mt-2 h-12 w-12 shrink-0 ">
                <div className="h-full w-full rounded-full border-white bg-slate-100/10 animate-pulse"></div>
              </div>
              {/* Content */}
              <div className="block w-full">
                <div className="flex items-center">
                  <span className="bg-slate-100/10 rounded animate-pulse w-44 h-6 mr-1"></span>
                  <span className="bg-slate-100/10 rounded animate-pulse w-16 h-6"></span>
                </div>
                <div className="bg-slate-100/10 rounded animate-pulse w-32 mt-1 h-4"></div>
                <p className="my-1 text-[14px]">
                  <div className="text-transparent h-6 bg-slate-100/10 rounded animate-pulse w-[50%] outline-none border-b-[1px] border-transparent"></div>
                </p>
              </div>
            </span>
          </div>
          <hr className="my-2 border-slate-100/50 animate-pulse" />
        </div>
        <div className=" px-1">
          <div className="flex justify-between ">
            {/* comment content */}
            <span className="flex w-full gap-x-4 ">
              {/* avatar */}
              <div className="mt-2 h-12 w-12 shrink-0 ">
                <div className="h-full w-full rounded-full border-white bg-slate-100/10 animate-pulse"></div>
              </div>
              {/* Content */}
              <div className="block w-full">
                <div className="flex items-center">
                  <span className="bg-slate-100/10 rounded animate-pulse w-44 h-6 mr-1"></span>
                  <span className="bg-slate-100/10 rounded animate-pulse w-16 h-6"></span>
                </div>
                <div className="bg-slate-100/10 rounded animate-pulse w-32 mt-1 h-4"></div>
                <p className="my-1 text-[14px]">
                  <div className="text-transparent h-6 bg-slate-100/10 rounded animate-pulse w-[50%] outline-none border-b-[1px] border-transparent"></div>
                </p>
              </div>
            </span>
          </div>
          <hr className="my-2 border-slate-100/50 animate-pulse" />
        </div>
      </section>
    );
  }

return Array.isArray(tweets) && tweets.length === 0 ? (
  <MyChannelEmptyTweet />
) : (
  <>
    <div className="flex flex-col items-center w-full min-h-screen bg-[#121212]">
      <div className="w-full max-w-6xl border pb-2 px-0 mt-2">
        <textarea
          className="w-full h-10 resize-none border-none bg-transparent px-3 pt-2 outline-none text-white"
          placeholder="Write a tweet"
          value={newtweet}
          onChange={(e) => setNewTweet(e.target.value)}
        ></textarea>
        <div className="flex items-center justify-end gap-x-3 px-3 mt-2">
          <button
            className="bg-[#ae7aff] px-3 py-1 font-semibold text-black border rounded-md"
            onClick={addTweet}
          >
            Send
          </button>
        </div>
      </div>

      <div className="w-full py-4">
        {Array.isArray(tweets) && tweets.map((tweet, index) => (
          <div
            key={index}
            className="flex gap-3 border-b border-gray-700 py-4 ml-0 last:border-b-transparent w-full"
          >
            <div className="h-14 w-14 ml-5 shrink-0">
              <img
                src={user?.avatar}
                alt={user?.uwername}
                className="h-full w-full rounded-full"
              />
            </div>
            <div className="w-full">
              <h4 className="mb-1 flex items-center gap-x-3">
                <span className="font-semibold">{user?.username}</span> 
                <span className="inline-block text-sm text-gray-400">
                  {timeSince(new Date(tweet.createdAt))}
                </span>
              </h4>
              <p className="mb-2">{tweet.content}</p>
              <div className="flex justify-between">
                <button onClick={() => toggleLike(tweet._id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill={tweet?.liked ? "red" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ cursor: "pointer" }}
                  >
                    <path d="M12 21C12 21 4 14.36 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12 4 12 4C12 4 12.76 3 14.5 3C17.58 3 20 5.42 20 8.5C20 14.36 12 21 12 21Z" />
                  </svg>
                </button>

                <div className="flex gap-4">
                  <button
                    className="h-5 w-5 hover:text-[#ae7aff]"
                    onClick={() => handleDeleteButtonClick(tweet._id)}
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

                  <button
                    className="h-5 w-5 hover:text-[#ae7aff]"
                    onClick={() => handleUpdateButtonClick(tweet._id)}
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {
        updateModelOpen && 
        <EditTweet TweetId={tweetIdToUpdate} onClose={closeUpdateModal} onUpdateSuccess={reloadTweet}/>
      }
  </>
);

}

export default MyChannelTweets;
