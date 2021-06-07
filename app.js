/////////////////////////////////////////////////////PRE-REQUISITES///////////////////////////////////////////
/*  requiring the dotenv module to access the environmental 
    variables declared there
*/ 
require('dotenv').config();

//importing libraries required for the code
const express = require('express');
const mysql = require('mysql');
const bodyparser = require('body-parser')
const mailer = require('nodemailer')
const path = require('path')
const bcrypt = require('bcrypt');
const { query } = require('express');

//starting the app
const app = express();

//code to connect the app with backend MYSQL DB
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'Akhil',
    password : 'Ask2003#',
    database : 'DBE'
  });

  connection.connect((error)=>
  {
      if(error)
      {
          console.log('Accounts DB connection failed' + JSON.stringify(error, undefined, 2));
      }
      else {
          console.log('Accounts DB connection was successful');
      }
  });

//body-parser setting
var urlencodedParser = bodyparser.urlencoded({ extended: false })

//static directory
 app.use(express.static(__dirname + '/web/PUBLIC/'))

//setting up the view engine
app.set('views', path.join(__dirname + '/templates/PUBLIC/'))
app.set('view engine', 'hbs')


/////////////////////////////////////////////////////////ROUTING///////////////////////////////////////////
//index page start
app.get('/', (request, response) => {
    response.render(__dirname + '/web/PUBLIC/index.hbs')
})
//index page end

//login page start
app.get('/login', (request, response)=>{
    response.render(__dirname + "/web/PUBLIC/login.hbs")
})

app.post('/login', urlencodedParser, (request, response)=>{
    connection.query("SELECT * ")
})
//login page end

//sign up page start
app.get('/request-for-account', (request, response) =>{
    response.render(__dirname + "/web/PUBLIC/signup.hbs")
})

app.post('/request-for-account', urlencodedParser, (request, response) =>{
    console.log(request.body)

    QUERY_str = String("SELECT * FROM user_details WHERE username = '"+request.body.username+"' OR email = '"+request.body.email+"'")
    connection.query(QUERY_str,  (error, results)=>{
        if(error){
            console.log(error);
        }
        else if (results.length > 0){
            response.render(__dirname + "/web/PUBLIC/signup.hbs", {message: "Account with this email or username already exists!"})
        }
        else if (results.length < 0){
            if(request.body.pass === request.body.confirm_pass){
                salt = bcrypt.genSalt();
                hashedPass = bcrypt.hash(request.body.pass, salt)

                new_QUERY_str = "INSERT INTO user_details VALUES ('"+request.body.username+"', '"+request.body.email+"', '"+hashedPass+"', '"+request.body.type+"', pending"
                connection.query(new_QUERY_str, (err, results) =>{
                    if(err){
                        console.log(err);
                    }
                    else if (results){
                        response.render(__dirname + "/web/PUBLIC/submission_success.hbs")
                    }
                })
            }
            else{
                response.render(__dirname + "/web/PUBLIC/signup.hbs", {message: "Passwords do not match!"})
            }

        }
    })
})
//sign up page end

//404 error page start
app.use((request, response, next) => {
    var err = new Error('Page Not Found')
    err.status = 404
    next(err)
})
app.use((err, request, response, next) => {
    response.status(err.status || 500)
    response.render(__dirname + '/web/PUBLIC/404.hbs')
})
//404 error page end

//setting the application's listener port
const PORT = 3000
app.listen(PORT, ()=>{
    console.log("Application is listening on port "+PORT+"")
})