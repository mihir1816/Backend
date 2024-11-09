import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { signup } from "../../app/Slices/authSlice.js"; // Import your signup action
import { Input } from "../Input.jsx"; // Ensure these components exist
import { Button } from "../Botton.jsx" // Ensure these components exist
import { useNavigate, useLocation } from "react-router-dom";

function SignUp() {
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/login";
  

  const signupFun = async (data) => {

      const formData = new FormData();  
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("fullName", data.fullName);
      if (data.avatar[0]) {
        formData.append("avatar", data.avatar[0]);  
      }
      if (data.coverImage[0]) {
        formData.append("coverImage", data.coverImage[0]);
      }   
    setError("");
    try {
      console.log(data) ; 
      const result = await dispatch(signup(formData)).unwrap();
      navigate(from, { replace: true }); 
    } catch (error) {
      setError(error); 
      console.log("Signup dispatch error: " + error);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-black">
      <div className="mx-auto w-full max-w-lg bg-gray-800 rounded-xl p-8 border border-black/10">
        <h2 className="text-center text-2xl font-bold leading-tight text-white">Create an Account</h2>
        <p className="mt-1 text-center text-base text-gray-300">
          Already have an Account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-blue-400 transition-all duration-200 hover:underline"
          >
            Sign in now
          </Link>
        </p>
        {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
        <form onSubmit={handleSubmit(signupFun)} className="mt-2">
          <div className="space-y-2">
            <label className="block mb-1 text-white">* Username</label>
            <Input
              placeholder="Choose your Username"
              {...register("username", { required: true })}
            />
            <label className="block mb-1 text-white">* Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            <label className="block mb-1 text-white">* Password</label>
            <Input
              type="password"
              placeholder="Create your password"
              {...register("password", { required: true })}
            />
            <label className="block mb-1 text-white">* Full Name</label>
            <Input
              placeholder="Enter your full name"
              {...register("fullName", { required: true })}
            />
            <div>
              <label className="block mb-1 text-white">* Avatar</label>
              <input type="file" {...register("avatar")} className="border rounded p-2 w-full" />
              <span className="text-gray-400">No file chosen</span>
            </div>
            <div>
              <label className="block mb-1 text-white">Cover Image</label>
              <input type="file" {...register("coverImage")} className="border rounded p-2 w-full" />
              <span className="text-gray-400">No file chosen</span>
            </div>
            <Button type="submit" className="w-full mt-4">
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
