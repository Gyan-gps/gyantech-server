const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName:{
        type:String,
        required:true
    },
    userEmail:{
        type:String,
        required:true
    },
    userPassword:{
        type:String,
        required:true
    },
    userNumber:{
        type:String,
        // required:true
    },
    userStatus:{
        type:Boolean,
        required:true
    }
})

module.exports = mongoose.model("users",UserSchema)