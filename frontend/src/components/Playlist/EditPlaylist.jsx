import React from "react";
import { axiosInstance } from "../../helpers/axios.helper.js";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form"; 

function EditPlaylist({ playListId, onClose , onUpdateSuccess }) {


 const {
    register, 
    handleSubmit,   
    formState: { errors }, 
  } = useForm();

  const updateVideo = async (data) => {

    const formData = new FormData();  
    formData.append("name", data.name);
    formData.append("description", data.description);
    if (data.thumbnail[0]) {
        formData.append("thumbnail", data.thumbnail[0]);  
    }

    try {
      console.log(data) ;
      const response = await axiosInstance.patch(`https://yt-backend-lo6n.onrender.com/api/v1/playlist/${playListId}`, formData);
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
              Edit playList
              <span className="block text-sm text-gray-300">
                Share where you&#x27;ve worked on your playList.
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

        <form onSubmit={handleSubmit(updateVideo)}>
            <label for="thumbnail" className="mb-1 inline-block">
              Thumbnail
              
            </label>
            <label
              className="relative mb-4 block cursor-pointer border border-dashed p-2 after:absolute after:inset-0 after:bg-transparent hover:after:bg-black/10"
              htmlFor="thumbnail"
            >
              <input type="file" className="sr-only" id="thumbnail"
              {...register("thumbnail")}
              />
              <img
                src="https://images.pexels.com/photos/7775641/pexels-photo-7775641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="State Management with Redux"
              />
            </label>
            <div className="mb-6 flex flex-col gap-y-4">
              <div className="w-full">
                <label htmlFor="title" className="mb-1 inline-block">
                  Name
                  
                </label>
                <input
                  id="title"
                  type="text"
                  className="w-full border bg-transparent px-2 py-1 outline-none"
                  placeholder="Enter title of the playList"
                {...register("name")}
                />
              </div>
              <div className="w-full">
                <label htmlFor="desc" className="mb-1 inline-block">
                  Description
                </label>
                <textarea
                  id="desc"
                  className="h-40 w-full resize-none border bg-transparent px-2 py-1 outline-none"
                  placeholder="Enter title of the playList"
                  {...register("description")}
                >
                </textarea>

                

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

export default EditPlaylist;
