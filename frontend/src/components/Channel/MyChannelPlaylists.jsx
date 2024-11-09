import React, { useState } from "react";
import MyChannelEmptyPlaylist from "./MyChannelEmptyPlaylist";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../app/Slices/authSlice.js";
import { axiosInstance } from "../../helpers/axios.helper.js";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper.js";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";


function MyChannelPlaylists() {

  const [playlists, setPlaylists] = useState(null);
  const user = useSelector(selectCurrentUser);

  const [isLoading, setisLoading] = useState(true)


  const timeSince = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);

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

  const renderPlayList = async () => {
    try {
      const response = await axiosInstance.get(`https://yt-backend-lo6n.onrender.com/api/v1/playlist/user/${user?._id}`);
      console.log(response) ; 
      // toast.success(response.data.message);
      setPlaylists(response.data.data);
    } catch (error) {
      // toast.error(parseErrorMessage(error.response.data));
      setError(error.message || "Failed to fetch playlist. Please try again...");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if(user){
        renderPlayList().finally(() => setisLoading(false));
      }
    }, 300);
    return () => clearTimeout(timer); 
  }, []);

  if (isLoading) {
    return (
      <div className={`grid gap-4 pt-2 mt-3 sm:grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))]`}>
        <div className="w-full">
          <div className="relative mb-1 w-full pt-[62%]">
            <div className="absolute inset-0">
              {/* <!-- Skeleton for the image --> */}
              <div className="h-full w-full bg-slate-100/10 animate-pulse"></div>
              <div className="absolute inset-x-0 bottom-0">
                <div className="relative border-t bg-white/10 p-4 backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                  <div className="relative z-[1]">
                    <div className="flex justify-between">
                      <div className="inline-block h-6 mb-2 bg-slate-100/10 rounded w-1/2 animate-pulse"></div>
                      <div className="inline-block h-6 bg-slate-100/10  rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="text-sm text-gray-700 h-6 bg-slate-100/10 rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-1 font-semibold h-5 bg-slate-100/10 rounded w-1/2 animate-pulse"></div>
          <div className="flex  h-5 bg-slate-100/10 rounded w-3/4 animate-pulse"></div>
        </div>
        <div className="w-full">
          <div className="relative mb-1 w-full pt-[62%]">
            <div className="absolute inset-0">
              {/* <!-- Skeleton for the image --> */}
              <div className="h-full w-full bg-slate-100/10 animate-pulse"></div>
              <div className="absolute inset-x-0 bottom-0">
                <div className="relative border-t bg-white/10 p-4 backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                  <div className="relative z-[1]">
                    <div className="flex justify-between">
                      <div className="inline-block h-6 mb-2 bg-slate-100/10 rounded w-1/2 animate-pulse"></div>
                      <div className="inline-block h-6 bg-slate-100/10  rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="text-sm text-gray-700 h-6 bg-slate-100/10 rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-1 font-semibold h-5 bg-slate-100/10 rounded w-1/2 animate-pulse"></div>
          <div className="flex  h-5 bg-slate-100/10 rounded w-3/4 animate-pulse"></div>
        </div>
        <div className="w-full">
          <div className="relative mb-1 w-full pt-[62%]">
            <div className="absolute inset-0">
              {/* <!-- Skeleton for the image --> */}
              <div className="h-full w-full bg-slate-100/10 animate-pulse"></div>
              <div className="absolute inset-x-0 bottom-0">
                <div className="relative border-t bg-white/10 p-4 backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                  <div className="relative z-[1]">
                    <div className="flex justify-between">
                      <div className="inline-block h-6 mb-2 bg-slate-100/10 rounded w-1/2 animate-pulse"></div>
                      <div className="inline-block h-6 bg-slate-100/10  rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="text-sm text-gray-700 h-6 bg-slate-100/10 rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-1 font-semibold h-5 bg-slate-100/10 rounded w-1/2 animate-pulse"></div>
          <div className="flex  h-5 bg-slate-100/10 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return Array.isArray(playlists) && playlists.length === 0 ?  (
    <MyChannelEmptyPlaylist />
  ) : (
    <>
          <ul
            className={`grid gap-4 pt-2 grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] ${
              playlists?.length < 4 && "lg:grid-cols-[repeat(auto-fit,_minmax(300px,400px))]"
            }`}
          >
            {playlists?.map(
              (playlist) =>
                (playlist.videos.length > 0 || playlist.owner) && (
                  <li key={playlist._id} className="w-full">
                    <NavLink to={`/myplaylist/${playlist._id}/${user?.username}`}>
                      <div className="relative w-full pt-[56%]">  
                        <div className="absolute inset-0">
                          <img
                            src={
                              playlist?.thumbnail ? playlist?.thumbnail : 
                            
                              playlist.videos.length === 0 ? 
                              "https://res.cloudinary.com/df6ztmktu/image/upload/v1717336091/videotube/photos/iqqvkshu1a14wfbr56lh.png"
                              : ""    
                            }
                            alt="Thunbnail is not uploaded"
                            className="h-full w-full resize"
                          />  
                          <div className="absolute inset-x-0 bottom-0">
                            <div className="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                              <div className="relative z-[1]">
                                <p className="flex justify-between">
                                  <span className="inline-block">{playlist.name}</span>
                                  <span className="inline-block">
                                    {playlist?.videos?.length} video
                                    {playlist?.videos?.length > 1 ? "s" : ""}
                                  </span>
                                </p>
                                <p className="text-sm text-gray-200">
                                  {playlist.totalViews} view{playlist.totalViews > 1 ? "s" : ""} ·{" "}
                                  {timeSince(playlist?.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex py-2 px-3 min-h-8 bg-[#21212199]">
                        <p className="flex text-sm text-gray-200 max-h-10 overflow-hidden">
                          {playlist.description}
                        </p>
                      </div>
                    </NavLink>
                  </li>
                )
            )}
          </ul>
    
    </>
  );
}

export default MyChannelPlaylists;
