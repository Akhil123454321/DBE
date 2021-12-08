//importing all the required modules
require("dotenv").config() //configuring dotenv access to access all the environment variables that were stored in the .env file into this js file
const express = require("express")
const mysql = require("mysql")
const path = require("path")
const body = require("body-parser")
const passwordValidator = require('password-validator')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//importing custom functions from other js files into this js file
const functions = require("./functions.js")
const database_functions = require("./database.js")

//starting the app
var app = express()

//setting static directory
app.use(express.static(__dirname + '/src/'))

//setting view engine
app.set('views', path.join(__dirname + '/src/views/'))
app.set('view engine', 'hbs')

//body-parser
var urlencodedParser = body.urlencoded({ extended: false })

//DB connection settings
var connection = mysql.createConnection({
    host     : process.env.DB_HOST || 'localhost',
    user     : process.env.DB_USER || 'root',
    password : process.env.DB_PASS || '',
    database : 'cs_ia'
  });
database_functions.connect_db()

//setting the new password validation schema
  var schema = new passwordValidator()
  schema
      .is().min(8) //password must have at least 8 characters
      .is().max(16) //password can have at most 16 characters
      .has().uppercase() //password must contain uppercase letters
      .has().lowercase() //password must contain lower case letters
      .has().not().spaces() //password must not have spaces
      .has().digits(2) //password must have at least 2 digits
      .has().symbols(1) //password must have at least 1 special character
      .is().not().oneOf(['Password', 'Password123', 'temp123']) //password can not be one of these passwords

//setting up jwt
app.use(express.json())

//index route
app.get("/", (request, response)=>{
    response.render("main")
})

//account request route
app.get("/request-account", (request, response)=>{
    response.render("request")
})
app.post("/request-account", urlencodedParser, (request, response)=>{
    console.log(request.body);
    console.log(functions.split_string(request.body.email, "@"));
    console.log(functions.check_email_domain(functions.split_string(request.body.email, "@")));

    if(functions.check_email_domain(functions.split_string(request.body.email, "@"))){
        connection.query(`SELECT * FROM user_details WHERE fname = '${request.body.first_name}' AND lname = '${request.body.lname}' OR email = '${request.body.email}'`, (error, results)=>{
            if(error){console.error(error)}
            else if(results.length > 0){
                response.render("request", {message: "Account already exists!"})
            }
            else{
                if(functions.check_pass(request.body.password, request.body.re_password)){
                    console.log("Passwords Match");

                    validation_result = schema.validate(request.body.password, {list: true})
                    if(validation_result.length > 0){
                        console.log(validation_result);
                        response.render("request", {message: `Password does not meet the following requirements ${validation_result}`})
                    }
                    else{
                        bcrypt.genSalt(10, (error, salt)=>{
                            if(error){console.error(error);}
                            else{
                                bcrypt.hash(request.body.password, salt, (error, hash)=>{
                                    if(error){console.error(error);}
                                    else{
                                        console.log(hash);
                                        database_functions.insert_user_details(request.body.first_name, request.body.last_name, request.body.email, hash)

                                        response.redirect("/login")
                                    }
                                })
                            }
                        })
                    }
                }
                else{
                    response.render("request", {message: "Passwords do not match!"})
                }
            }
        })
    }
    else{
        response.render("request", {message: "Invalid email!"})
        console.log("invalid email");
    }
})

//login route
app.get("/login", (request, response)=>{
    response.render("login")
})
app.post("/login", urlencodedParser, (request, response)=>{
    console.log(request.body);
    connection.query(`SELECT pass FROM user_details WHERE email = '${request.body.email}'`, (error, results)=>{
        if(error){
            console.error(error)
        }
        else if (results.length > 0){
            console.log(results)
            if(bcrypt.compare(request.body.password, results[0].pass)){
                console.log(true);

                jwt.sign({email: request.body.email}, process.env.ACCESS_TOKEN_SECRET, (error, token)=>{
                    if(error){console.error(error);}
                    else{ console.log(token);}
                    response.redirect("/view-db-details")
                })
            }
            else{
                response.render("login", {message: "Invalid email or password!"})
            }
        }
        else{
            response.render("login", {message: "Invalid email or password!"})
        }
    })
})

//view db details route -- only accessible to users who have logged in
app.get("/view-db-details", (request, response)=>{
    response.render("view_db")
})

//add db details route -- only accesible to admin role users
app.get("/add-db-details", (request, response)=>{
    response.render("add_db")
})
app.post("/add-db-details", urlencodedParser, (request, response)=>{
    console.log(request.body);
})

//search db details route -- only accessible to users who have logged in
app.get("/search-db-details", (request, response)=>{
    response.render("search_db")
})
app.post("/search-db-details", urlencodedParser, (request, response)=>{
    console.log(request.body);
})

// //error page
// app.use((request, response, next) => {
//     var err = new Error('Page Not Found')
//     err.status = 404
//     next(err)
// })
// app.use((err, request, response, next) => {
//     response.status(err.status || 500)
//     response.render('error', {status: "404", message: "Oops! Page not found"})
// })

//listener port details
var PORT = process.env.PORT || 4040
app.listen(PORT, ()=>{
    console.log(`App listening on port ${PORT}`);
})
