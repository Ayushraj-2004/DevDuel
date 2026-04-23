require('dotenv').config()
const express=require('express');
const connectDB = require('./config/db');
const app=express();
const authRoutes = require('./routes/auth');
const userRoutes=require('./routes/user');
app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);

const startServer=async()=>{
    await connectDB();
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
}

startServer();