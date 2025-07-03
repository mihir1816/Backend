import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express() ; 

app.use(cors({
    origin: ["https://yt-frontend-3wa2.onrender.com", "http://localhost:5173"],
    credentials: true
}));
app.use(express.json({limit:"10mb"}))
app.use(express.urlencoded({extended : true , limit: "10mb"}))
app.use(express.static("public"))
app.use(cookieParser()) ;

// routes import 
import userRouter from './routs/user.routes.js'
import subscriptionRouter from "./routs/subscription.routes.js"
import tweetRouter from './routs/tweet.routes.js'
import videoRouter from "./routs/video.routes.js"
import healthcheckRouter from './routs/healthcheck.routes.js'
import likeRouter from './routs/like.routes.js'
import commentRouter from './routs/comment.routes.js'
import playlistRouter from './routs/playlist.routes.js'
import dashboardRouter from './routs/dashboard.routes.js'

// routes declaration
app.use("/api/v1/users",userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter) 
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)


export { app } ; 
