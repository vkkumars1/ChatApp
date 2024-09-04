const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

app.use(cors({
    origin: 'http://localhost:5173', // Ensure this matches your frontend URL exactly
    methods: ['GET', 'POST']
}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Ensure this matches your frontend URL exactly
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log(`User connected with id ${socket.id}`);

    socket.on('send-message', (messageData) => {
        io.emit('receive-message', messageData);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
