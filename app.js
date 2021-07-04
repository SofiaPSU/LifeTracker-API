const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const config = require("./config")
const security = require("./middleware/security")
const authRoutes = require("./routes/auth")
const sleepRoutes = require("./routes/Sleep")
const activityRoutes = require("./routes/Activity")
const recordSleep= require("./routes/recordSleep")
const { NotFoundError } = require("./utils/errors")

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("tiny"))
app.use(security.extractUserFromJwt)

// routes
app.use("/", authRoutes)
app.use("/Sleep", sleepRoutes)
app.use("/Activity", activityRoutes)
app.use("/", recordSleep)
// health check
app.get("/", function (req, res) {
  return res.status(200).json({
    ping: "pong",
  })
})

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError())
})

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (!config.IS_TESTING) console.error(err.stack)
  const status = err.status || 500
  const message = err.message

  return res.status(status).json({
    error: { message, status },
  })
})

module.exports = app