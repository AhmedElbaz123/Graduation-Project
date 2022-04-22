const Post = require('../model/posts');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');

//get all posts

router.get("/",(req, res, next) =>{
   
    Post.find()
    .exec()
    .then(docs => {
        console.log(docs[1]);
       // if(docs.length >=0){
            res.status(200).json(docs);
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
    Post.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(404).json({
                message: 'No valid entry found for provided id'
            });
        }
       
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


module.exports = router;