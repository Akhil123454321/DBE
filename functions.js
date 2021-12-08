var bcrypt = require('bcrypt')

function check_pass(ogpass, repass){
    if(ogpass == repass)
    {
        return true
    }
    else{
        return false
    }
}

function hash_pass(ogpass){
    bcrypt.genSalt(10, (error, salt)=>{
        if(error){console.error(error)}
        else{
            bcrypt.hash(ogpass, salt, (error, hash)=>{
                if(error){console.error(error)}
                else{
                    return hash
                }
            })
        }
    })
}

function compare_pass(ogpass, hashedPass){
    return bcrypt.compare(ogpass, hashedPass, (error, result)=>{
        if(error){
            console.error(error)
        }
        else{
            return result
        }
    })
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


module.exports = {check_pass, hash_pass, compare_pass, split_string, check_email_domain}