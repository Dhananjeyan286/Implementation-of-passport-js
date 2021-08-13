/*to start this use the command "npm start"
the database used here was mongodb atlas with collection named "passportjs" and model used here is "users"*/ 


const express=require("express")
const app=express()
const expresslayouts=require("express-ejs-layouts")
const path=require("path")
const connectdb=require("./config/db")
const flash=require("connect-flash")
const session=require("express-session")
const passport=require("passport")
const dotenv=require("dotenv")

dotenv.config({path:"./config/config.env"})

//connect databse
connectdb()

//to use passport.ejs file
require("./config/passport")(passport)//in parameters we are passing passport bcoz in passport.js in module.exports we are calling function(passport)

//bodyparser used to access data from post request especially to access form data
app.use(express.urlencoded({extended:false}))


app.use(express.static(path.join(__dirname,"public")))

app.use(expresslayouts)
app.set("view engine","ejs")

//express-session initialisation
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))//when using res.redirect we need to pass some variables for using it in the next page therefore this session allows u to send these variables


//connect-flash initialisation
app.use(flash())//an area in the broser used to display messages nd gets cleared automatically once it is displayed

//global variables used for flash
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash("success_msg")
    res.locals.error_msg=req.flash("error_msg")
    res.locals.error=req.flash("error")
    res.locals.success=req.flash("success")
    next()
})
  
//passport middlewar ,note:always put passport middleware after express-session middleware because in passport we will be using sessions

app.use(passport.initialize());
app.use(passport.session());


app.use("/",require("./routes/index"))
app.use("/users",require("./routes/users"))

PORT=process.env.PORT || 5000


app.listen(PORT,console.log("port no. is "+PORT))