/*const path = require('path');
const express = require('express');
const rootDir = require('../Util/Path');
const router = express.Router();
const products = [];
router.get('/add-product',(req,res,next) => {
    res.render('add-product',{pageTitle: 'Add Product',path:'/admin/add-product'});

  
});

router.post('/add-product', (req,res,next) => {
    products.push({title: req.body.title});
    //console.log(req.body);
    res.redirect('/');
});

exports.routes = router;
exports.products = products; */


const path = require('path');
const express = require('express');
const rootDir = require('../Util/Path');
const router = express.Router();
//const products = [];
const usercontroller= require('../controller/users');

router.get('/adduser',usercontroller.getuser);
router.get('/login',usercontroller.getLogin);

// router.get('/add_url_image',usercontroller.geturl);
// router.post('/add_url_image',usercontroller.postuserurl);
router.post('/adduser',usercontroller.postuser);
router.post('/login',usercontroller.postLogin);
//router.get('/login',usercontroller.getLogin);
module.exports = router;
//exports.routes = router; // delete to start api 

//exports.products = products; 