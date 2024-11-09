import React , {useEffect , useState} from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector  } from "react-redux";
import { selectCurrentUser } from "../../app/Slices/authSlice";
import { useForm } from "react-hook-form";
import { axiosInstance } from '../../helpers/axios.helper.js';
import { toast } from 'react-toastify';
import { parseErrorMessage } from '../../helpers/parseErrMsg.helper.js';

function Settings() {
  
  const [user, setUser] = useState(null);
  const { register, handleSubmit, watch } = useForm();

  const getUser = async () => {
    try {
      const response = await axiosInstance.get("/api/users/current-user");
      toast.success("get current user successfully...");
      setUser(response.data.data);
      console.log(user) ; 
    } catch (error) {
      console.error("BACKEND_ERROR :: GET CURRENT USER");
      toast.error("Not logged In...😕");
      throw error;
    }
  } 
  


  

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    maxContentLength: 5 * 1024 * 1024, 
    maxBodyLength: 5 * 1024 * 1024,
  };

  const onSubmit = async (data) => {
    const formDataCover = new FormData();
    const formDataAvatar = new FormData();
  
    if (data.coverImage[0]) {
      formDataCover.append('coverImage', data.coverImage[0]);
  
      try {
        const response = await axiosInstance.patch('/api/users/cover-image', formDataCover, config);
        toast.success(response.data.message);
      } catch (error) {
        const errorMessage = error.response ? error.response.data : "Cannot change cover image info. Please try again...";
        toast.error(parseErrorMessage(errorMessage));
        console.error('Error in changing cover image:', error);
      }
    }
  

    if (data.avatar[0]) {
      formDataAvatar.append('avatar', data.avatar[0]);
  
      try {
        const response = await axiosInstance.patch('/api/users/avatar', formDataAvatar, config);
        toast.success(response.data.message);
      } catch (error) {
        const errorMessage = error.response ? error.response.data : "Cannot change avatar info. Please try again...";
        toast.error(parseErrorMessage(errorMessage));
        console.error('Error in changing avatar:', error);
      }
    }
    getUser() ; 

  };

  useEffect(() => {
    getUser() ; 
 }, [])
  

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="relative min-h-[150px] w-full pt-[16.28%]">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={user?.coverImage}
              alt="cover-photo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <input 
              type="file" 
              id="cover-image" 
              className="hidden" 
              {...register("coverImage")} 
            />
            <label
              htmlFor="cover-image"
              className="inline-block h-10 w-10 cursor-pointer rounded-lg bg-white/60 p-1 text-[#ae7aff] hover:bg-white"
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
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                ></path>
              </svg>
            </label>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-4 pb-4 pt-6">
            <div className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2">
              <img
                src={user?.avatar}
                alt="Channel"
                className="h-full w-full object-cover"
              />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <input 
                  type="file" 
                  id="profile-image" 
                  className="hidden" 
                  {...register("avatar")} 
                />
                <label
                  htmlFor="profile-image"
                  className="inline-block h-8 w-8 cursor-pointer rounded-lg bg-white/60 p-1 text-[#ae7aff] hover:bg-white"
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
                      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                    ></path>
                  </svg>
                </label>
              </div>
            </div>
            <div className="mr-auto inline-block">
              <h1 className="font-bold text-xl">{user?.fullName}</h1>
              <p className="text-sm text-gray-400">{user?.username}</p>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="group/btn mr-1 flex w-full h-9 items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto">
                Update
              </button>

              <NavLink to={`/user/${user?.username}/${user?._id}`}>
              <button className="group/btn mr-1 flex w-full h-9 items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto">
                View channel
              </button>
              </NavLink>
            </div>
          </div>
          <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 border-b-2 border-gray-400 bg-[#121212] py-2 sm:top-[82px]">
            <li className="w-full">
              <NavLink to={"personalInfo"} className={({ isActive }) => 
                `w-full px-3 py-1.5 ${isActive ? 'border-b-2 border-[#ae7aff] bg-white text-[#ae7aff]' : 'border-b-2 border-transparent text-gray-400'}`
              }>
                <button className="w-full">
                  Personal Information
                </button>
              </NavLink>
            </li>
            <li className="w-full">
              <NavLink to={"channelinfo"} className={({ isActive }) => 
                `w-full px-3 py-1.5 ${isActive ? 'border-b-2 border-[#ae7aff] bg-white text-[#ae7aff]' : 'border-b-2 border-transparent text-gray-400'}`
              }>
                <button className="w-full">
                  Channel Information
                </button>
              </NavLink>
            </li>
            <li className="w-full">
              <NavLink to={"changepwd"} className={({ isActive }) => 
                `w-full px-3 py-1.5 ${isActive ? 'border-b-2 border-[#ae7aff] bg-white text-[#ae7aff]' : 'border-b-2 border-transparent text-gray-400'}`
              }>
                <button className="w-full">
                  Change Password
                </button>
              </NavLink>
            </li>
          </ul>
        </div>
      </form>

      <Outlet />
    </section>
  );
}

export default Settings;
