const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,

   price:{
       type: Number,
      required: true
    },
    ownerId:{
        type: String,
       required: true
    },
    phoneNumber:{
        type : Number,
        required : true

    },
    location:{
        type: String,
        lowercase:true,
        required : true
    },
    locationMap:{
        type: String,
    },

    numberofbedrooms:{
        type: Number,
        required: true
    },

    numberofbeds:{
        type: Number,
        required: true
    },

    wifi:{
        type:Boolean
    },

    tv:{
        type:Boolean
    },

    conditioner:{
        type:Boolean
    },
    timeAgo:{
        type : String,

    },
    description:{
        type: String
    },
    numberOfLikes:{
        type: Number
    },
    imageName: Array,
    url: Array,
    ownersLike: Array,
    time:{
        type:Date,
        default:'2022-07-01T15:31:05.000+00:00'
    }
  
});

module.exports = mongoose.model('posts',postSchema);