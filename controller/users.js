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
    //
        console.log("FName  " + Fname);
        console.log("Lname  " + Lname);
        console.log("gmail  " + gmail);
        console.log("gender  " + gender);
        console.log("age  " + age);
        console.log("FName  " + password);
        console.log("FName  " + cPasssword);
    //
    user.findOne({gmail: gmail}).then(userDoc => {
            if(userDoc){
                console.log('gmail is already exite');
                return res.status(200).redirect('/admin/adduser');
                
            } else if(password != cPasssword) {
                console.log('wrong CPassword');
                return res.status(2002).redirect('/admin/adduser');
                
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
            res.redirect('/admin/home');
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
    //
        console.log("gmail" + gmail);
        console.log("password" + password);
    //    

    user.findOne({gmail:gmail}).then(users => {
        if(!users){
            console.log('user not found*************************');

            return res.status(2003).redirect('/admin/login');
            

        }
        bcrypt 
            .compare(password, users.password)
            .then(doMatch => {
                if(doMatch) {
                    
                    console.log('login------------------*********');
                    return res.status(2004).redirect('/admin/home');
                     
                   
                }
                res.redirect('/admin/login');
            })
            .catch(err => {
                console.log(err);
                res.redirect('/admin/login');
            })
    })    
};

exports.getLogin = (req,res,next) => {
    const gmial_login = req.body.Gmail;
    const password_login = req.body.password;
    res.render('login',{
        title:'login',
        path:'/admin/login'
    })
    
};
// exports.postuserurl = (req,res,next) => {
//     //res.send('from admindata');
    
//     const userurll = new userurl(req.body.gmailurl,req.body.urlimage);
    
    
//     //products.products.push({title: req.body.title,gmail: req.body.gmail,phone:req.body.phone,Brday:req.body.date});
    
//     //console.log(products.title);
    
//     userurll.save();
    
// };
// exports.getdata = (req,res,next) => {
//     user.fetchall(users => {
//         res.render('users',{
//             title: 'users',
//             path: '/',
//             prods: users
//         });
//     });
    
    
// };