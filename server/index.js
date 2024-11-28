const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const path = require("path");
require('dotenv').config();

app.use(cors({
    origin: 'http://localhost:3000', // Ensure this matches your frontend URL exactly
    methods: ['GET', 'POST']
}));

const server = http.createServer(app);
//Backend Folder path
const __dirname = path.resolve();

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
// Serve the frontend
app.use(express.static(path.join(__dirname, '../ChatApp/dist')));
app.get('*', (_, res) => {
    res.sendFile(path.resolve(__dirname, '../ChatApp/dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
