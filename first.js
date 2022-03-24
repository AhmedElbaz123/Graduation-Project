
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bcrypt = require('bcryptjs');

// uploadimage
const multerConfig = require('./multer');
//const imageModel = require('./models/image'); 
const cloud = require('./cloudinaryConfig');
const fs = require('fs');
const User = require('./model/products');
// ///uploadimage


const cors = require('cors');

//const http = require("http");
//const routes = require('./routse');
const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const expressHbs = require('express-handlebars');
const error = require('./controller/error');
//const mongoConnect = require('./Util/database').mongoConnect;



const port = process.env.PORT || 5000



//const adminData = require('./routes2/adminData');
//const index = require('./routes2/index');

app.use(cors());
app.set('view engine','pug');

//app.engine('hbs',expressHbs());
app.set('view engine', 'ejs');
app.set('views', 'views');



const adminData = require('./routs/admin'); 
const shopRouter = require('./routs/shop');

//  upload image and signUp
//app.use('/images',express.static('images'));

app.post ('/signUp',multerConfig, async (req,res) => {
  const Fname = req.body.FName;
  const Lname = req.body.LName;
  const gmail = req.body.Gmail;
  const gender = req.body.Gender;
  const age = req.body.Age;
  const password = req.body.Password;
  const cPasssword = req.body.CPassword;
  let url = 'https://res.cloudinary.com/egyptegypt/image/upload/v1648162560/u0vbzqyiczyoxtkpfx9n.jpg';
  let imageName = 'default image';
  console.log('file   ' + req.file);
  if(req.files[0]) {
    console.log('in file============>');
    const result = await cloud.uploads(req.files[0].path);
    imageName =  req.files[0].originalname;
    url =  result.url;
    
  }
  
  User.findOne({gmail: gmail}).then(userDoc => {
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
            const users = new User({
                Fname:Fname,
                Lname:Lname,
                gmail:gmail,
                gender:gender,
                age:age,
                password:hashedPassword,
                imageName: imageName,
                url : url
            });
                return users.save();
        })
})

.then(result => {
    // delete image from local
    if(req.files[0]) {
    fs.unlinkSync(req.files[0].path);
    }
    // //delete image from local
    res.status(200).json({'message':'Sign Up', user:result});
    console.log(result);
}).catch(err => {
    console.log(err);
});



  
})



//   //upload image signUp

// updateUser
app.post('/updateUser/:userId',multerConfig,async (req,res) => {
    const userId = req.params.userId;
    console.log('userId   ' + userId);
    const Fname = req.body.FName;
    const Lname = req.body.LName;
    const gender = req.body.Gender;
    const age = req.body.Age;
    const result = await cloud.uploads(req.files[0].path);
    const imageName =  req.files[0].originalname;
    const url =  result.url;
    

    User.findById(userId)
    .then(users => {
        if(!users){
            
            return res.status(404).json({"message":"user not found"});
        }

        users.Fname = Fname;
        users.Lname = Lname;
        users.gender = gender;
        users.age = age;
        users.imageName =  imageName;
        users.url = url;
        return users.save();
        
    })
    .then(result => {
        // delete image from local
        fs.unlinkSync(req.files[0].path);
        // //delete image from local
        res.status(200).json({"message":"user updated",user:result});
        console.log(result);
    })

})
// //updateUser



app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json()); // rest api
app.use(express.static(path.join(__dirname,'public')));
app.use('/admin',adminData);
//app.use(shopRouter);
app.use('/indexof',(req,res,next) =>  {
    console.log('hello............');
    res.send('<h1>page of index</h1>');
    
});
app.use(express.static(path.join(__dirname,'public')));


//app.use(error.geterror);


  
//console.log(routes.sometext);
//const server  = http.createServer(app);

// mongoConnect(() => {
//     app.listen(5000);
// });
// app.use(
//     session({
//       secret: 'my secret',
//       resave: false,
//       saveUninitialized: false
//     })
//   );
const MONGODB_URI =
'mongodb+srv://Graduatenum1:9qb2gSvMdPrFrMC@cluster0.bwlfg.mongodb.net/SHOP?retryWrites=true&w=majority';


const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'users'
});

mongoose.connect(MONGODB_URI, ()=> {
  app.listen(port);
});


//   echo "# Graduation-Project" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/AhmedElbaz123/Graduation-Project.git
// git push -u origin main