// Main starting point of the application
const express = require('express')
const http = require('http')
const bodyParse = require('body-parser')
const morgan = require('morgan')
const app = express()
const router = require('./router')
const mongoose = require('mongoose')

//DB setup
mongoose.connect('mongodb://localhost:auth/auth')


// App setup
app.use(morgan('combined')) //middleware for logging request
app.use(bodyParse.json({type:'*/*'})) //middleware for parse incoming request
router(app)

// Server setup
const port = process.env.PORT || 3090
const server = http.createServer(app)
server.listen(port)

console.log('Server listening at:', port)

