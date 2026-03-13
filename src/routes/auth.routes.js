const {Router} = require('express')
const authController = require("../controllers/auth.controller")

const authRouter = Router()
const authUser = require('../middlewares/auth.middleware')

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register",authController.registerUserController)



/**
 * @route POST /api/auth/login
 * @description Login a user with email and password
 * @access Public
 */
authRouter.post("/login",authController.loginUserController)

/**
 * @route GET/api/auth/logout
 * @description Logout a user by clearing the token cookie and add it in blacklist
 * @access Public
*/
authRouter.get("/logout",authController.logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description Get the details of the currently logged-in user
 * @access Private
 */
authRouter.get("/get-me",authUser,authController.getMeUserController)

module.exports = authRouter