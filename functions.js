const passwordValidator = require("password-validator")
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


function check_pass(ogpass, repass){
    if(ogpass == repass)
    {
        return true
    }
    else{
        return false
    }
}

function split_string(string, separator){
    string = string.split(separator)
    return string[1]
}

function check_email_domain(email_domain){
    if(email_domain === "cgi.com"){
        return true
    }
    else{
        return false
    }
}

function validatePass(password){
    result = schema.validate(password, {list:true})
    if(result.length > 0){
        return true
    }
    else{
        return false
    }
}

module.exports = {check_pass, split_string, check_email_domain, validatePass}