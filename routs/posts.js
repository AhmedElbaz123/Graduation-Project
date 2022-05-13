const Post = require('../model/posts');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const User = require('../model/products');
const Comment = require('../model/comment');

//search by filter





router.get("/search",(req, res, next)=>{
    
    if(req.query.location){
        const text = req.query.location.toLowerCase() 
        req.query.location = text;
    }
    Post.find(req.query)
    .exec()
    .then(docs => {
        console.log(docs);

        let Dpost = [];
        const posts = docs;
        for(let i = 0 ; i< posts.length; i++){ 
            User.findById(docs[i].ownerId)
            .then(result => {
                Comment.find({postId:docs[i]._id})
                .then(comments => {
                    
                    
                    const lengthOfPost = posts.length;
                    // post.push(docs[i],result.Fname,result.Lname);
                    let postName = posts[i];
                    let countComments = comments.length;
                    let FName = result.Fname;
                    let LName = result.Lname;
                    
                    let url = result.url;
                    Dpost[i] = [postName,countComments + ' comments',FName +' ' + LName,url]; 
                    //Dpost.push(postName,FName,LName,url);
                    //i++ ;
                    if(i == lengthOfPost -1 ){
                        res.status(200).json({Dpost});
                    }
                })
                
           
            })
            
            
            
        
        }
       
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

//end search by filter

//get all posts

router.get("/",(req, res, next) =>{
   
    Post.find()
    .exec()
    .then(docs => {
        let Dpost = [];
        const posts = docs;
        for(let i = 0 ; i< posts.length; i++){ 
            User.findById(docs[i].ownerId)
            .then(result => {
                Comment.find({postId:docs[i]._id})
                .then(comments => {
                    
                    
                    const lengthOfPost = posts.length;
                    // post.push(docs[i],result.Fname,result.Lname);
                    let postName = posts[i];
                    let countComments = comments.length;
                    let FName = result.Fname;
                    let LName = result.Lname;
                    
                    let url = result.url;
                    Dpost[i] = [postName,countComments + ' comments',FName +' ' + LName,url]; 
                    //Dpost.push(postName,FName,LName,url);
                    //i++ ;
                    if(i == lengthOfPost -1 ){
                        res.status(200).json({Dpost});
                    }
                })
                
           
            })
            
            
            
        
        }
        
       // if(docs.length >=0){
            
        //}else{
        //   res.status(404).json({
        //        massage:'No posts found'
        //    });
       // }
       
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

//  person's posts
router.get("/userPosts/:userId",(req, res, next) =>{
   const userId = req.params.userId;
    Post.find({ownerId:userId})
    .then(docs => {
        if(!docs || docs.length == 0){
            return res.status(404).json({'message':'The user has no posts'});    
        }
        const posts = docs;
        let postUser = [];
        for(let i = 0 ; i< posts.length ; i++){
            Comment.find({postId:docs[i]._id})
            .then(comments => {
                postUser[i] = [docs[i],comments.length + ' comments'];
                if(i == posts.length - 1){
                    
                    res.status(200).json(postUser);
                }

            })
        }
        
        
        
        
       
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});
//  person's posts


//create post
router.post('/:ownerId',(req, res, next) => {
    const post = new Post({
        _id: new mongoose.Types.ObjectId(),
        price: req.body.price,
        ownerId:req.params.ownerId,
        location: req.body.location,
        numberofbedrooms: req.body.numberofbedrooms,
        numberofbeds: req.body.numberofbeds,
        wifi: req.body.wifi,
        tv: req.body.tv,
        conditioner: req.body.conditioner,
        description: req.body.description,
   
       
    });
    
    post
    .save()
    .then(result =>{
      console.log(result);
      res.status(200).json({
        message: 'HANDLING POST REQUESTS TO / POSTS',
        createdPost:result
    });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

//get post by id
router.get('/:postId',(req, res, next) =>{
    const id = req.params.postId;
    let post = [];
    Post.findById(id)
    .exec()
    .then(doc => {
        if(!doc){
            res.status(404).json({
                message: 'No valid entry found for provided id'
            });
        }
        User.findById(doc.ownerId)
        .then(user => {
            Comment.find({postId:doc._id})
            .then(comments => {
                post[0] = doc;
                post[1] = comments.length + ' comments';
                post[2] = user.Fname + ' ' + user.Lname;
                post[3] = user.url;
                if(doc){
                    res.status(200).json(post);
                }
            })
            

        })        
            
        
       
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

//edit post by id
router.patch('/:postId',(req, res, next) =>{
  const id = req.params.postId;
  const updateOps = {};
  for(const ops of req.body){
      updateOps[ops.propName]= ops.value;
  }

  Post.updateOne({_id: id}, {$set: updateOps})
  .exec()
  .then(result =>{
      console.log(result);
      res.status(200).json(result);
  })
  .catch(err=> {
      console.log(err);
      res.status(500).json({
          error: err
      });
  });
});

 //delete post by id
router.delete('/:postId/:userId',(req, res, next) =>{
   const id = req.params.postId;
   const userId = req.params.userId;
   Post.remove({_id: id,ownerId:userId})
   .exec()
   .then(result =>{
       res.status(200).json(result);
   })
   .catch(err => {
       console.log(err);
       res.status(500).json({
           error: err,
           message: 'Not the owner of the post'

       });
   });
});

// add comments
router.post('/addComment/:postId/:userId',(req, res, next) =>{
    const id = req.params.postId;
    const userId = req.params.userId;
    const comment = new Comment({
        _id: new mongoose.Types.ObjectId(),
        postId: id,
        ownerId: userId,
        comment: req.body.comment,
        time: new Date().toString()
        
    })
    comment.save()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
 });
// add comments

// get post comment
router.get("/getComments/:postId",(req, res, next) =>{
    const postId = req.params.postId;
     Comment.find({postId:postId})
     .then(comments => {
         if(!comments || comments.length == 0){
             return res.status(400).json({'message':'No Comments'});    
         }
         const commentPosts = comments;
         console.log('comments.length ==>' + commentPosts.length);
         let comment = [];
         let i = 0;
         for(let i = 0 ; i< commentPosts.length; i++){ 
            User.findById(comments[i].ownerId)
            .then(result => {
                const lengthOfComment = commentPosts.length;
                // post.push(docs[i],result.Fname,result.Lname);
                let commentDetails = comments[i];
                let FName = result.Fname;
                let LName = result.Lname;
                
                let url = result.url;
                comment[i] = [commentDetails,FName +' ' + LName,url]; 

                const date1 = comments[i].time;
                const date2 = new Date();

                // To calculate the time difference of two dates
                const Difference_In_Time = date2.getTime() - date1.getTime();

                // To calculate the no. of days between two dates
                const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);


                if((Difference_In_Time / 60000) <= 1 ){

                    comments[i].timeAgo = '1 minute ago';

                } else if((Difference_In_Time / 60000) < 60){

                    comments[i].timeAgo = Math.floor((Difference_In_Time / 60000)) + ' minutes ago' ; 

                } else if ((Difference_In_Time / 60000) < 1440 ) {

                    comments[i].timeAgo = Math.floor((Difference_In_Time / 60000)/60) + ' hours ago' ;

                } else if((Difference_In_Time / 60000) < 43200){

                    comments[i].timeAgo = Math.floor((Difference_In_Time / 60000)/1440) + ' days ago' ;

                } else if((Difference_In_Time / 60000) < 525600){

                    comments[i].timeAgo = Math.floor((Difference_In_Time / 60000)/43200) + ' month ago' ;

                } else {
                    comments[i].timeAgo = Math.floor((Difference_In_Time / 60000)/518400) + ' years ago' ;
                }

               
                //Dpost.push(postName,FName,LName,url);
                //i++ ;
                if(i == lengthOfComment -1 ){
                    res.status(200).json({comment});
                }
           
            })
        
            
            
            
        
        }
         
         
         
        
     })
     .catch(err => {
         console.log(err);
         res.status(500).json({
             error: err
         });
     });
 });

// //get post comment

//delete comment 
router.delete('/deleteComment/:commentId/:userId',(req, res, next) =>{
    const id = req.params.commentId;
    const userId = req.params.userId;
    Comment.remove({_id: id,ownerId:userId})
    .exec()
    .then(result =>{
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err,
            message: 'Not the owner of the comment'
 
        });
    });
 });
// /delete comments 




module.exports = router;