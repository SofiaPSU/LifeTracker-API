const express = require("express")
const Sleep = require("../models/sleep")
const security = require("../middleware/security")
const router = express.Router()

router.post("/record-sleep", security.requireAuthenticatedUser, async (req, res, next)=>{
    try {
        const user = res.locals
        console.log(req.body)
        console.log(user)
        const sleep = await Sleep.Record({data:req.body, user})
        return res.status(201).json({sleep})
    } catch (error) {
        next(error)
    }
})
module.exports = router