require('dotenv').config()
const express=require('express');
const connectDB = require('./config/db');
const app=express();
const authRoutes = require('./routes/auth');
app.use(express.json());
app.use('/api/auth',authRoutes);

const startServer=async()=>{
    await connectDB();
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
}

startServer();