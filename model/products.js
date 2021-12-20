const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    Fname: {
        type: String,
        required: true
    },
    Lname: {
        type: String,
        required: true
    },
    gmail: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('users', userSchema);



// const mongodb = require('mongodb');
// const getDb = require('../Util/database').getDb;



//  class Product {
//     constructor(id,f,l,g,a,m,p,cp)
//     {
//         this._id = id;
//         this.fname = f;
//         this.lname = l;
//         this.gender = g;
//         this.age = a;
//         this.gmail = m;
//         this.password = p;
//         this.cpassword = cp;


        
//     }
    

//     save()
//     {
//         const db = getDb();
//         return db
//             .collection('users')
//             .insertOne(this)
//             .then(result => {
//                 //console.log(this);
//                 console.log(result);
//             })
//             .catch(err => {
//                 console.log(err);
//             });


//     }
//     static findByGmail(gmail)
//     {
//         const db = getDb();
//         return db
//         .collection('users')
//         .find({gmail: gmail})
//         .next()
//         .then(user => {
//             console.log('find gmail');
//             return user;
//         })
//         .catch(err => {
//             console.log(err);
//         });   
//     }


    
// }

// module.exports = Product;


module.exports = mongoose.model('user', userSchema);