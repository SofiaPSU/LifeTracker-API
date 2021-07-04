const express = require("express")
const User = require("../models/user")
const security = require("../middleware/security")
const token = require("../utils/tokens")
const router = express.Router()

router.post("/login", async (req, res, next)=>{
    try {
        const user = await User.login(req.body)
        const userToken = token.createUserJwt(user)
        return res.status(200).json({user, userToken})
    } catch (error) {
        next(error)
    }
})

router.post("/signup", async (req,res, next)=>{
    try {
        //get user's email and password
        //and create a new user in db
        const user = await User.register(req.body)
        const userToken = token.createUserJwt(user)
        return res.status(201).json({user, userToken})
    } catch (error) {
        next(error)
    }
})
router.get("/me", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
      const { email } = res.locals.email
      const user = await User.fetchUserByEmail(email)
      const publicUser = User.makePublicUser(user)
      return res.status(200).json({ user: publicUser })
    } catch (err) {
      next(err)
    }
  })


module.exports = router