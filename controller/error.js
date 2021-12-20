exports.geterror = (req,res,next) => {
    //res.status(404).sendFile(path.join(__dirname,'/views','404.html'));
   // console.log(__dirname);
    res.send('<h1>Page Not Found</h1>');
    
    
};