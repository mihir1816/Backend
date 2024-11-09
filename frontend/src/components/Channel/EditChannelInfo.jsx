import { useEffect } from 'react';
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { selectCurrentUser } from "../../app/Slices/authSlice";
import {axiosInstance} from '../../helpers/axios.helper.js';
import { toast } from 'react-toastify';
import {parseErrorMessage} from '../../helpers/parseErrMsg.helper.js';

function EditChannelInfo() {
  const user = useSelector(selectCurrentUser);

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setValue("discriptions", user.discriptions);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    const updatedInfo = {
      username: data.username,
      discriptions: data.discriptions,
    };

    try {
      const response = await axiosInstance.patch(`/api/users/update-channel-info`, updatedInfo);
      toast.success(response.data.message);
    } catch (error) {
      const errorMessage = error.response ? error.response.data : "Cannot change channel info. Please try again...";
      toast.error(parseErrorMessage(errorMessage));
      console.error('Error in changing channel info:', error);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-y-4 py-4">
      <div className="w-full sm:w-1/2 lg:w-1/3">
        <h5 className="font-semibold">Channel Info</h5>
        <p className="text-gray-300">Update your Channel details here.</p>
      </div>
      <div className="w-full sm:w-1/2 lg:w-2/3">
        <form className="rounded-lg border" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap gap-y-4 p-4">
            <div className="w-full">
              <label className="mb-1 inline-block" htmlFor="username">
                Username
              </label>
              <div className="flex rounded-lg border">
                <p className="flex shrink-0 items-center border-r border-white px-3 align-middle">
                  vidplay.com/
                </p>
                <input
                  type="text"
                  className="w-full bg-transparent px-2 py-1.5"
                  id="username"
                  placeholder="@username"
                  {...register("username")} 
                />
              </div>
            </div>
            <div className="w-full">
              <label className="mb-1 inline-block" htmlFor="desc">
                Description
              </label>
              <textarea
                className="w-full rounded-lg border bg-transparent px-2 py-1.5"
                rows="4"
                id="desc"
                {...register("discriptions")}
              />
            </div>
          </div>

          <hr className="border border-gray-300" />
          <div className="flex items-center justify-end gap-4 p-4">
            <button type="button" className="inline-block rounded-lg border px-3 py-1.5 hover:bg-white/10">
              Cancel
            </button>
            <button type="submit" className="inline-block bg-[#ae7aff] px-3 py-1.5 text-black">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditChannelInfo;
