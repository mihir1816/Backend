import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../app/Slices/authSlice.js";

const AboutSection = () => {

  const user = useSelector(selectCurrentUser);

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(date.getFullYear()).slice(2); // Get last two digits of the year
  
    return `${day}/${month}/${year}`;
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
                href="https://playtube/user/mihir181"
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
