import { Server } from 'socket.io';
import express from "express"
import http from "http"

const app = express()
const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:"http://10.11.154.230:3001",
        methods:["GET","POST"],
    }

})
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (!userId) {
        console.log("User ID not provided, closing connection");
        socket.disconnect(); // Optionally disconnect if userId is required
        return;
    }

    console.log(`New client connected: ${socket.id} with userId: ${userId}`);

    socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected`);
    });
});

export {app,io,server}