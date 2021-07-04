const express = require("express")
const Activity = require("../models/activity")
const routerActivity = express.Router()

routerActivity.post("/Activity", async (req,res, next)=>{
    try {
        //get user's email and password
        //and create a new user in db
        const activity = await Activity.register(req.body)
        return res.status(201).json({activity})
    } catch (error) {
        next(error)
    }
})


module.exports = routerActivity