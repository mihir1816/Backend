import React from "react";
import { axiosInstance } from "../../helpers/axios.helper.js";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper.js"
import { toast } from "react-toastify";
import { useForm } from "react-hook-form"; 

function EditTweet({ TweetId, onClose , onUpdateSuccess }) {

 const {
    register, 
    handleSubmit, 
    formState: { errors }, 
  } = useForm();

  const updateTweet = async (data) => {
    try {
      console.log(data) ;
      const response = await axiosInstance.patch(`https://yt-backend-lo6n.onrender.com/api/v1/tweets/${TweetId}`, {
        newContent: data.newContent, 
      });
      toast.success(response.data.message);
      onClose(); 
      if (onUpdateSuccess) {
        onUpdateSuccess(); 
      }
    } catch (error) {
      toast.error(parseErrorMessage(error?.response?.data || "An unexpected error occurred"));
      console.error("Error updating video:", error);
    }
  };


  return (
    <div className="relative flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
      <div className="fixed inset-0 top-[calc(66px)] z-10 flex flex-col bg-black/50 px-4 pb-[86px] pt-4 sm:top-[calc(82px)] sm:px-14 sm:py-8">
        <div className="mx-auto w-full max-w-lg overflow-auto rounded-lg border border-gray-700 bg-[#121212] p-4">
          <div className="mb-4 flex items-start justify-between">
            <h2 className="text-xl font-semibold">
              Edit tweet
              <span className="block text-sm text-gray-300">
                Share where you&#x27;ve worked on your profile.
              </span>
            </h2>
            <button className="h-6 w-6"
            onClick={onClose}
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
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

        <form onSubmit={handleSubmit(updateTweet)}>
  
            <div className="mb-6 flex flex-col gap-y-4">
              <div className="w-full">
                <label htmlFor="title" className="mb-1 inline-block">
                  New content
                  <sup>*</sup>
                </label>
                <input
                  id="title"
                  type="text"
                  className="w-full border bg-transparent px-2 py-1 outline-none"
                  placeholder="Enter title of the video"
                {...register("newContent")}
                />
              </div>
              <div className="w-full">
                {errors.description && (
                    <p className="text-red-500">{errors.description.message}</p>
                  )}
              </div>
            </div>  

            <div className="grid grid-cols-2 gap-4">
            <button className="border px-4 py-3"
            onClick={onClose}
            >Cancel</button>
            <button type="submit" className="bg-[#ae7aff] px-4 py-3 text-black disabled:bg-[#E4D3FF]"> 
                Update
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditTweet;
