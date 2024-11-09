import { useEffect } from 'react';
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { selectCurrentUser } from "../../app/Slices/authSlice";
import {axiosInstance} from '../../helpers/axios.helper.js';
import { toast } from 'react-toastify';
import {parseErrorMessage} from '../../helpers/parseErrMsg.helper.js';

function ChangePassword() {
  // Initialize useForm
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const newPassword = watch('newPassword', '');

  const onSubmit = async (data) => {
    const { oldPassword, newPassword } = data; 

    try {
      const response = await axiosInstance.post('https://yt-backend-lo6n.onrender.com/api/v1/users/change-password', {
        oldPassword,
        newPassword,
      });
      toast.success(response.data.message);
    } catch (error) {
      const errorMessage = error.response ? error.response.data : "Cannot change password. Please try again...";
      toast.error(parseErrorMessage(errorMessage));
      console.error('Error in changing password:', error);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-y-4 py-4">
      <div className="w-full sm:w-1/2 lg:w-1/3">
        <h5 className="font-semibold">Password</h5>
        <p className="text-gray-300">Please enter your current password to change your password.</p>
      </div>
      <div className="w-full sm:w-1/2 lg:w-2/3">
        <form className="rounded-lg border" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap gap-y-4 p-4">
            <div className="w-full">
              <label className="mb-1 inline-block" htmlFor="old-pwd">
                Current password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border bg-transparent px-2 py-1.5"
                id="old-pwd"
                placeholder="Current password"
                {...register("oldPassword", { required: "Current password is required" })} // Register current password
              />
              {errors.oldPassword && <p className="text-red-500">{errors.oldPassword.message}</p>}
            </div>
            <div className="w-full">
              <label className="mb-1 inline-block" htmlFor="new-pwd">
                New password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border bg-transparent px-2 py-1.5"
                id="new-pwd"
                placeholder="New password"
                {...register("newPassword", { 
                  required: "New password is required", 
                  minLength: { value: 8, message: "Password must be at least 8 characters" }
                })} 
              />
              {errors.newPassword && <p className="text-red-500">{errors.newPassword.message}</p>}
              <p className="mt-0.5 text-sm text-gray-300">
                Your new password must be more than 8 characters.
              </p>
            </div>
            <div className="w-full">
              <label className="mb-1 inline-block" htmlFor="cnfrm-pwd">
                Confirm password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border bg-transparent px-2 py-1.5"
                id="cnfrm-pwd"
                placeholder="Confirm password"
                {...register("confirmPassword", { 
                  required: "Confirm password is required", 
                  validate: value => value === newPassword || "Passwords do not match"
                })} 
              />
              {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
            </div>
          </div>
          <hr className="border border-gray-300" />
          <div className="flex items-center justify-end gap-4 p-4">
            <button type="button" className="inline-block rounded-lg border px-3 py-1.5 hover:bg-white/10">
              Cancel
            </button>
            <button type="submit" className="inline-block bg-[#ae7aff] px-3 py-1.5 text-black">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;