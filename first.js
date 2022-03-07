
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);


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
app.set('view engine','pug');

//app.engine('hbs',expressHbs());
app.set('view engine', 'ejs');
app.set('views', 'views');



const adminData = require('./routs/admin'); 
const shopRouter = require('./routs/shop');


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