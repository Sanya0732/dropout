const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://127.0.0.1:27017/login-tut")

// to check connected or not 
connect.then(()=>{
    console.log("database connected succesfully");
})
.catch(()=>{
    console.log("database cannot be connected");
});
// create a schema
const loginSchema =  new mongoose.Schema({
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  }
});

//collection part 
const collection =  new mongoose.model("users",loginSchema);
module.exports=collection;