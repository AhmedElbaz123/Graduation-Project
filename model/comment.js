const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,

   postId:{
       type: String,
      required: true
    },
    ownerId:{
        type: String,
       required: true
    },
    comment:{
        type : String,
        required : true

    },
    time:Date
  
});

module.exports = mongoose.model('comments',postSchema);