import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { login } from "../../app/Slices/authSlice.js";
import { Input } from '../Input.jsx';
import { Button } from '../Botton.jsx'; 
import { useNavigate, useLocation } from "react-router-dom";
import { axiosInstance } from "../../helpers/axios.helper";
import { toast } from "react-toastify";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper";


function Login() {
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch() ; 

  const from = location.state?.from?.pathname || "/";


  const loginFun = async (data) => {
    setError("");
    try {
      const resultAction = await dispatch(login(data || { 
        email : "one1@gmail.com" , 
        password: "12345678"
    }));
      const user = unwrapResult(resultAction); 
      console.log("user after login : " + user ); 
      toast.success("Logged in successfully 🤩");
      navigate(from, { replace: true });
    } catch (error) {
      setError("Login failed");
      console.log(error);
    }
  };
  

  

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-black">
      <div className="mx-auto w-full max-w-lg bg-gray-800 rounded-xl p-10 border border-black/10">
        <h2 className="text-center text-2xl font-bold text-white leading-tight">Sign in to your account</h2>
        <p className="mt-2 text-center text-base text-gray-300">
          Don&apos;t have an account?&nbsp;
          <Link to="/signup" className="font-medium text-blue-400 transition-all duration-200 hover:underline">
            Sign Up
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center" aria-live="assertive">{error}</p>}
        <form onSubmit={handleSubmit(loginFun)} className='mt-8'>
          <div className='space-y-5'>
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: true })}
            />
            <Button type="submit" className="w-full">Sign in</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
