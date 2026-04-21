const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) { 
            return res.status(400).json({ message: 'email already exists.' })
        }
        const salt = await bcrypt.genSalt(10);   // salt = random noise added before h
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ username, email, password: hashedPassword });
        const token = jwt.sign(
            { id: newUser._id }, // payload — data stored in the token
            process.env.JWT_SECRET, // secret key — keep this in .env
            { expiresIn: '7d' }
        );
        res.status(201).json({ token })
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const loginUser= async(req,res)=>{
    try{
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if(!existingUser){
            return res.status(400).json({message: "email does not exist"})
        }
        const isMatch=await bcrypt.compare(password,existingUser.password);
        if(!isMatch)
        {
            return res.status(400).json({message: "Password is wrong"});
        }
        const token=jwt.sign(
            { id: existingUser._id }, // payload — data stored in the token
            process.env.JWT_SECRET, // secret key — keep this in .env
            { expiresIn: '7d' }
        );
        res.status(200).json({token});
    }
    catch(error)
    {
        res.status(500).json({ message: error.message });
    }
}

module.exports={registerUser,loginUser};
