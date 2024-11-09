import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { axiosInstance } from "../../helpers/axios.helper";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper";

function UploadVideo({ onClose, onUpdateSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const publishVideo = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("videoFile", data.videoFile[0]);
      formData.append("thumbnail", data.thumbnail[0]);

      const response = await axiosInstance.post("/api/videos/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message);
      onClose();
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (error) {
      toast.error(parseErrorMessage(error?.response?.data || "An unexpected error occurred"));
      console.error("Error uploading video:", error);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
      <div className="fixed inset-0 top-[calc(66px)] z-10 flex flex-col bg-black/50 px-4 pb-[86px] pt-4 sm:top-[calc(82px)] sm:px-14 sm:py-8">
        <div className="mx-auto w-full max-w-lg overflow-auto rounded-lg border border-gray-700 bg-[#121212] p-4">
          <div className="mb-4 flex items-start justify-between">
            <h2 className="text-xl font-semibold">
              Publish Video
              <span className="block text-sm text-gray-300">
                Upload and share your video content.
              </span>
            </h2>
            <button className="h-6 w-6" onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(publishVideo)}>
            {/* Thumbnail Field */}
            <label htmlFor="thumbnail" className="mb-1 inline-block">
              Thumbnail<sup>*</sup>
            </label>
            <label
              className="relative mb-4 block cursor-pointer border border-dashed p-2 after:absolute after:inset-0 after:bg-transparent hover:after:bg-black/10"
              htmlFor="thumbnail"
            >
              <input
                type="file"
                id="thumbnail"
                className="sr-only"
                {...register("thumbnail", { required: "Please upload a thumbnail" })}
              />
              <img
                src="https://via.placeholder.com/300x150.png?text=Thumbnail+Placeholder"
                alt="Upload Thumbnail"
              />
            </label>
            {errors.thumbnail && <p className="text-red-500">{errors.thumbnail.message}</p>}

            {/* Video File Field */}
            <div className="mb-6">
              <label htmlFor="videoFile" className="mb-1 inline-block">
                Video File<sup>*</sup>
              </label>
              <input
                id="videoFile"
                type="file"
                className="w-full border bg-transparent p-2"
                {...register("videoFile", { required: "Please upload a video file" })}
              />
              {errors.videoFile && <p className="text-red-500">{errors.videoFile.message}</p>}
            </div>

            {/* Title Field */}
            <div className="mb-6">
              <label htmlFor="title" className="mb-1 inline-block">
                Title<sup>*</sup>
              </label>
              <input
                id="title"
                type="text"
                className="w-full border bg-transparent px-2 py-1 outline-none"
                placeholder="Enter the title of the video"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && <p className="text-red-500">{errors.title.message}</p>}
            </div>

            {/* Description Field */}
            <div className="mb-6">
              <label htmlFor="description" className="mb-1 inline-block">
                Description<sup>*</sup>
              </label>
              <textarea
                id="description"
                className="h-40 w-full resize-none border bg-transparent px-2 py-1 outline-none"
                placeholder="Enter the description of the video"
                {...register("description", { required: "Description is required" })}
              ></textarea>
              {errors.description && <p className="text-red-500">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="border px-4 py-3" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="bg-[#ae7aff] px-4 py-3 text-black">
                Publish
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadVideo;
