require("dotenv").config()
const express = require("express")
const mysql = require("mysql")
const path = require("path")
const body = require("body-parser")
const passwordValidator = require('password-validator')
const functions = require("./functions.js")
const database_functions = require("./database.js")
const bcrypt = require("bcrypt")
const e = require("express")

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

app.get("/", (request, response)=>{
    response.render("main")
})

app.get("/request-account", (request, response)=>{
    response.render("request")
})
app.post("/request-account", urlencodedParser, (request, response)=>{
    fname = request.body.first_name
    console.log(request.body);
    
    var email_domain = functions.split_string(request.body.email, "@")
    if(email_domain === "cgi.com"){
        if(pass_result = functions.check_pass(request.body.password, request.body.re_password)){
            console.log("Passwords match");
            
            validation_result = schema.validate(request.body.password, {list:true})
            if(validation_result.length > 0){
                console.log(validation_result);
                response.render("request", {message: `Password does not meet the following requirements: ${validation_result}`})
            }
            else{
                bcrypt.genSalt(10, (error, salt)=>{
                    if(error){console.error(error);}
                    else{
                        bcrypt.hash(request.body.password, salt, (error, hash)=>{
                            if(error){console.error(error);}
                            else{
                                database_functions.insert_details(request.body.first_name, request.body.last_name, request.body.email, hash)
                                response.redirect("/login")
                            }
                        })
                    }
                })
            }
        }
        else{
            console.log("Passwords dont match");
        }
    }
    else{
        response.render("request", {message: "Invalid Email entered!"})
    }
    

})

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
                response.redirect("/view-db-details")
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

app.get("/view-db-details", (request, response)=>{

    // connection.query("SELECT * FROM db_details", (error, results)=>{
    //     if(error){console.error(error)}
    //     else if(results.length > 0){
    //         response.render("table_page", { results })
    //     }
    //     else{
    //         response.render("table_page", { message })
    //     }
    // })
    response.render("view_db")
})

app.get("/add-db-details", (request, response)=>{
    response.render("add_db")
})
app.post("/add-db-details", urlencodedParser, (request, response)=>{
    console.log(request.body);
})

var PORT = process.env.PORT || 4040
app.listen(PORT, ()=>{
    console.log(`App listening on port ${PORT}`);
})