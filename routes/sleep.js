const express = require("express")
const Sleep = require("../models/sleep")
const security = require("../middleware/security")
const router = express.Router()


router.get("/Sleep", security.requireAuthenticatedUser, async (req, res, next) =>{
   try{ 
       const {user} = res.locals
    const viewSleep = await Sleep.fetchSleep(user)
    return res.status(200).json({ viewSleep })
} catch(err){
    next(err)
}
})
module.exports = router