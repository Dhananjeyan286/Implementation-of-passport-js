const localstrategy =require("passport-local").Strategy
const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const db=require("../models/users")

module.exports=function(passport){
    passport.use(new localstrategy({usernameField:"email"},//here we use usernamefield because in login page the label name is kept as email instead of username so we are setting usernamefield to email
    (email, password, done) => {
        db.findOne({ email:email }).then((user)=>{
            //for no valid emailid
            if (!user) { 
                return done(null, false,{message:"This email is not registered"}) //in done the first parameter null is for errors (if any),the second parameter is false to pass a user(if any).
            }
            //for valid emailid
            else{
                bcrypt.compare(password, user.password, function(err, ismatch) {//ismatch is a boolean variable which has true if email and password are correct else it has false if username and password are not correct
                    if(err) throw err

                    if(ismatch){
                        return done(null, user,{message:"Successfully logged in"});
                    }
                    else{
                        return done(null, false,{message:"password is incorrect"});
                    }
                })//for bcrypt.compare see bcrypt npm documentation
            } 
          }).catch((err)=>{
              console.log(err)
          })
        }
    ))
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        db.findById(id, function(err, user) {
          done(err, user);
        });
    });//passport.serializer and passport.desirializer see documentation in passport-local,it is used to transfer the user credentuals for the first tine nd if it is correct and the user is logged in, these credentials are stored as a unique cookie so when next time this user logs in his credentials are not transferred just as in the first case instead the cookie id is alone verified thereby saving time.
}//see passport.use from passport-local documentation