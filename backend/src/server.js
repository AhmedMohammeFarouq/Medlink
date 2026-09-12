
import env from "./config/env.js";
import express from "express";
import { Bootstrap } from "./app.controller.js";
import http from "http";
import {Server}from "socket.io";
import {setServer}from "./modules/notifications/notification.service.js"
import {registerChatSocket}from "./modules/chat/chat.socket.js"
import { setIoForCloseChat } from "./modules/chat/chat.service.js";

const app = express();
const port = env.port;


const httpServer=http.createServer(app);
const io = new Server(httpServer,{
    cors:{
        origin:"*"
    }
});


setIoForCloseChat(io);
setServer(io);
registerChatSocket(io)



await Bootstrap(app, express)


httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
