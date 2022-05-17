const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    postId:{
        type:String,
        require:true
    },
    userId:{
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

module.exports = mongoose.model('reservedPosts',postSchema);