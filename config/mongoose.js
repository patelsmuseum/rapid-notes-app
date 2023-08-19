const mongoose = require('mongoose');


//checking error if any
main().catch(err => console.log(err));

//connecting mangoose
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/rapidNotes');

}

//connecting db to mangoose connection 
const db = mongoose.connection;


//checking successfully connected 
db.once('open' , function(){
    console.log('susscessfully connected to the database of rapidNotes');
})

module.exports = db;