const mongoose = require("mongoose");
const ung = require('unique-names-generator');
require('dotenv').config();
const names = require('unique-names-generator').names;
const User = require('./models/User');
const bcrypt =require('bcrypt');

const connect = mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

Users=[];
role=['customer','designer'];
for (let index = 0; index < 200; index++) {
    const name = ung.uniqueNamesGenerator({dictionaries: [names]});
    const lname = ung.uniqueNamesGenerator({dictionaries: [names]});
    const hash = bcrypt.hashSync(name+"@123",1);
    let user={
    name : name,
    lastname : lname,
    email: name+"@gmail.com",
    password: hash,
    role: role[Math.floor(Math.random()*2)]
    }
    Users.push(user);
}
User.insertMany(Users)
.then(function(){
    console.log("Data inserted")  
}).catch(function(error){
    console.log(error)      
});






