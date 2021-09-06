import User from "../models/User";
import passport from "passport";
import PasswordValidator from "password-validator";
import nodemailer from "nodemailer";

var schema = new PasswordValidator()
  .is().min(8) //password must have at least 8 characters
  .is().max(16) //password can have at most 16 characters
  .has().uppercase() //password must contain uppercase letters
  .has().lowercase() //password must contain lower case letters
  .has().not().spaces() //password must not have spaces
  .has().digits(2) //password must have at least 2 digits
  .has().symbols(1) //password must have at least 1 special character
  .is().not().oneOf(['Password', 'Password123', 'temp123']) //password can not be one of these passwords

export const renderSignUpForm = (req, res) => res.render("users/signup");

export const singup = async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password } = req.body;
  const domain = email.split('@')[1]
  const result = schema.validate(password, {list: true})
  console.log(result)
  console.log(domain)

  if (password != confirm_password) {
    errors.push({ text: "Passwords do not match." });
  }
  if (result.length > 0) {
    errors.push({text: "Password fails to meet the requirements: ", result});
  }
  if(email.split('@')[1] !== "cgi.com"){
    if(email.split('@')[1] !== "bell.ca"){
      errors.push({ text: "Invalid email entered. "})
    }
  }

  if (errors.length > 0) {
    res.render("users/signup", {
      errors,
      name,
      email,
      password,
      confirm_password,
    });
  } else {
    // Look for email coincidence
    const emailUser = await User.findOne({ email: email });
    if (emailUser) {
      req.flash("error_msg", "The Email is already in use.");
      res.redirect("/users/signup");
    } else {
      // Saving a New User
      const status = "pending"
      const newUser = new User({ name, email, password, status });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      // req.flash("success_msg", "Your request has been sent. ");
      // res.redirect("/");
      var transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
          user: "akhilsagaran@gmail.com",
          pass: "cwwbzcycuuxfopzk",
        }
      })
    
      var mailDetails = {
        from: "akhilskasturi@outlook.com",
        to: "akhilsagaran@gmail.com",
        subject: "Request for Account",
        text: "hei",
      }
    
      transporter.sendMail(mailDetails, (error, info)=>{
        if(error){
          console.error(error)
        }
        else{
          req.flash("success_msg", "Email is sent ----->");
          res.redirect("/");
        }
      })
    }
  }
};

export const renderSigninForm = (req, res) => res.render("users/signin");

export const signin = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/users/signin",
  failureFlash: true,
});

export const logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out now.");
  res.redirect("/");
};



export const success = (req, res)=> res.render(__dirname + "/views/users/success");
