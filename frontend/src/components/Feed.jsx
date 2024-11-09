import React from "react";
import { Aside } from "./index";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {selectCurrentUser} from '../app/Slices/authSlice.js'
import PleaseLogIn from "../pages/PleaseLogIn.jsx";

function Feed() {

  const user = useSelector(selectCurrentUser);


  return (
    <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
      <Aside />
      {
        !user ? 
        <PleaseLogIn/>
        :
        <Outlet/>
      }
      
    </div>
  );
}

export default Feed;
