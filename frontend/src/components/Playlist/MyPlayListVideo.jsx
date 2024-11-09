import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect , useState} from "react";
import { axiosInstance } from "../../helpers/axios.helper.js";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper.js";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import DeletePlayList from "./DeletePlayList.jsx";
import EditPlaylist from './EditPlaylist.jsx'

function MyPlayListVideo() {

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
      toast.success(response.data.message);
      setplaylist(response.data.data);
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
    }
  };

  const [user, setuser] = useState(null)
  const renderPlayListOwner = async () => {
    try {
      const response = await axiosInstance.get(`/api/users/c/${username}`);
      console.log(response) ; 
      toast.success(response.data.message);
      setuser(response.data.data);
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
    }
  };

  const [noOfSubscribers, setNoOfSubscribers] = useState(80) ;    
  const fetchNoOfSub = async () => {
    try { 
      const response = await axiosInstance.get(`/api/subscriptions/c/${user?._id}`);
      setNoOfSubscribers(response.data.data.length);
    } catch (error) {
      toast.error(parseErrorMessage(error?.response?.data));
      console.error("Error fetching sub list and count data:", error);
    }
  };
  
  const [allVideosOfPlayList, setallVideosOfPlayList] = useState(null)
  const renderAllVideos = async () => {
    try {
      const response = await axiosInstance.get(`/api/playlist/user/allvideos/${playlistId}`);
      console.log(response) ; 
      toast.success(response.data.message);
      setallVideosOfPlayList(response.data.data.videos);
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
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



const handleDeleteButtonClickVideo = async (videoId) => {
  try {
    const response = await axiosInstance.patch(`/api/playlist/remove/${videoId}/${playlistId}`);
    toast.success(response.data.message);
    await renderAllVideos();
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data
      : "Failed to delete video from playlist. Please try again...";
    toast.error(parseErrorMessage(errorMessage));
    console.error("Error deleting VIDEO FROM PLAYLIST:", error);
  }
};

 // for delete popup

 const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
 const [playListIdToDelete, setplayListIdToDelete] = useState(null);

 const handleDeleteButtonClick = () => {
  setplayListIdToDelete(playlistId); 
   setDeleteModalOpen(true);
 };

 const closeDeleteModal = () => {
   setDeleteModalOpen(false); 
   setplayListIdToDelete(null); 
 };

 // for update popup
 
 const [updateModelOpen, setupdateModelOpen] = useState(false)
 const [playListIdToUpdate, setPlayListIdToUpdate] = useState(null);

 const handleUpdateButtonClick = () => {
  setPlayListIdToUpdate(playlistId); 
   setupdateModelOpen(true);
 };

 const closeUpdateModal = () => {
  setPlayListIdToUpdate(null); 
  setupdateModelOpen(false)
 };

 const reloadPlaylist = async () => {
  await renderThisPlayList();
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
            <div className="flex gap-4">
                      {/* Delete Action */}
                      <button 
                      className="h-5 w-5 hover:text-[#ae7aff]"
                      onClick={ handleDeleteButtonClick}
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
                      onClick={handleUpdateButtonClick}
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


        <div className="flex w-full flex-col gap-y-4">

        {allVideosOfPlayList && allVideosOfPlayList.map((video) => (
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
              
                <img
                  src={video?.owner?.avatar}
                  alt={video?.owner?.username}
                  className="h-full w-full rounded-full"
                />
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
                <button
                    className="h-5 mt-3 ml-2 w-5 hover:text-[#ae7aff]"
                    onClick={() => handleDeleteButtonClickVideo(video?._id)}
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
              </div>
            </div>
          </div>
        </div>
      ))}
        </div>
      </div>

      {isDeleteModalOpen && (
        <DeletePlayList playListId={playListIdToDelete} onClose={closeDeleteModal} 
        // onUpdateSuccess={reloadPlaylist}
        />
      )}

      {
        updateModelOpen && 
        <EditPlaylist playListId={playListIdToUpdate} onClose={closeUpdateModal} onUpdateSuccess={reloadPlaylist}/>
      }
    </section>
  );
}

export default MyPlayListVideo;
