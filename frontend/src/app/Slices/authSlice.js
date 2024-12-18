import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../helpers/axios.helper";
import { toast } from "react-toastify";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper";

const initialState = {
  loading: false,
  status: false,
  userData: null,
};

export const selectCurrentUser = (state) => {
  return state.auth.userData || null; 
}


  export const login = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("https://yt-backend-lo6n.onrender.com/api/v1/users/login", data);
      console.log("full responce: " + response); 
      if (!response.data || !response.data.data) {
        throw new Error("Invalid API response format at login");
      }
      const { accessToken, refreshToken, user } = response.data.data;
      toast.success(response.data.message + " 🤩");
      return user;
    } catch (error) {
      console.error("Error details:", error); // <-- Log the full error object
      toast.error(parseErrorMessage(error.response.data));
      return rejectWithValue(error.response.data);
    }
  });


export const signup = createAsyncThunk("auth/signup", async (data) => {
  try {
    const response = await axiosInstance.post("https://yt-backend-lo6n.onrender.com/api/v1/users/register", data);
    toast.success(response.data.message + " 🤩");
    return response.data.data.user; 
  } catch (error) {
    toast.error(parseErrorMessage(error.response.data));
    console.log(error); 
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await axiosInstance.post("https://yt-backend-lo6n.onrender.com/api/v1/users/logout");
    toast.success("Logged out successfully...");
  } catch (error) {
    toast.error(parseErrorMessage(error.response.data));
  }
});

export const getCurrentUser = createAsyncThunk("auth/getCurrentUser", async () => {
  console.log("step 2 : getCurrentUser dispatched")
  try {
    const response = await axiosInstance.get("https://yt-backend-lo6n.onrender.com/api/v1/users/current-user");
    toast.success("get current user successfully...");
    return response.data.data;
  } catch (error) {
    console.error("BACKEND_ERROR :: GET CURRENT USER");
    toast.error("Not logged In...😕");
    throw error;
  }
});

export const changePassword = createAsyncThunk("auth/changePassword", async (data) => {
  try {
    const response = await axiosInstance.patch("/users/change-password", data);
    toast.success(response.data.message);
    return response.data.data;
  } catch (error) {
    toast.error(parseErrorMessage(error.response.data));
    throw error;
  }
});

// TODO: Refresh Access Token

const updateProfile = createAsyncThunk("auth/updateProfile", async (data) => {
  try {
    const response = await axiosInstance.patch("/users/update-profile", data);
    toast.success(response.data.message);
    return response.data.data;
  } catch (error) {
    toast.error(parseErrorMessage(error.response.data));
    throw error;
  }
});

export const uploadAvatar = createAsyncThunk("user/avatar", async () => {
  try {
    const response = await axiosInstance.get(`/users/avatar`);
    toast.success(response.data.message);
    return response.data.data;
  } catch (error) {
    toast.error(parseErrorMessage(error.response.data));
    console.log(error);
  }
});

export const uploadCoverImage = createAsyncThunk("user/coverImage", async () => {
  try {
    const response = await axiosInstance.get(`/users/cover-image`);
    toast.success(response.data.message);
    return response.data.data;
  } catch (error) {
    toast.error(parseErrorMessage(error.response.data));
    console.log(error);
  }
});

export const watchHistory = createAsyncThunk("user/history", async () => {
  try {
    const response = await axiosInstance.get(`/users/history`);
    toast.success(response.data.message);
    return response.data.data;
  } catch (error) {
    toast.error(parseErrorMessage(error.response.data));
    console.log(error);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  // reducers: {
  //   setUser(state, action) {
  //     state.userData = action.payload;
  //     state.status = true; 
  //   }
  // },
  extraReducers: (builder) => {
    //login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.userData = action.payload;
    });
    builder.addCase(login.rejected, (state) => {
      state.loading = false;
      state.status = false;
      state.userData = null;
    });

    

    //signup
    builder.addCase(signup.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.userData = action.payload;
    });
    builder.addCase(signup.rejected, (state) => {
      state.loading = false;
      state.status = false;
      state.userData = null;
    });

    

    //logout
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.status = false;
      state.userData = null;
    });
    builder.addCase(logout.rejected, (state) => {
      state.loading = false;
    });

    //getCurrentUser
    builder.addCase(getCurrentUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.userData = action.payload;
      state.status = true;
    });
    builder.addCase(getCurrentUser.rejected, (state) => {
      state.loading = false;
      state.userData = null;
      state.status = false;
    });

    //change Password
    builder.addCase(changePassword.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(changePassword.fulfilled, (state) => {
      state.loading = false;
      state.status = true;
    });
    builder.addCase(changePassword.rejected, (state) => {
      state.loading = false;
    });

    //update Profile
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.userData = action.payload;
      state.status = true;
    });
    builder.addCase(updateProfile.rejected, (state) => {
      state.loading = false;
    });

    //update avatar
    builder.addCase(uploadAvatar.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(uploadAvatar.fulfilled, (state, action) => {
      state.loading = false;
      state.userData = action.payload;
      state.status = true;
    });
    builder.addCase(uploadAvatar.rejected, (state) => {
      state.loading = false;
    });

    //update coverImage
    builder.addCase(uploadCoverImage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(uploadCoverImage.fulfilled, (state, action) => {
      state.loading = false;
      state.userData = action.payload;
      state.status = true;
    });
    builder.addCase(uploadCoverImage.rejected, (state) => {
      state.loading = false;
    });

    //get WatchHistory
    builder.addCase(watchHistory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(watchHistory.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.userData = action.payload;
    });
    builder.addCase(watchHistory.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });
  },
});

export default authSlice.reducer;
