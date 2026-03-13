const userModel = require('../models/user.model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlackListModel = require('../models/blacklist.model')
/**
 * @name registerUserController 
 * @description register a new user ,expectsusername,email and password in the required body
 * @access Public

*/
async function registerUserController(req,res){
    const {username,email,password} = req.body

    if(!username || !password || !email){
        return res.status(400).json({
            message:"Please provide usernmae,email and password"
        })
    }
    const isUserAlreadyExists = await userModel.findOne({
        $or: [{username},{email}]
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"Account already exists with this email address or username"
        })
    }
    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        password:hash
    })

    const token = jwt.sign({
        id:user._id,username:user.username,email:user.email
    },process.env.JWT_SECRET,
    {expiresIn:"1d"})

    res.cookie("token",token)

    res.status(201).json({
        message:"User registered successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}


/**
 * @name loginUserController
 * @description login a user ,expects email and password in the required body
 * @access Public
 */
async function loginUserController(req,res){
    const {email,password} = req.body

    const user= await userModel.findOne({email})
    if(!user){
        return res.status(400).json({
            message:"Invlid email or password"
        })
    }
    const isPasswordValid = await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

    const token = jwt.sign({
        id:user._id,username:user.username,email:user.email
    },process.env.JWT_SECRET,
    {expiresIn:"1d"})

    res.cookie("token",token)
    res.status(200).json({
        message:"User logged in successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

/**
 * @name logoutUserController
 * @description Logout a user by clearing the token cookie and add it in blacklist
 * @access Public
*/
async function logoutUserController(req,res){
    const token = req.cookies.token
    if(token){
        await tokenBlackListModel.create({token})
    }

    res.clearCookie("token")

    res.status(200).json({
        message:"User logged out successfully"
    })
}

/**
 * @name getMeUserController
 * @description Get the details of the currently logged-in user
 * @access Private
 */
async function getMeUserController(req,res){
    if(!req.user){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
    const user = await userModel.findById(req.user.id)
    res.status(200).json({
        message:"User details retrieved successfully",
        user:{  
            id:user._id,
            username:user.username,
            email:user.email
        }
 })
    
}


module.exports ={
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeUserController
}


