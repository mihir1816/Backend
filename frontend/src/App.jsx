import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  logout, getCurrentUser } from "./app/Slices/authSlice";
import { healthCheck } from "./app/Slices/healthcheck";
import { useDispatch, useSelector } from "react-redux";
import { useEffect , useState } from "react";
import { Outlet } from "react-router-dom";
import {selectCurrentUser } from './app/Slices/authSlice.js'

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    dispatch(healthCheck()).then(() => {
      dispatch(getCurrentUser()).then(() => {

        const timer = setTimeout(() => {
            setInitialLoading(false);
        }, 400); 
        return () => clearTimeout(timer);

      });
    });
    setInterval(() => {
      dispatch(healthCheck());
    }, 5 * 60 * 1000);
  }, []);

  if (initialLoading)
    return (
      <div className="h-screen w-full  overflow-y-auto bg-[#121212] text-white">
        <div className="flex flex-col items-center justify-center mt-60">
        <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width="120"
        height="120"
        style={{
          shapeRendering: "auto",
          display: "block",
          background: "transparent",
        }}
      >
        <g>
          <path
            stroke="none"
            fill="#ae7aff"
            d="M10 50A40 40 0 0 0 90 50A40 42.5 0 0 1 10 50"
          >
            <animateTransform
              values="0 50 51.25;360 50 51.25"
              keyTimes="0;1"
              repeatCount="indefinite"
              dur="1s"
              type="rotate"
              attributeName="transform"
            ></animateTransform>
          </path>
        </g>
      </svg>
          <h1 className="text-3xl text-center mt-8 font-semibold">Please wait...</h1>
          <h1 className="text-xl text-center mt-4">Refresh the page if it takes too long</h1>
        </div>
      </div>
    );

  return (
    <>
      <Outlet />
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition:Bounce
      />
    </>
  );
}

export default App;