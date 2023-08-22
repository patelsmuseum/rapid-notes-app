const express = require('express');
const app = express();

const port = 8000;

//importing database in the main file
const db = require('./config/mongoose');

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname+'/assets'));
app.set('view engine' , 'ejs');
app.use('/' , require('./routes'));



app.listen(port , function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`server is running on port : ${port}`);
});

