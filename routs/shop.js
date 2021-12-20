/*
const path  = require('path');
const express = require('express');
const rootDir = require('../Util/Path');
const router  = express.Router();
const adminData = require('./admin');

router.get('/',(req, res, next) => {
    const products  = adminData.products;

    res.render('shop',{
        prods : products, 
        doctitle : 'Ahmed',
        shopTitle:'Shop',
        path:'/',
        hasproducts:products.length > 0,
        activeShop:true,
        productCSS:true
    });    
}); 



module.exports = router; 
*/

const path = require('path');
const express = require('express');
const router = express.Router();
const admindata = require('./admin');
const usercontroller = require('../controller/users');

//router.get('/',usercontroller.getdata);
module.exports = router;



