var mysql = require("mysql")

//DB connection settings
var connection = mysql.createConnection({
    host     : process.env.DB_HOST || 'localhost',
    user     : process.env.DB_USER || 'root',
    password : process.env.DB_PASS || '',
    database : 'cs_ia'
  });


function connect_db(){
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
}

function insert_user_details(fname, lname, email, pass){
    var role = "pending"
    var query = `INSERT INTO user_details (fname, lname, email, pass, role) VALUES('${fname}', '${lname}', '${email}', '${pass}', '${role}')`
    connection.query(query, (error, result)=>{
        if(error){
            console.error(error);
        }
        else{
            console.log("Data inserted");
        }
    })
}


module.exports = {connect_db, insert_user_details}