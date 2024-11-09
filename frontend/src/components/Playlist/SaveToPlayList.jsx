import React, { useState, useEffect } from 'react';
import { axiosInstance } from "../../helpers/axios.helper.js";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper";
import { toast } from "react-toastify";

const SaveToPlayList = ({ videoId, onClose, userId }) => {
  const [newPlaylist, setNewPlaylist] = useState(false);
  const [existingPlaylist, setExistingPlaylist] = useState([]);

  const [selectedPlaylists, setSelectedPlaylists] = useState({}); // State for selected playlists

  const fetchPlayLists = async () => {
    try {
      const response = await axiosInstance.get(`https://yt-backend-lo6n.onrender.com/api/v1/playlist/user/${userId}`);
      toast.success(response.data.message);
      setExistingPlaylist(response.data.data);

      const initialStatus = response.data.data.reduce((acc, playlist) => {
        acc[playlist._id] = playlist.videos.includes(videoId);
        return acc;
      }, {});
      setSelectedPlaylists(initialStatus);

    } catch (error) {
      toast.error(parseErrorMessage(error?.response?.data));
      console.error("Error fetching playlist:", error);
    }
  };
  useEffect(() => {
    fetchPlayLists();
  }, []);



  const [playlistName, setPlaylistName] = useState('');

  const handleCreatePlaylist = async () => {
    const data = {
      name: playlistName,
      description: ""
    };
    try { 
      const response = await axiosInstance.post(`https://yt-backend-lo6n.onrender.com/api/v1/playlist/`, data); 
      toast.success(response.data.message); 
      console.log(response); 
      setPlaylistName(''); 
      fetchPlayLists();  
    } catch (error) {
      toast.error(parseErrorMessage(error?.response?.data)); 
      console.error("Error creating new playlist:", error);
    }
  };



  const handleCheckboxChange = async (playlistId) => {

    const newCheckedState = !selectedPlaylists[playlistId];
  
    setSelectedPlaylists((prevState) => ({
      ...prevState,
      [playlistId]: newCheckedState,
    }));
  
    try {
      if (newCheckedState) {
        const response = await axiosInstance.patch(`https://yt-backend-lo6n.onrender.com/api/v1/playlist/add/${videoId}/${playlistId}`);
        toast.success(response.data.message); 
      } else {
        const response = await axiosInstance.patch(`https://yt-backend-lo6n.onrender.com/api/v1/playlist/remove/${videoId}/${playlistId}`, { videoId });
        toast.success(response.data.message); 
      }
      console.log("status of aviability has been updated...")
    } catch (error) {
      console.error("Error updating playlist:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
      <div className="relative bg-black shadow-lg p-6 rounded-lg w-80">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-2 py-1"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4">Save to Playlist</h3>

        <div className="mb-4 h-40 overflow-auto">
        {existingPlaylist && existingPlaylist.map((playlist) => (
            <label key={playlist._id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={!!selectedPlaylists[playlist._id]}
                onChange={() => handleCheckboxChange(playlist._id)}
                className="mr-2"
              />
              {playlist.name} 
            </label>
          ))}
        </div>

        <input
          type="text"
          placeholder="Enter playlist name"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)} // Correctly set the input value
          className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
        />
        <button
          onClick={handleCreatePlaylist}
          className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Create new playlist
        </button>
      </div>
    </div>
  );
};

export default SaveToPlayList;
