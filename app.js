//IMPORTING THE REUQIRED NODE MODULES
const express = require('express')
const path = require('path')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const mailer = require('nodemailer')
const bcrypt = require('bcrypt')

//STARTING THE APP
var app = express()

//SETTING THE STATIC DIRECTORY
app.use(express.static(__dirname + '/public/'))

//SETTING THE VIEW ENGINE
app.set('views', path.join(__dirname + "/public/views/"))
app.set('view engine','hbs')

//BODY PARSER SETTINGS
var urlencodedParser = bodyparser.urlencoded({ extended: false })

app.use(session({
    secret: 'secret',
    cookie: {maxAge: 60000},
    resave:false,
    saveUninitialized: false
}))
app.use(flash())
//DECLARING THE ROUTES
//home page
app.get('/', (request, response)=>{
    response.render('home')
})

//login page
app.get('/login', (request, response)=>{
    response.render('login')
})
app.post('/login', urlencodedParser, (request, response)=>{
    console.log(request.body);
})

//signup page
app.get('/signup', (request, response)=>{
    response.render('register')
})
app.post('/signup', urlencodedParser, (request, response)=>{
    console.log(request.body);
    console.log(request.body.pass)

    
})

app.get('/trial', (request, response)=>{
    response.render('index')
})

//SETTING THE LISTENER PORT OF THE APPLICATION
const PORT = process.env.PORT || 3000 //when the app is deployed onto a server, it will try to find the assigned port value. If there is no port value assigned in the server path variables, then the application runs on the default port 3000.
app.listen(PORT, ()=>{
    console.log(`App is running on port ${PORT}`)
})


