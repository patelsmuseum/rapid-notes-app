const express = require('express');
const app = express();

const port = 8000;

const expressLayout = require('express-ejs-layouts');
app.use(expressLayout);

//importing database in the main file
const db = require('./config/mongoose');

const cookieParser = require('cookie-parser');
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo'); 

app.use(express.static(__dirname+'/assets'));
app.set('view engine' , 'ejs');

app.use(session({
    name:'codify',
    secret:'blashsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge: (1000 * 60 * 100)
    },
    

    store: MongoStore.create({
        mongoUrl:'mongodb://127.0.0.1:27017/rapidNotes',
        mongooseConnection : db,
        autoRemove: 'disabled'
    },
     function(err){
        console.log(err || 'connect-mongodb is ok ');
     }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use('/' , require('./routes'));



app.listen(port , function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`server is running on port : ${port}`);
});

