

const mongoose = require('mongoose')//importing the mongoose node module
const Schema = mongoose.Schema //creating a constance of the Schema method 

/*
    creating a new mongoDB schema for my documents. 
    Declaring the various fields, their data types, and whether they required or not
*/
const user_schema = new Schema({ 
    fname:{
        type: String,   
        required: true
    },
    lname:{
        type: String, 
        required: true
    },
    email:{
        type: String, 
        required: true
    },
    password:{
        type: String, 
        required: true
    },
    status:{
        type: String, 
        required: true
    }
}, {timestamps: true})

const User = mongoose.model('Account', user_schema) //creating the mongoDB model

module.exports = User //exporting this model as User. Can be used in main app.js