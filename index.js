require("dotenv").config() //configuring dotenv access to access all the environment variables that were stored in the .env file into this js file

//importing all the required modules
const express = require("express")
const mysql = require("mysql")
const path = require("path")
const body = require("body-parser")
const bcrypt = require("bcrypt")
const {auth, requiresAuth} = require("express-openid-connect")
const alert = require("alert")


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
    database : 'dbe'
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


//setting up auth0
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL
  };
app.use(auth(config));


//index route
app.get("/", (request, response)=>{
    const authenticated_result = request.oidc.isAuthenticated()
    if(authenticated_result){
        const username = request.oidc.user.nickname.charAt(0).toUpperCase() + request.oidc.user.nickname.slice(1)
        console.log(request.oidc.user)
        response.render("login_home", {user: username})
    }
    else{
        response.render("main")
    }
})


//auth0 login route
app.get("/login", (request, response)=>{
    const authenticated_result = request.oidc.isAuthenticated()
    if(authenticated_result){
        console.log(request.oidc.user);
    }
    else{
        response.redirect("/login")
    }
})


//view db details route -- only accessible to users who have logged in
app.get("/view-db-details", requiresAuth(), (request, response)=>{
    connection.query("SELECT * FROM db_details", (error, results)=>{
        if(error){console.error(error)}
        response.render("view_db", { results })
    })
})


//edit db details route -- only accessible to authorized users and admin role users
app.get("/edit-db-details/:id", requiresAuth(), (request, response)=>{
    const dbID = request.params.id
    console.log(dbID)
    connection.query(`SELECT * FROM db_details WHERE db_id = '${dbID}'`, (error, results)=>{
        if(error){console.error(error);}
        else{
            console.log(results);
            response.render("edit_db", {id: dbID, results })
        }
    })
})
app.post("/edit-db-details/:id", urlencodedParser, (request, response)=>{
    console.log(request.body);
    const dbID = request.params.id
    const {db_id, db_env, mon_year_added, rfi_rfc, company, business_line, host, os_id, dbms_type, db_port, cluster_id, dba_support_team, created_by, created_date, updated_by, updated_date, comments} = request.body

    connection.query(`UPDATE db_details SET db_id = '${db_id}', db_env = '${db_env}', mon_year_added = '${mon_year_added}', rfi_rfc = '${rfi_rfc}', company = '${company}', business_line = '${business_line}', host = '${host}', os_id = '${os_id}', dbms_type = '${dbms_type}', db_port = '${db_port}', cluster_id = '${cluster_id}', dba_support_team = '${dba_support_team}', created_by = '${created_by}', created_date = '${created_date}', updated_by = '${updated_by}', updated_date = '${updated_date}', comments = '${comments}' WHERE db_id = '${dbID}'`, (error, results)=>{
        if(error){console.error(error); alert("Could not update DB. Try again")}
        else{console.log("success"); alert("Successfuly updated DB"); response.redirect("/view-db-details")}
    })
})


//add db details route -- only accesible to admin role users
app.get("/add-db-details", requiresAuth(), (request, response)=>{
        response.render("add_db")
})
app.post("/add-db-details", urlencodedParser, (request, response)=>{
    console.log(request.body);
    const {db_id, db_env, mon_year_added, rfi_rfc, company, business_line, host, os_id, dbms_type, db_port, cluster_id, dba_support_team, created_by, created_date, updated_by, updated_date, comments} = request.body
    
    connection.query(`INSERT INTO db_details VALUES('${db_id}', '${db_env}', '${mon_year_added}', '${rfi_rfc}', '${company}', '${business_line}', '${host}', '${os_id}', '${dbms_type}', '${db_port}', '${cluster_id}', '${dba_support_team}', '${created_by}', '${created_date}', '${updated_by}', '${updated_date}', '${comments}')`, (err, results)=>{

        if(err){console.error(err); alert("Could not add DB. Try again"), response.redirect("/add-db-details")}
        else{console.log("success"); response.render("add_db", {success:"success"})}
        
    })
})


//delete db details route -- only accessible to admin roles
app.get("/delete-db-details/:id", requiresAuth(), (request, response)=>{
    console.log(request.params.id);
    connection.query(`DELETE FROM db_details WHERE db_id = '${request.params.id}'`, (error, results)=>{
        if(error){console.error(error); alert("Could not delete DB"); response.redirect("/view-db-details")}
        else{console.log("success"); alert("Successfully deleted DB"); response.redirect("/view-db-details")}
    })
})


//search db details route -- only accessible to users who have logged in
app.get("/search-db-details", requiresAuth(), (request, response)=>{
        response.render("search_db")
})
app.post("/search-db-details", urlencodedParser, (request, response)=>{
    console.log(request.body);
    console.log(request.body.field)
    connection.query(`SELECT * FROM db_details WHERE ${request.body.field.toUpperCase()} = "${request.body.data}"`, (error, results)=>{
        if(error){console.error(error);}
        else if(results.length > 0){
            response.render("search_results", { results })
        }
        else{
            response.render("search_results", {fail : "fail"})
        }
    })
})


//listener port details
var PORT = process.env.PORT || 4040
app.listen(PORT, ()=>{
    console.log(`App listening on port ${PORT}`);
})