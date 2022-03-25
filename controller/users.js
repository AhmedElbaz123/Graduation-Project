//const { redirect, status } = require('express/lib/response');
const user = require('../model/products');
//const userurl = require('../model/productsurl');
const products = require('../routs/admin');
const admindata = require('../routs/admin');
const bcrypt = require('bcryptjs');
// send by mailjet 

const mailjet = require ('node-mailjet')
.connect('2c1f533deccff7811de59645c5290e6f', '4ca77e91331241dd9b409bd5c65d767b')



// /send by mailjet



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
            res.status(200).json({'message':'Sign Up', user:result});
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
                    return res.status(200).json({'message':'login(user found)', user: users});
                     
                   
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
        res.status(200).json({"message":"user updated",user:result});
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

// reset password (send by mailget)
exports.postRset = (req,res,next) => {
    console.log('req.body.gmail  ' + req.body.gmail);
    let token = Math.floor(Math.random() * 1000000);
    if(token <= 99999)
    {
        token = token +100000;
    }
    user.findOne({gmail: req.body.gmail})
      .then(user => {
          if(!user) {
            return res.status(400).json({"message": "(error) gmail not found !! "});
          }
          user.resetToken = token;
          user.resetExpresion = Date.now() + 3600000;
          user.save();
          //res.status(200).json({user:user});
      })
      .then(result => {
        const request = mailjet
        .post("send", {'version': 'v3.1'})
        .request({
          "Messages":[
            {
              "From": {
                "Email": "elbaz8360@gmail.com",
                "Name": "ahmed"
              },
              "To": [
                {
                  "Email": req.body.gmail,
                  "Name": "ahmed"
                }
              ],
              "Subject": "Greetings from Mailjet.",
              "TextPart": "My first Mailjet email",
              "HTMLPart": '<h2>Sakkeny<h2><br><h3>please,enter the verfication code </h3> <br> <p>code number: </>' + token,
              "CustomID": "AppGettingStartedTest"
            }
          ]
        })
        request
          .then((result) => {
            console.log(result.body)
            res.status(200).json({"message: ":"send code number /n","codeNumber":token});
          })
          .catch((err) => {
            console.log(err.statusCode)
          })
        

      })
      .catch(err => {
          console.log(err);
      })
}

exports.postReset = (req,res,next) => {
    const codeNumber = req.body.codeNumber;
    user.findOne({resetToken: codeNumber, resetExpresion: {$gt: Date.now()}})
      .then(user => {
          if(user)
          {
            return res.status(200).json({"message: ":"code number found (sucess)",user:user});
          }
          return res.status(400).json({"message:":"(error!!) code number not found"});
           
      })
      .catch(err=> {
          console.log(err);
          

      })
}

exports.newPassword = (req,res,next) => {
    const codeNumber = req.params.codeNumber;
    const password = req.body.password;
    const cPassword = req.body.cPassword;
    console.log('password' + password);
    console.log('cPassword' + cPassword);
    user.findOne({resetToken: codeNumber})
      .then(user => {
          if(!user)
          {
            return res.status(400).json({"message:":"(error!!) code number not found"});
            
          }
          else if (password != cPassword ) {
            return res.status(400).json({"message:":"(error!!) confirm password not coorect"});
            
          }
          bcrypt
            .hash(password,12)
            .then(hashedPassword => {
            
                
                user.password = hashedPassword;
            
                user.save();
                return res.status(200).json({"message: ":"code number found (sucess)",user:user});
            })
       })
      .catch(err=> {
          console.log(err);
          

      })
}



//   /reset password (send by mailget)
// //get user

exports.getUser = (req,res,next) => {
    const userId = req.params.userId;
    //console.log('userId   ' + userId);
    user.findById(userId)
    .then(users => {
        if(!users){
            
            return res.status(404).json({"message":"user not found"});
        }
        res.json({'message':'user found',users:users});
        
    })
    .then(result => {
        console.log(result);
    })


    
    
}
// //get user

// change password

exports.changePassword = (req,res,next) => {
    const userId = req.params.userId;
    const currentPassword = req.body.currentPassword;
    const password = req.body.password;
    const cPassword = req.body.cPassword;
    

    user.findById(userId).then(users => {
        if(!users){
            console.log('user not found*************************');

            return res.status(404).json({'message': 'user not found'})
            

        }
        bcrypt 
            .compare(currentPassword, users.password)
            .then(doMatch => {
                if(doMatch) {
                    bcrypt
                    .hash(password,12)
                    .then(hashedPassword => {
            
                
                        users.password = hashedPassword;
            
                        users.save();
                        console.log('password change------------------*********');
                        
                    })
                    return res.status(200).json({"message: ":"message':'password change",user:users});
                }
                res.status(400).json({'message':'wrong current password'});
            })
            .catch(err => {
                console.log(err);
                res.status(400).json({'message':'error'});
            })
    })    
};

// //change password