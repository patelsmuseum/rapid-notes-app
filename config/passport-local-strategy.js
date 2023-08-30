const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// authentication using passport 

passport.use(new LocalStrategy({
    usernameField: 'email'
},
async function(email, password, done) {
    try {
        // Find a user and establish the identity
        const user = await User.findOne({ email: email });
        if (!user || user.password !== password) {
            console.log('Invalid Username / Password');
            return done(null, false);
        }

        // Authentication successful, pass the user object to done
        return done(null, user);
    } catch (err) {
        console.log('Error in finding user --> Passport');
        return done(err);
    }
}
));


//seralizer authentication function web to decide which key is to kept in cookie
passport.serializeUser(function(user , done){
    done(null , user.id);
})


//deseralizer authentication function server user from the cookie
// passport.deserializeUser(function(id , done){
//     User.findById(id , function(err , user){
//         if(err){
//             console.log('error in finding the user --> Passport');
//             return done(err);
//         }

//         return done(null , user);
//     });
// });


passport.deserializeUser(async function(id, done) {
    try {
        // Find the user by id
        const user = await User.findById(id);
        if (!user) {
            console.log('User not found');
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        console.log('Error in finding the user --> Passport');
        return done(err);
    }
});


//check if the user is authenticated 
passport.checkAuthentication = function(req , res , next){
    //if the user is signed in , then pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }

    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req , res , next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}
module.exports = passport;