import React from 'react'
import { Link } from 'react-router-dom'

function PleaseLogIn() {


  return (
    <section className="w-full flex items-center justify-center pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
       {/* <div className="flex items-center justify-center min-h-screen bg-[#121212] text-white"> */}
            <div className="text-center ">
                {/* Sign-in Icon */}
                <div className="bg-[#ae7aff] p-6 rounded-full w-24 h-24 mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-white mx-auto">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A3.75 3.75 0 0012 1.5a3.75 3.75 0 00-3.75 3.75V9m3.75 6v2.25m0 2.25v2.25m-5.25-6H5.25A2.25 2.25 0 013 14.25V9a6 6 0 1112 0v5.25a2.25 2.25 0 01-2.25 2.25H12z" />
                    </svg>  
                </div>

                <h1 className="text-3xl font-bold mb-3">Sorry !! You are not Logged In</h1>
                <p className="text-md mb-3">Please Log In if you have account</p>
                <p className="text-md mb-6">Or Sign Up if you don't have one...</p>
                
                <div className="mb-8 mt-auto flex justify-center items-center w-full flex-wrap gap-4 px-4 sm:mb-0 sm:mt-0 sm:items-center sm:px-0">
                <Link to={"/login"} state={{ from: window.location.pathname }}>
                  <button className="mr-1 w-full bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto">
                  Log in
                  </button>
                </Link>
                <Link to={"/signup"} state={{ from: window.location.pathname }}>
                  <button className="mr-1 w-full bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto">
                    Sign up
                  </button>
                </Link>
            </div>
            </div>
        {/* </div> */}
        </section>
  )


}

export default PleaseLogIn