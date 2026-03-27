// require('dotenv').config();
// const express=require ('express');
// const app=express();
// const connectDB = require('./config/db');

// connectDB();
// app.listen(process.env.PORT,()=>{
//     console.log(`Server is running on port ${process.env.PORT}`);
// });






require('dotenv').config()
const express=require('express');
const connectDB = require('./config/db');
const app=express();

const startServer=async()=>{
    await connectDB();
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
}

startServer();