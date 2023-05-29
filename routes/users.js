const mongoose =require("mongoose");

const plm=require("passport-local-mongoose")

mongoose.connect("mongodb://localhost/multerapp");

const userSchema=mongoose.Schema({
  name:String,
  username:String,
  password:String,
  gender:String,
  email:String,
  image:String
});

userSchema.plugin(plm);

module.exports = mongoose.model('user', userSchema);