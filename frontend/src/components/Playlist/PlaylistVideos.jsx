import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect , useState} from "react";
import { axiosInstance } from "../../helpers/axios.helper.js";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper.js";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

function PlaylistVideos() {

  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const playlistId = pathParts[pathParts.length - 2];
  const username = pathParts[pathParts.length - 1]; 

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
  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  function formatNumber(num) {
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

  const [playlist, setplaylist] = useState(null)
  const renderThisPlayList = async () => {
    try {
      const response = await axiosInstance.get(`/api/playlist/${playlistId}`);
      console.log(response) ; 
      // toast.success(response.data.message);
      setplaylist(response.data.data);
    } catch (error) {
      // toast.error(parseErrorMessage(error.response.data));
    }
  };

  const [user, setuser] = useState(null)
  const renderPlayListOwner = async () => {
    try {
      const response = await axiosInstance.get(`/api/users/c/${username}`);
      console.log(response) ; 
      // toast.success(response.data.message);
      setuser(response.data.data);
    } catch (error) {
      // toast.error(parseErrorMessage(error.response.data));
    }
  };

  const [noOfSubscribers, setNoOfSubscribers] = useState(80) ;    
  const fetchNoOfSub = async () => {
    try { 
      const response = await axiosInstance.get(`/api/subscriptions/c/${user?._id}`);
      setNoOfSubscribers(response.data.data.length);
    } catch (error) {
      // toast.error(parseErrorMessage(error?.response?.data));
      console.error("Error fetching sub list and count data:", error);
    }
  };
  
  const [allVideosOfPlayList, setallVideosOfPlayList] = useState(null)
  const renderAllVideos = async () => {
    try {
      const response = await axiosInstance.get(`/api/playlist/user/allvideos/${playlistId}`);
      console.log(response) ; 
      // toast.success(response.data.message);
      setallVideosOfPlayList(response.data.data.videos);
    } catch (error) {
      // toast.error(parseErrorMessage(error.response.data));
    }
  };

  const [totalPlaylistViews, settotalPlaylistViews] = useState(0)
  const totalViews = async () => {
    settotalPlaylistViews(allVideosOfPlayList.reduce((total, video) => total + video.views, 0)) ;
  }

  useEffect(() => {
    if( playlistId && username ){
      renderThisPlayList(); 
      renderAllVideos() ;  
      renderPlayListOwner() ; 
    }
  }, [playlistId , username]);

  useEffect(() => {
    if (user) {
        fetchNoOfSub(); 
    }
}, [user]); 

  useEffect(() => {
    if (allVideosOfPlayList) {
        totalViews(); 
    }
}, [allVideosOfPlayList]);

if (!playlist || !user || !allVideosOfPlayList) {
  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div className="flex flex-wrap gap-x-4 gap-y-10 p-4 xl:flex-nowrap">
        <div className="w-full shrink-0 sm:max-w-md xl:max-w-sm">
          <div className="relative mb-2 w-full pt-[56%]">
            <div className="absolute inset-0">
              {/* Skeleton for the image */}
              <div className="h-full w-full bg-white/10 animate-pulse"></div>
              <div className="absolute inset-x-0 bottom-0 ">
                <div className="relative border-t border-t-slate-600 bg-white/10 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                  <div className="relative z-[1] ">
                    {/* Skeleton for the text */}
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Skeleton for the title */}
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-1 animate-pulse"></div>
          {/* Skeleton for the description */}
          <div className="h-4 bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
          <div className="mt-6 flex items-center gap-x-3">
            {/* Skeleton for the avatar */}
            <div className="h-16 w-16 shrink-0">
              <div className="h-full w-full bg-gray-700 rounded-full animate-pulse"></div>
            </div>
            <div className="w-full">
              {/* Skeleton for the owner's name and subscribers */}
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4 animate-pulse"></div>
            </div>
          </div>
        </div>
        <ul className="flex w-full flex-col gap-y-4">
          <div className="border border-slate-600">
            <div className="w-full max-w-3xl gap-x-4 sm:flex">
              <div className="relative mb-2 w-full sm:mb-0 sm:w-5/12">
                <div className="w-full pt-[56%]">
                  <div className="absolute inset-0 bg-gray-700 animate-pulse"></div>
                </div>
              </div>
              <div className="flex gap-x-2 px-2 sm:w-7/12 sm:px-0">
                <div className="h-10 w-10 shrink-0 sm:hidden bg-gray-700 rounded-full animate-pulse"></div>
                <div className="w-full">
                  <div className="my-4 font-semibold sm:max-w-[75%] bg-gray-700 h-4 animate-pulse"></div>
                  <p className="flex text-sm text-gray-200 sm:mt-3 bg-gray-700 h-4 animate-pulse w-3/4"></p>
                  <div className="flex items-center gap-x-4 my-4">
                    <div className="mt-2 hidden h-10 w-10 shrink-0 sm:block bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="text-sm text-gray-200 bg-gray-700 h-4 animate-pulse w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border border-slate-600">
            <div className="w-full max-w-3xl gap-x-4 sm:flex">
              <div className="relative mb-2 w-full sm:mb-0 sm:w-5/12">
                <div className="w-full pt-[56%]">
                  <div className="absolute inset-0 bg-gray-700 animate-pulse"></div>
                </div>
              </div>
              <div className="flex gap-x-2 px-2 sm:w-7/12 sm:px-0">
                <div className="h-10 w-10 shrink-0 sm:hidden bg-gray-700 rounded-full animate-pulse"></div>
                <div className="w-full">
                  <div className="my-4 font-semibold sm:max-w-[75%] bg-gray-700 h-4 animate-pulse"></div>
                  <p className="flex text-sm text-gray-200 sm:mt-3 bg-gray-700 h-4 animate-pulse w-3/4"></p>
                  <div className="flex items-center gap-x-4 my-4">
                    <div className="mt-2 hidden h-10 w-10 shrink-0 sm:block bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="text-sm text-gray-200 bg-gray-700 h-4 animate-pulse w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border border-slate-600">
            <div className="w-full max-w-3xl gap-x-4 sm:flex">
              <div className="relative mb-2 w-full sm:mb-0 sm:w-5/12">
                <div className="w-full pt-[56%]">
                  <div className="absolute inset-0 bg-gray-700 animate-pulse"></div>
                </div>
              </div>
              <div className="flex gap-x-2 px-2 sm:w-7/12 sm:px-0">
                <div className="h-10 w-10 shrink-0 sm:hidden bg-gray-700 rounded-full animate-pulse"></div>
                <div className="w-full">
                  <div className="my-4 font-semibold sm:max-w-[75%] bg-gray-700 h-4 animate-pulse"></div>
                  <p className="flex text-sm text-gray-200 sm:mt-3 bg-gray-700 h-4 animate-pulse w-3/4"></p>
                  <div className="flex items-center gap-x-4 my-4">
                    <div className="mt-2 hidden h-10 w-10 shrink-0 sm:block bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="text-sm text-gray-200 bg-gray-700 h-4 animate-pulse w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border border-slate-600">
            <div className="w-full max-w-3xl gap-x-4 sm:flex">
              <div className="relative mb-2 w-full sm:mb-0 sm:w-5/12">
                <div className="w-full pt-[56%]">
                  <div className="absolute inset-0 bg-gray-700 animate-pulse"></div>
                </div>
              </div>
              <div className="flex gap-x-2 px-2 sm:w-7/12 sm:px-0">
                <div className="h-10 w-10 shrink-0 sm:hidden bg-gray-700 rounded-full animate-pulse"></div>
                <div className="w-full">
                  <div className="my-4 font-semibold sm:max-w-[75%] bg-gray-700 h-4 animate-pulse"></div>
                  <p className="flex text-sm text-gray-200 sm:mt-3 bg-gray-700 h-4 animate-pulse w-3/4"></p>
                  <div className="flex items-center gap-x-4 my-4">
                    <div className="mt-2 hidden h-10 w-10 shrink-0 sm:block bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="text-sm text-gray-200 bg-gray-700 h-4 animate-pulse w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ul>
      </div>
    </section>
  );
}


  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div className="flex flex-wrap gap-x-4 gap-y-10 p-4 xl:flex-nowrap">
        <div className="w-full shrink-0 sm:max-w-md xl:max-w-sm">
          <div className="relative mb-2 w-full pt-[56%]">
            <div className="absolute inset-0">
              <img
                src={playlist?.thumbnail}
                alt="React Mastery"
                className="h-full w-full"
              />
              <div className="absolute inset-x-0 bottom-0">
                <div className="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                  <div className="relative z-[1]">
                    <p className="flex justify-between">
                      <span className="inline-block">Playlist</span>
                      <span className="inline-block">{playlist?.videos?.length} videos</span>
                    </p>
                    <p className="text-sm text-gray-200">{formatNumber(totalPlaylistViews)} Views · {timeSince(playlist?.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h6 className="mb-1 font-semibold">{playlist?.name}</h6>
          <p className="flex text-sm text-gray-200">
            {playlist?.description}
          </p>
          <div className="mt-6 flex items-center gap-x-3">
            <div className="h-16 w-16 shrink-0">
              <img
                src={user?.avatar}
                alt={user?.username}
                className="h-full w-full rounded-full"
              />
            </div>
            <div className="w-full">
              <h6 className="font-semibold">{user?.username}</h6>
              <p className="text-sm text-gray-300">{formatNumber(noOfSubscribers)} Subscribers</p>
            </div>
          </div>
        </div>  


        <div className="flex w-full flex-col gap-y-4">

        {Array.isArray(allVideosOfPlayList) && allVideosOfPlayList.map((video) => (
        <div key={video?._id} className="border mb-4">
          <div className="w-full max-w-3xl gap-x-4 sm:flex">
            <div className="relative mb-1 w-full sm:mb-0 sm:w-5/12">
            <NavLink to={`/video/${video?._id}`}>
              <div className="w-full pt-[56%]">
                <div className="absolute inset-0">
                  <img
                    src={video?.thumbnail}
                    alt={video?.title}
                    className="h-full w-full"
                  />
                </div>
                <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                  {formatDuration(video?.duration)}
                </span>
               </div>
          </NavLink>
            </div>
            <div className="flex gap-x-2 px-2 sm:w-7/12 sm:px-0">
           
              <div className="h-10 w-10 shrink-0 sm:hidden">
              <NavLink to={`/user/${video?.owner?.username}/${video?.owner?._id}`}>
                <img
                  src={video?.owner?.avatar}
                  alt={video?.owner?.username}
                  className="h-full w-full rounded-full"
                />
                 </NavLink>
              </div>
             
              <div className="w-full">
                <h6 className="mb-1 font-semibold sm:max-w-[75%]">
                  {video.title}
                </h6>
                <p className="flex text-sm text-gray-200 sm:mt-3">
                  {formatNumber(video?.views)} Views · {timeSince(video?.createdAt)}
                </p>
                <div className="flex items-center gap-x-4">
                  <div className="mt-2 hidden h-10 w-10 shrink-0 sm:block">
                    <img
                      src={video?.owner?.avatar}
                      alt={video?.owner?.username}
                      className="h-full w-full rounded-full"
                    />
                  </div>
                  <p className="text-sm text-gray-200">{video?.owner?.username}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
        </div>
      </div>
    </section>
  );
}

export default PlaylistVideos;
