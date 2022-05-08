const Post = require('../model/posts');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const User = require('../model/products');
const Comment = require('../model/comment');
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
        console.log();
        if(!docs || docs.length == 0){
            return res.status(404).json({'message':'The user has no posts'});    
        }
        
        res.status(200).json(docs);
        
        
       
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
            post[0] = doc;
            post[1] = user.Fname + ' ' + user.Lname;
            post[2] = user.url;
            if(doc){
                res.status(200).json(post);
            }

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