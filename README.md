<h1 align="center">💥 VideoTube 💥</h1>

### ✨ Built with the tools and technologies:

<p>
  <img src="https://img.shields.io/badge/Express-black?style=flat-square&logo=express" />
  <img src="https://img.shields.io/badge/JSON-black?style=flat-square&logo=json" />
  <img src="https://img.shields.io/badge/npm-red?style=flat-square&logo=npm&logoColor=white" />
  <img src="https://img.shields.io/badge/Autoprefixer-ff4466?style=flat-square&logo=autoprefixer&logoColor=white" />
  <img src="https://img.shields.io/badge/Mongoose-800000?style=flat-square&logo=mongoose&logoColor=white" />
  <img src="https://img.shields.io/badge/PostCSS-dd3a0a?style=flat-square&logo=postcss&logoColor=white" />
  <img src="https://img.shields.io/badge/.ENV-yellowgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/JavaScript-yellow?style=flat-square&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Nodemon-76D04B?style=flat-square&logo=nodemon&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646cff?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white" />
</p>

---

## Important links

| Content              | Link                                                                             |
| ---------------------|----------------------------------------------------------------------------------|
| Live Link            | [click here](https://yt-frontend-3wa2.onrender.com)                              |
| API Documentation    | [click here](https://www.postman.com/mihir-181/workspace/videotube-by-mihir/collection/38495679-bb3201fc-480e-492f-854c-4b044fb4945a?action=share&creator=38495679&active-environment=38495679-134b40e6-764e-4fd1-bef9-dac2fa5c03f0)         |
| Model                | [click here ](https://app.eraser.io/workspace/cATefMPkrAdzR9c6teox?origin=share) |

## Overview

``PlayTube (YOUTUBE + TWITTER)`` is a project designed that have functionality of a video hosting platform similar to YouTube and micro-blogging feature similar to twitter. This project's backend is built using Node.js, Express.js, React.js, MongoDB, and incorporates various other technologies to ensure a robust and system. The project aims to provide a complete features for a video hosting website, featuring essential functionalities such as user authentication, video uploading, liking, disliking, commenting, subscribing/unsubscribing, admin panel, watch history, liked videos etc.It includes features that utilizing standard practices such as JWT, bcrypt, access tokens, and refresh tokens for security. Find more about his project in the documentation below.

## Features

### User Management:

- Registration, login, logout, change password
- Profile management (avatar, cover image, other details)
- Watch history tracking and Clearing Watch History
- Liked videos tracking

### Video Management:

- Video upload
- Canceling Video upload with all resources cleaned up on backend.
- Visibility control (publish/un-publish)
- Video editing and deletion
- Video Search and pagination

### Tweet Management:

- Tweet creation and publishing
- Viewing user tweets
- Updating and deleting tweets
- Liking-disliking tweets

### Subscription Management:

- Subscribing to channels
- Viewing Channel subscriber
- Viewing Subscribed channel lists

### Playlist Management:

- Creating, updating, and deleting playlists
- Adding videos to playlists
- Removing videos from playlists and undoing them
- Viewing user playlists

### Like Management:

- Liking and Un-liking videos, comments, and tweets
- Viewing liked videos

### Comment Management:

- Adding, updating, and deleting comments on videos

### Dashboard:

- Viewing channel statistics (views, subscribers, videos, likes)
- Accessing uploaded videos and Controls
- Viewing Video statistics (PublishStatus, VideoName, DateUploaded, Views, TotalComments, LikeRatings)

### Health Check:

- Endpoint to verify the server's health

## Technologies

- Node.js: The runtime environment for executing JavaScript code server-side.
- Express.js: A web application framework for Node.js.
- MongoDB: A NoSQL database used for storing application data.
- Mongoose: An Object Data Modeling (ODM) library for MongoDB and Node.js.
- JWT: JSON Web Tokens for securely transmitting information between parties as a JSON object.

## Installation and Setup
1. **Clone the repository:**

    ```bash
    git clone https://github.com/mihir1816/Backend.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd Backend
    ```
3. ⚙️ Environment Variables

Create a `.env` file inside the `backend/` directory and add the following:

```env
PORT=
MONGODB_URI=
CORS_ORIGIN=
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY = 
REFRESH_TOKEN_SECRET = 
REFRESH_TOKEN_EXPIRY = 
CLOUDINARY_CLOUD_NAME = 
CLOUDINARY_API_KEY = 
CLOUDINARY_API_SECRET = 
```

---

4. **Install the dependencies:**
    ```bash
    cd server\
    ```
    ```bash
    npm install
    ```
    ```bash
    cd frontend\
    ```
   ```bash
    npm install
    ```
---

## 🧩 Usage

### Start the backend server:

```bash
cd server
```
```bash
npm run dev
```
### Start the frontend:

```bash
cd frontend
```
```bash
npm run dev
```

---
