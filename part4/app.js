require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const config = require('./utils/config')


const app = express()

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { family: 4 }).then(() => {
  logger.info('connected to MongoDB')
}).catch((error) => {
  logger.error('error connection to MongoDB:', error.message)
})

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.getTokenFrom)
app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)

app.use('/api/blogs', middleware.getUserFromToken, blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
