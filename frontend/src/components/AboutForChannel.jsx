import React from "react";
import {useLocation} from 'react-router-dom'
import {useState , useEffect} from 'react'
import { axiosInstance } from "../helpers/axios.helper.js";  
import { toast } from "react-toastify"; 
import { NavLink } from "react-router-dom";

const AboutSection = () => {

    const location = useLocation();
    const path = location.pathname.split("/");
    const username = path[2]; 

    const [isLoading, setisLoading] = useState(true)


    const [user, setuser] = useState(null)

    const renderUser = async () => {
      try {
        const response = await axiosInstance.get(`https://yt-backend-lo6n.onrender.com/api/v1/users/c/${username}`); 
        // toast.success(response.data.message); 
        console.log(response); 
        setuser(response.data.data) ; 
      } catch (error) {
        // toast.error(parseErrorMessage(error.response.data));
        // setError(error.message || "Failed to fetch videos. Please try again...");
        console.error("user fetching error:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      renderUser().finally(() => setisLoading(false));
    }, 300);
    return () => clearTimeout(timer); 
  }, [username]);

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(date.getFullYear()).slice(2); // Get last two digits of the year
  
    return `${day}/${month}/${year}`;
  }

  if (isLoading) {
    return (
      <div className=" text-white px-6 py-4 mt-3 rounded-lg shadow-lg text-transparent w-full h-full bg-slate-100/10 animate-pulse">
        <div className="flex items-center mb-2">
          <h2 className="text-3xl w-56 h-10 bg-slate-100/10 animate-pulse rounded-lg"></h2>
        </div>

        <div className="mb-4">
          <h2 className=" w-1/2 h-6 bg-slate-100/10 animate-pulse rounded-lg"></h2>
        </div>

        {/* Channel Details */}
        <div className="mb-6">
          <div className=" w-40 h-9 mb-3 bg-slate-100/10 animate-pulse rounded-lg"></div>
          <p className="ml-1 mb-[6px] flex">
            <div className="font-bold inline-block h-6 w-6 mr-2 bg-slate-100/10 animate-pulse rounded-full"></div>
            <div className=" w-48 h-6 bg-slate-100/10 animate-pulse rounded-lg"></div>
          </p>
          <p className="ml-1 mb-[6px] flex">
            <div className="font-bold inline-block h-6 w-6 mr-2 bg-slate-100/10 animate-pulse rounded-full"></div>
            <div className=" w-48 h-6 bg-slate-100/10 animate-pulse rounded-lg"></div>
          </p>
          <p className="ml-1 mb-[6px] flex">
            <div className="font-bold inline-block h-6 w-6 mr-2 bg-slate-100/10 animate-pulse rounded-full"></div>
            <div className=" w-48 h-6 bg-slate-100/10 animate-pulse rounded-lg"></div>
          </p>
          <p className="ml-1 mb-[6px] flex">
            <div className="font-bold inline-block h-6 w-6 mr-2 bg-slate-100/10 animate-pulse rounded-full"></div>
            <div className=" w-48 h-6 bg-slate-100/10 animate-pulse rounded-lg"></div>
          </p>
          <p className="ml-1 mb-[6px] flex">
            <div className="font-bold inline-block h-6 w-6 mr-2 bg-slate-100/10 animate-pulse rounded-full"></div>
            <div className=" w-48 h-6 bg-slate-100/10 animate-pulse rounded-lg"></div>
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-[#121212] p-4 rounded-lg w-full lg:w-1/3">
      <h2 className="text-2xl text-white font-semibold mb-4">About</h2>
      <div className="border-t border-gray-700 py-4">
        <ul className="space-y-4 text-gray-400">
          
          <li className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"    
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 12a9.75 9.75 0 11-19.5 0 9.75 9.75 0 0119.5 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 15.75l-4.5-4.5-1.5 1.5"
              />
            </svg>
            <span><strong>Channel Name :</strong> {` ${user?.username}`}</span>
          </li>

          <li className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 4.5h16.5M12 9v10m7.5-10v10M4.5 9V7.5a2.25 2.25 0 114.5 0V9m7.5 0V7.5a2.25 2.25 0 114.5 0V9"
              />
            </svg>
            <span><strong>Email:</strong> {user?.email}</span>
          </li>

          <li className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5h7.5m-7.5 3h7.5m-7.5 3h7.5m-7.5 3h7.5m-7.5 3h7.5m-4.5 3H7.5a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 017.5 4.5h9A2.25 2.25 0 0118.75 6.75v10.5A2.25 2.25 0 0116.5 19.5h-1.5"
              />
            </svg>
            <span>
              <strong>Link:</strong>{" "}
              <a
                href={`http://localhost:5173/user/${user?.username}/${user?._id}`}
                className="text-blue-500"
              >
                /Youtube
              </a>
            </span>
          </li>

          <li className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5} 
              stroke="currentColor"
              className="w-6 h-6 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5V15m0 0l3-3m-3 3l-3-3m6 3h6.75M12 15l-6.75 6.75M12 15l6.75-6.75"
              />
            </svg>
            <span><strong>Joined:</strong> {formatDate(user?.createdAt)}</span>
          </li>

        </ul>
      </div>
    </div>
  );
};

export default AboutSection;
