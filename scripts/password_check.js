const bcrypt = require('bcrypt')

function password_check(password, confirm){

    if(password === "" || confirm === ""){
        return "Password and confirm password must be equal";
    }
    else{
        if(password.length < 8 || password.length > 15){
            return "Password must be between 8 to 15 characters long"; 
        }
        else{
            var reference = /^[A-Za-z]\w{7,14}$/;
            if(!(password.match(reference))){
                return 0;
            }
            else{
                var reference = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
                if(!(password.match(reference))){
                    return 0;
                }
                else{
                    var reference = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
                    if(!(password.match(reference))){
                        return 0;
                    }
                    else{
                        var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
                        if(!(password.match(decimal))){
                            return 0 
                        }
                        else{
                            return 1;
                        }
                    }
                }
            }
        }
    }
}

module.exports = { password_check }