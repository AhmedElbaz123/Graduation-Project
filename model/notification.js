const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    senderId:{
        type:String,
        require:true
    },
    receiverId:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    urlImage:{
        type:String,
        require:true
    },
    text:{
        type:String,
        require:true
    },
    time:{
        type:Date,
        require:true
    },
    timeAgo:{
        type:String
    }

})

module.exports = mongoose.model('notification',postSchema);