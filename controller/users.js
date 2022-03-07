//const { redirect, status } = require('express/lib/response');
const user = require('../model/products');
//const userurl = require('../model/productsurl');
const products = require('../routs/admin');
const admindata = require('../routs/admin');
const bcrypt = require('bcryptjs');


exports.getuser= (req,res,next) => {
    //res.send('from admindata');
    
    res.render('adduser',{
        title:'Add User', 
        path:'/admin/adduser'
    });
    //console.log(req.body.ti);
};
exports.geturl= (req,res,next) => {
    //res.send('from admindata');
    
    res.render('add_url_image',{
        title:'Add Url',
        path:'/admin/addurlimage'
    });
    //console.log(req.body.ti);
};
exports.postuser = (req,res,next) => {
    //res.send('from admindata');
    const Fname = req.body.FName;
    const Lname = req.body.LName;
    const gmail = req.body.Gmail;
    const gender = req.body.Gender;
    const age = req.body.Age;
    const password = req.body.Password;
    const cPasssword = req.body.CPassword;
    user.findOne({gmail: gmail}).then(userDoc => {
            if(userDoc){
                console.log('gmail is already exite');
                return res.status(400).json({'message': 'gmail is already exite'});
                
            } else if(password != cPasssword) {
                console.log('wrong CPassword');
                return res.status(4002).json({'message': 'wrong CPassword'});
                
            } 
                return bcrypt
                    .hash(password,12)
                    .then(hashedPassword => {
                    const users = new user({
                        Fname:Fname,
                        Lname:Lname,
                        gmail:gmail,
                        gender:gender,
                        age:age,
                        password:hashedPassword
                    });
                        return users.save();
                })
        })
        
        .then(result => {
            res.status(200).json({'message':'Sign Up'});
            console.log(result);
        }).catch(err => {
            console.log(err);
        });
    
    
    
    
    //products.products.push({title: req.body.title,gmail: req.body.gmail,phone:req.body.phone,Brday:req.body.date});
    
    //console.log(products.title);

};

exports.postLogin = (req,res,next) => {
    const gmail = req.body.Gmail;
    const password =  req.body.password;
    

    user.findOne({gmail:gmail}).then(users => {
        if(!users){
            console.log('user not found*************************');

            return res.status(404).json({'message': 'user not found'})
            

        }
        bcrypt 
            .compare(password, users.password)
            .then(doMatch => {
                if(doMatch) {
                    
                    console.log('login------------------*********');
                    return res.status(200).json({'message':'login(user found)'});
                     
                   
                }
                res.status(400).json({'message':'wrong password'});
            })
            .catch(err => {
                console.log(err);
                res.status(400).json({'message':'error'});
            })
    })    
};

// update user 
exports.postUpdateUser = (req,res,next) => {
    const userId = req.params.userId;
    console.log('userId   ' + userId);
    const Fname = req.body.FName;
    const Lname = req.body.LName;
    const gender = req.body.Gender;
    const age = req.body.Age;

    user.findById(userId)
    .then(users => {
        if(!users){
            
            return res.status(404).json({"message":"user not found"});
        }

        users.Fname = Fname;
        users.Lname = Lname;
        users.gender = gender;
        users.age = age;
        return users.save();
        
    })
    .then(result => {
        res.status(200).json({"message":"user updated"});
        console.log(result);
    })


    
    
}
// /update user

exports.getLogin = (req,res,next) => {
    const gmial_login = req.body.Gmail;
    const password_login = req.body.password;
    res.render('login',{
        title:'login',
        path:'/admin/login'
    })
    
};
