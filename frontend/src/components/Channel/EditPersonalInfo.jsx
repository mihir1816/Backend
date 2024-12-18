import { useEffect } from 'react';
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { selectCurrentUser } from "../../app/Slices/authSlice";
import {axiosInstance} from '../../helpers/axios.helper.js';
import { toast } from 'react-toastify';
import {parseErrorMessage} from '../../helpers/parseErrMsg.helper.js';

function PersonalInfoForm() {
  const user = useSelector(selectCurrentUser);

  // Initialize the useForm hook
  const { register, handleSubmit, setValue } = useForm();

  // Populate form with user's existing data
  useEffect(() => {
    if (user?.fullName) {
      const nameParts = user.fullName.split(' ');
      setValue("firstName", nameParts[0]);
      setValue("lastName", nameParts.slice(1).join(' '));
    }
    setValue("email", user?.email || "");
  }, [user, setValue]);

  // Function to handle form submission
  const onSubmit = async (data) => {
    const updatedInfo = {
      fullName: `${data.firstName} ${data.lastName}`,
      email: data.email,
    };

    try {
      const response = await axiosInstance.patch(`https://yt-backend-lo6n.onrender.com/api/v1/users/update-account`, updatedInfo);
      toast.success(response.data.message);
    } catch (error) {
      const errorMessage = error.response ? error.response.data : "Cannot change personal info. Please try again...";
      toast.error(parseErrorMessage(errorMessage));
      console.error('Error in changing info:', error);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-y-4 py-4">
      <div className="w-full sm:w-1/2 lg:w-1/3">
        <h5 className="font-semibold">Personal Info</h5>
        <p className="text-gray-300">Update your photo and personal details.</p>
      </div>
      <div className="w-full sm:w-1/2 lg:w-2/3">
        <form className="rounded-lg border" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap gap-y-4 p-4">
            <div className="w-full lg:w-1/2 lg:pr-2">
              <label htmlFor="firstName" className="mb-1 inline-block">
                First name
              </label>
              <input
                type="text"
                className="w-full rounded-lg border bg-transparent px-2 py-1.5"
                id="firstName"
                {...register("firstName")} 
              />
            </div>
            <div className="w-full lg:w-1/2 lg:pl-2">
              <label htmlFor="lastName" className="mb-1 inline-block">
                Last name
              </label>
              <input
                type="text"
                className="w-full rounded-lg border bg-transparent px-2 py-1.5"
                id="lastName"
                {...register("lastName")} 
              />
            </div>
            <div className="w-full">
              <label htmlFor="email" className="mb-1 inline-block">
                Email address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300">
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
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  className="w-full rounded-lg border bg-transparent py-1.5 pl-10 pr-2"
                  id="email"
                  {...register("email")} 
                />
              </div>
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

export default PersonalInfoForm;
