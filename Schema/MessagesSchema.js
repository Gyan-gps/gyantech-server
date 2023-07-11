const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
    message:{
        type:String,
        required:true
    },
    me:{
        type:String,
        required:true
    },
    you:{
        type:String,
        required:true
    },
    sender:{
        type:String,
        required:true
    },

    createdAt:{
        type:Date,
        required:true
    }
})

module.exports = mongoose.model("messages",MessagesSchema);