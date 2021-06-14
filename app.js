//importing node modules
require('dotenv').config()
const express = require('express')
const mysql = require('mysql')
const nodemailer = require('nodemailer')
const bodyparser = require('body-parser')
const bcrypt = require('bcrypt')
const path = require('path')
const passwordValidator = require('password-validator')

//importing self made scripts 
const scripts = require("./scripts")
const { config } = require('dotenv')

//setting up password validator
var schema = new passwordValidator();
schema
.is().min(8) //ensuring the min length is 8 characters
.has().uppercase() // checks for uppercase letters
.has().lowercase() //checks for lowercase letters
.has().digits(4) //checks whether atleast 4 digits are used
.has().symbols(1) //checks whether atleast 1 symbol (special character) was used
.is().not().oneOf(['Passw0rd', 'Password', 'Password123']) //ensures that the user provided password is not one of these

//starting the app
const app = express();

//code to connect the app with backend MYSQL DB
//code to create a connection with a datbase with the below configurations
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'Akhil',
    password : 'Ask2003#',
    database : 'DBE'
  });

  //connectin to database using the connect method
  connection.connect((error) =>
  {
      /*if error when connecting to DB, error will be captured and logged on the terminal as a JSON string, and required text is logged to let 
      user know what happened */
      if(error)
      {
          console.log('Accounts DB connection failed' + JSON.stringify(error, undefined, 2)); 
      }

      /* if there is no error, the DB connects to the front-end and the required text is logged to let the user know what happened*/
      else {
          console.log('Accounts DB connection was successful');
      }
  });

//body-parser setting
var urlencodedParser = bodyparser.urlencoded({ extended: false })

//static directory
 app.use(express.static(__dirname + '/web/PUBLIC/'))

//setting up the view engine
app.set('views', path.join(__dirname + '/web/PUBLIC/'))
app.set('view engine', 'hbs')


//////////////////////////////ROUTES

//index page
app.get('/', (request, response) =>{
    response.render("index")
})

//signup page
app.get('/request-for-account', (request, response) =>{
    response.render('signup')
})
app.post('/request-for-account', urlencodedParser, async (request, response) =>{
    console.log(request.body);

    var truthCounter = 0

    connection.query("SELECT * FROM user_details WHERE username = '"+request.body.username+"' OR email = '"+request.body.email+"'", (error, result)=>{
        if(error)
        { 
            console.log(error);
        }
        else if (result.length > 0){
            response.render("signup", {message: "Account with this username or email already exists!"})
        }
        else if (result.length === 0){
            email = request.body.email
            var splitString = scripts.splitStr(email, '@')
            if(splitString[1] === "cgi.com"){
                console.log("VALID EMAIL HAS BEEN ENTERED");
            }
            else{
                response.render('signup', {message: "Only a CGI email needs to be used!"})
            }
        }
    })
    if(request.body.pass != request.body.confirm_pass){
        response.render('signup', {message: "Password and Confirm password fields need to be the same"})
    }
    else if(request.body.pass == "" || request.body.confirm_password == "" ){
        response.render( 'signup', {message: "Password and confirm password cannot be empty"})
    }
    else{
        if(schema.validate(request.body.pass)){
            console.log("VALID PASSWORD HAS BEEN ENTERED!");
            truthCounter = truthCounter + 1
        }
        else{
            response.render('signup', {message: "invalid password was entered!"})
        }
    }

    if (truthCounter === 2){
        response.render('submission_success')
    }

})



const PORT = process.env.PORT || 3000
app.listen(PORT, () =>{
    console.log("App is listening on port '"+PORT+"'");
})

