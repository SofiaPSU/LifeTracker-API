const db= require("../db")
const { BadRequestError, UnauthorizedError, NotFoundError } = require("../utils/errors")



class Sleep{
    static async Record({ data, user }){
        const requiredFields = ["date","startTime","endTime"]
        console.log("user =",user)
        requiredFields.forEach(field =>{
            if(!data?.hasOwnProperty(field)){
                throw new BadRequestError(`Missing ${field} in request body`)
            }
        })
        // insert sleep data into db
        const result = await db.query(
           ` INSERT INTO sleep (
                 date, start_time, end_time, user_id
            )VALUES ($1, $2, $3, (SELECT id FROM users WHERE email=$4))
            RETURNING id, user_id;`, [ data.date,
            data.startTime, data.endTime, user.email])
       
        const sleepData = result.rows[0]
        return sleepData
    }

    static async fetchSleep({user}){
        //select sleep data from current user
     //   const query =`SELECT date, start_time, end_time FROM sleep WHERE id=user_id`
        const result = await db.query(`SELECT date, start_time, end_time FROM sleep 
        WHERE user_id=(SELECT id FROM users WHERE email=$1)`, [user.email])
        const sleep = result.rows[0]
        if (sleep){
        return sleep}
        else{ throw new NotFoundError("Sleep data could not be found")}
    }
}

module.exports = Sleep