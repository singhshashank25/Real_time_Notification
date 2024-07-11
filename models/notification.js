const mongoose = require("mongoose");

const notification_model = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId,
        ref: "User"},
    message:{type:String,required:true},
    read:{type:Boolean,default:false}
})

const notification = mongoose.model("notificationi",notification_model);

module.exports = {notification};