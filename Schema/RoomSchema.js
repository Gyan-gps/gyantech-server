const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    roomName:{
        type:String,
        required:true
    },
    roomOwner:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true
    }
})

module.exports = mongoose.model("rooms",RoomSchema)