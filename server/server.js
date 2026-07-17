require('dotenv').config()
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const setupSocket = require('./sockets/index');

const connectDB = require('./config/db');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
setupSocket(io);

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

const startServer = async () => {
    await connectDB();
    server.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
}

startServer();