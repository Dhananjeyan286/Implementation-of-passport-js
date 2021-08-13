const express=require("express")
const passport = require("passport")
const router=express.Router()
const bcrypt=require("bcryptjs")
const db=require("../models/users")//bringing in the database 

router.get("/login",(req,res)=>
{
    res.render("login")
})

router.get("/register",(req,res)=>
{
    res.render("register")
})


//to handle post data,post request is used bcoz in register.ejs file in form action we are using method=POST so once we press register button the form data will be transferred to the post request of the page/users/register
router.post("/register",(req,res)=>{
    
    const {name,email,password,password2}=req.body//putting the values of name,email,password,password2 from form into the variables named name,email,password,password2. Note:Here the variable names should be same as put in the html file input tag name attribute

    let errors=[]

    //to check whether all fields are entered
    if(!name || !email || !password || !password2)
    {
        errors.push({msg:"please fill in all fields"})
    }

    //to check if both the passwords match
    if(password !== password2)
    {
        errors.push({msg:"both the passwords do not match"})
    }

    //check password length
    if(password.length < 6)
    {
        errors.push({msg:"password length should be atleast 6 characters"})
    }

    if(errors.length>0)
    {
        res.render("register",{
            errors,name,email,password,password2//here these values are sent to the browser which inturn will be used in register.js to keep the values even when the page is reloaded
        })
    }
    else{
        //to check if the user already exists
        db.findOne({email:email}).then((user)=>{
            if(user != null)
            {
                errors.push({msg:"Email is already registered"})
                res.render("register",{
                    errors,name,email,password,password2
                })
            }
            else
            {
                //creating new user
                const temp=new db({
                    name:name,email:email,password:password
                })
                //converting plain text password to a hash value ,for syntax see bcrypt npm package in broser
                bcrypt.hash(temp.password, 10, function(err, hash) {
                    if(err) {
                        throw err
                    }
                    else{
                        temp.password=hash// Store hash in your password DB.
                        temp.save().then((user)=>{
                            req.flash("success_msg","You have successfully registered,now you can login")//here success_msg is the key and the value is the following msg,note here no need to use something like key value pair here
                            res.redirect("/users/login",)
                        }).catch((err)=>{
                            console.log(err)
                        })
                    }
                });
            }
        })
    }
    
})

router.post("/login",
    passport.authenticate('local', {//once this function returns success then it will create a req.user object for every request (tht is get or post or any request) made be express js ,this req.user will contain all details about the user logged in which is stored in the users model in "../models/users.js"
        successRedirect:"/dashboard",// if successfully logged in then redirect to /dashboard page
        failureRedirect:"/users/login",//if not logged in then redirect to /users/login page
        failureFlash:true,//inorder to display messages for unsuccessfull log in make this true
        successFlash:true
}))
router.get("/logout",(req,res)=>{
    req.logOut()
    req.flash("success_msg","You are logged out")
    res.redirect("/users/login")
})
//passport.authenticate see documentation of passport-local in that combine custom callback and flash messages
//(req, res, next)
//(req,res,next)=>{
module.exports=router