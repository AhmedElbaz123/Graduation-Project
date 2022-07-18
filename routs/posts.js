const Post = require('../model/posts');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const User = require('../model/products');
const Comment = require('../model/comment');
const reservedPosts = require('../model/reservedPosts');
const notification = require('../model/notification');
const Like = require('../model/like');
const { query } = require('express');

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

                    Like.find({postId:docs[i]._id})
                    .then(likes => {
                        const likesCo = likes.length;
                        //console.log('likesCo==>  ' + likesCo  + '     '+ docs[i]._id);
                        const lengthOfPost = posts.length;
                        // post.push(docs[i],result.Fname,result.Lname);
                        let postName = posts[i];
                        let countComments = comments.length;
                        let FName = result.Fname;
                        let LName = result.Lname;
                        
                        let url = result.url;
                        docs[i].numberOfLikes = likesCo;
                        docs[i].ownersLike = likes;
                        Dpost[i] = [postName,countComments + ' comments',FName +' ' + LName,url];
                        
                        // time ago 
                        console.log( 'docs[i].time===> ' + docs[i].time)
                        let date1 = docs[i].time;
                        const date2 = new Date();

                        // To calculate the time difference of two dates
                        const Difference_In_Time = date2.getTime() - date1.getTime();

                        // To calculate the no. of days between two dates
                        const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);


                        if((Difference_In_Time / 60000) <= 1 ){

                            docs[i].timeAgo = '1 minute ago';

                        } else if((Difference_In_Time / 60000) < 60){

                            docs[i].timeAgo = Math.floor((Difference_In_Time / 60000)) + ' minutes ago' ; 

                        } else if ((Difference_In_Time / 60000) < 1440 ) {

                            docs[i].timeAgo = Math.floor((Difference_In_Time / 60000)/60) + ' hours ago' ;

                        } else if((Difference_In_Time / 60000) < 43200){

                            docs[i].timeAgo = Math.floor((Difference_In_Time / 60000)/1440) + ' days ago' ;

                        } else if((Difference_In_Time / 60000) < 525600){

                            docs[i].timeAgo = Math.floor((Difference_In_Time / 60000)/43200) + ' month ago' ;

                        } else {
                            docs[i].timeAgo = Math.floor((Difference_In_Time / 60000)/518400) + ' years ago' ;
                        }

                    
                        /////
                        
                        // post.push(docs[i],result.Fname,result.Lname);
                        
                         
                        //Dpost.push(postName,FName,LName,url);
                        //i++ ;
                        if(i == lengthOfPost -1 ){
                            res.status(200).json({Dpost});
                        }
                    })    
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
   
    Post.find().sort({time: -1})
    .exec()
    .then(docs => {
        let Dpost = [];
        const posts = docs;
        for(let i = 0 ; i< posts.length; i++){ 
            User.findById(docs[i].ownerId)
            .then(result => {
                Comment.find({postId:docs[i]._id})
                .then(comments => {
                    Like.find({postId:docs[i]._id})
                    .then(likes => {
                        const likesCo = likes.length;
                        //console.log('likesCo==>  ' + likesCo  + '     '+ docs[i]._id);
                        const lengthOfPost = posts.length;
                        // post.push(docs[i],result.Fname,result.Lname);
                        let postName = posts[i];
                        let countComments = comments.length;
                        let FName = result.Fname;
                        let LName = result.Lname;
                        
                        let url = result.url;
                        docs[i].numberOfLikes = likesCo;
                        docs[i].ownersLike = likes;
                        console.log('docs[i].ownersLike ' + docs[i].ownersLike + '  likes.ownerId'  + likes.ownerId);
                        Dpost[i] = [postName,countComments + ' comments',FName +' ' + LName,url];
                        
                        // time ago 
                        //console.log( 'docs[i].time===> ' + docs[i].time)
                        let date1 = docs[i].time;
                        const date2 = new Date();

                        // To calculate the time difference of two dates
                        const Difference_In_Time = date2.getTime() - date1.getTime();

                        // To calculate the no. of days between two dates
                        const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);


                        if((Difference_In_Time / 60000) <= 1 ){

                            docs[i].timeAgo = '1 minute ago';

                        } else if((Difference_In_Time / 60000) < 60){

                            docs[i].timeAgo = Math.floor((Difference_In_Time / 60000)) + ' minutes ago' ; 

                        } else if ((Difference_In_Time / 60000) < 1440 ) {

                            docs[i].timeAgo = Math.floor((Difference_In_Time / 60000)/60) + ' hours ago' ;

                        } else if((Difference_In_Time / 60000) < 43200){

                            docs[i].timeAgo = Math.floor((Difference_In_Time / 60000)/1440) + ' days ago' ;

                        } else if((Difference_In_Time / 60000) < 525600){

                            docs[i].timeAgo = Math.floor((Difference_In_Time / 60000)/43200) + ' month ago' ;

                        } else {
                            docs[i].timeAgo = Math.floor((Difference_In_Time / 60000)/518400) + ' years ago' ;
                        }

                        // //time ago 
                        //Dpost.push(postName,FName,LName,url);
                        //i++ ;
                        if(i == lengthOfPost -1 ){
                            res.status(200).json({Dpost});
                        }
                    })
                    
                    
                    
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
                Like.find({postId:docs[i]._id})
                    .then(likes => {
                        const likesCo = likes.length;
                        //console.log('likesCo==>  ' + likesCo  + '     '+ docs[i]._id);
                        const lengthOfPost = posts.length;
                        // post.push(docs[i],result.Fname,result.Lname);
                        docs[i].numberOfLikes = likesCo;
                        docs[i].ownersLike = likes;
                        postUser[i] = [docs[i],comments.length + ' comments'];
                        
                        // time ago 
                        console.log( 'docs[i].time===> ' + docs[i].time)
                        let date1 = docs[i].time;
                        const date2 = new Date();

                        // To calculate the time difference of two dates
                        const Difference_In_Time = date2.getTime() - date1.getTime();

                        // To calculate the no. of days between two dates
                        const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);


                        if((Difference_In_Time / 60000) <= 1 ){

                            docs[i].timeAgo = '1 minute ago';

                        } else if((Difference_In_Time / 60000) < 60){

                            docs[i].timeAgo = Math.floor((Difference_In_Time / 60000)) + ' minutes ago' ; 

                        } else if ((Difference_In_Time / 60000) < 1440 ) {

                            docs[i].timeAgo = Math.floor((Difference_In_Time / 60000)/60) + ' hours ago' ;

                        } else if((Difference_In_Time / 60000) < 43200){

                            docs[i].timeAgo = Math.floor((Difference_In_Time / 60000)/1440) + ' days ago' ;

                        } else if((Difference_In_Time / 60000) < 525600){

                            docs[i].timeAgo = Math.floor((Difference_In_Time / 60000)/43200) + ' month ago' ;

                        } else {
                            docs[i].timeAgo = Math.floor((Difference_In_Time / 60000)/518400) + ' years ago' ;
                        }

                        
                        if(i == posts.length - 1){
                            
                            res.status(200).json(postUser);
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
                Like.find({postId:doc._id})
                    .then(likes => {
                        const likesCo = likes.length;
                        //console.log('likesCo==>  ' + likesCo  + '     '+ docs[i]._id);
                        doc.numberOfLikes = likesCo;
                        doc.ownersLike = likes;
                        // time ago 
                        //console.log( 'docs[i].time===> ' + doc[i].time)
                        post[0] = doc;
                        post[1] = comments.length + ' comments';
                        post[2] = user.Fname + ' ' + user.Lname;
                        post[3] = user.url;
                        
                        let date1 = doc.time;
                        const date2 = new Date();

                        // To calculate the time difference of two dates
                        const Difference_In_Time = date2.getTime() - date1.getTime();

                        // To calculate the no. of days between two dates
                        const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);


                        if((Difference_In_Time / 60000) <= 1 ){

                            doc.timeAgo = '1 minute ago';

                        } else if((Difference_In_Time / 60000) < 60){

                            doc.timeAgo = Math.floor((Difference_In_Time / 60000)) + ' minutes ago' ; 

                        } else if ((Difference_In_Time / 60000) < 1440 ) {

                            doc.timeAgo = Math.floor((Difference_In_Time / 60000)/60) + ' hours ago' ;

                        } else if((Difference_In_Time / 60000) < 43200){

                            doc.timeAgo = Math.floor((Difference_In_Time / 60000)/1440) + ' days ago' ;

                        } else if((Difference_In_Time / 60000) < 525600){

                            doc.timeAgo = Math.floor((Difference_In_Time / 60000)/43200) + ' month ago' ;

                        } else {
                            doc.timeAgo = Math.floor((Difference_In_Time / 60000)/518400) + ' years ago' ;
                        }

                        /////
                        
                        if(doc){
                            res.status(200).json(post);
                        }
                    })
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
        Post.findById(req.params.postId)
        .then(post=>{
            
            User.findById(req.params.userId)
            .then(user => {
                const ownerPost = post.ownerId;
                const name = user.Fname + ' ' + user.Lname;
                const urlImage = user.url;
                const newNotification = new notification({
                    _id: new mongoose.Types.ObjectId(),
                    senderId: req.params.userId,
                    receiverId: ownerPost,
                    name: name,
                    urlImage:urlImage,
                    text: name + ' commented on your post',
                    time: new Date().toString()
                })
                newNotification.save()
                .then(notification => {
                    console.log(notification);
                    res.status(200).json({message:'comment added' ,comment:result});
                })



            })

        })

       
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
     Comment.find({postId:postId}).sort({time: -1})
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
        res.status(200).json({message:'comment deleted'});
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

// postBooked

router.post('/bookNow/:postId/:userId',(req,res,next)=> {
    const reservedPost = new reservedPosts({
        _id: new mongoose.Types.ObjectId(),
        postId: req.params.postId,
        userId: req.params.userId,
        time: new Date().toString()
        
    })
    reservedPost.save()
    .then(result => {
        //console.log(result);
        Post.findById(req.params.postId)
        .then(post=>{
            
            User.findById(req.params.userId)
            .then(user => {
                const ownerPost = post.ownerId;
                const name = user.Fname + ' ' + user.Lname;
                const urlImage = user.url;
                const newNotification = new notification({
                    _id: new mongoose.Types.ObjectId(),
                    senderId: req.params.userId,
                    receiverId: ownerPost,
                    name: name,
                    urlImage:urlImage,
                    text: name + ' booked your apartment now',
                    time: new Date().toString()
                })
                newNotification.save()
                .then(notification => {
                    console.log(notification);
                    res.status(200).json({message:'postbooked',results:result});
                })



            })

        })
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
})

// //postBooked

// get notification
router.get('/getNotification/:userId',(req, res, next) =>{
    notification.find({receiverId:req.params.userId}).sort({time: -1})
    .then(notifications => {
        if(!notifications){
            res.status(404).json({
                message: 'No Notification avialable'
            });
        }
        const countNoti = notifications;
        for(let i= 0; i< countNoti.length; i++){
            const date1 = notifications[i].time;
            const date2 = new Date();

            // To calculate the time difference of two dates
            const Difference_In_Time = date2.getTime() - date1.getTime();

            // To calculate the no. of days between two dates
            const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);


            if((Difference_In_Time / 60000) <= 1 ){

                notifications[i].timeAgo = '1 minute ago';

            } else if((Difference_In_Time / 60000) < 60){

                notifications[i].timeAgo = Math.floor((Difference_In_Time / 60000)) + ' minutes ago' ; 

            } else if ((Difference_In_Time / 60000) < 1440 ) {

                notifications[i].timeAgo = Math.floor((Difference_In_Time / 60000)/60) + ' hours ago' ;

            } else if((Difference_In_Time / 60000) < 43200){

                notifications[i].timeAgo = Math.floor((Difference_In_Time / 60000)/1440) + ' days ago' ;

            } else if((Difference_In_Time / 60000) < 525600){

                notifications[i].timeAgo = Math.floor((Difference_In_Time / 60000)/43200) + ' month ago' ;

            } else {
                notifications[i].timeAgo = Math.floor((Difference_In_Time / 60000)/518400) + ' years ago' ;
            }
            if(i == countNoti.length - 1){
                res.status(200).json(notifications);
            }
        }
        
        
        
       
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});
// //get notification

// create like

router.get('/addLike/:postId/:userId',(req, res, next) =>{

    const id = req.params.postId;
    const userId = req.params.userId;

    Like.find({postId:req.params.postId,ownerId:req.params.userId}).then(likes => {
        console.log('in post');
        console.log('likes ==>' + likes);
        //console.log(likes[0].postId + '==' + req.params.postId + likes[0].ownerId + '==' + req.params.userId);
        if(likes.length == 0){

            const like = new Like({
                _id: new mongoose.Types.ObjectId(),
                postId: id,
                ownerId: userId,
                time: new Date().toString()
                
            })
            like.save()
            .then(result => {
                Post.findById(req.params.postId)
                .then(post=>{
                    
                    User.findById(req.params.userId)
                    .then(user => {
                        const ownerPost = post.ownerId;
                        const name = user.Fname + ' ' + user.Lname;
                        const urlImage = user.url;
                        const newNotification = new notification({
                            _id: new mongoose.Types.ObjectId(),
                            senderId: req.params.userId,
                            receiverId: ownerPost,
                            name: name,
                            urlImage:urlImage,
                            text: name + ' liked on your post',
                            time: new Date().toString()
                        })
                        newNotification.save()
                        .then(notification => {
                            console.log(notification);
                            return (res.status(200).json({message:'like added' ,like:result}));
                        })
        
        
        
                    })
        
                })
        
               
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });

            
            
        } else {
            console.log('like found======>' + likes);
            Like.remove({postId:req.params.postId,ownerId:req.params.userId})
            .exec()
            .then(result =>{
                res.status(200).json({message:'disLike sucess '});
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err,
                    message: 'Not the owner of the comment'
        
                });
            });
        }
        
        
        
        //console.log('likes.ownerId ==> ' + likes.ownerId  + '  req.params.userId==> ' +req.params.userId );
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err,
            message: 'Not the owner of the comment'
 
        });
    });

    
    
 });
// create like

// //console.log('location==>' + (doc.locationMap.slice(0,5) - 2) + '   ' + doc.locationMap.slice(19,24));
// router.get("/nearestPlace/:locationMap",(req, res, next) =>{
//     const leftPart = req.params.locationMap.slice(0,4);
//     const rightPart = req.params.locationMap.slice(19,24);

// locationMap
router.get("/nearestPlace/:locationMap",(req, res, next) =>{
    const location =  (req.params.locationMap).toString().split(" ");
    const leftPart = (Math.round((Number(location[0]).toFixed(3)) * 100));
    const rightPart = (Math.round((Number(location[1]).toFixed(3)) * 100)) 
    const leftPartPo = Number(leftPart) +2;
    const leftPartNe = leftPart -2;
    const rightPartPo = Number(rightPart) +2;
    const rightPartNe = rightPart -2;
    console.log('leftPart ' + rightPart );
    console.log('leftPartPo  ' + leftPartPo + ' leftPartNe ' + leftPartNe + ' rightPartPo ' + rightPartPo + ' rightPartNe' + rightPartNe );
    //console.log(' leftPartPos==> ' + leftPartPo );
    Post.find()
    .exec()
    .then(docs => {
        let Dpost = [];
        const posts = docs;
        for(let i = 0 ; i< posts.length; i++){
            let locationPost =  (docs[i].locationMap).split(" ");
            let leftPost = (Math.round((Number(locationPost[0]).toFixed(3)) * 100));
            let rightPost = (Math.round((Number(locationPost[1]).toFixed(3)) * 100));
            let j = 0;
            
            if(leftPartNe  <= leftPost && leftPost <= leftPartPo ){
                console.log('in if ========> ');
                //console.log('leftPart- .02 ' + leftPart- .02 + ' leftPost ' + leftPart+ .02);
                if(rightPartNe  <= rightPost && rightPost <= rightPartPo ){
                    console.log('leftPost  ' + leftPost  + ' rightPost ' + rightPost  +'   ==> '+ docs[i]._id);
                    // User.findById(docs[i].ownerId)
                    // .then(result => {
                    //     Comment.find({postId:docs[i]._id})
                    //     .then(comments => {
                    //         Like.find({postId:docs[i]._id})
                    //         .then(likes => {
                    //             const likesCo = likes.length;
                    //             //console.log('likesCo==>  ' + likesCo  + '     '+ docs[i]._id);
                    //             const lengthOfPost = posts.length;
                    //             // post.push(docs[i],result.Fname,result.Lname);
                    //             let postName = posts[i];
                    //             let countComments = comments.length;
                    //             let FName = result.Fname;
                    //             let LName = result.Lname;
                                
                    //             let url = result.url;
                    //             docs[i].numberOfLikes = likesCo;
                    //             //docs[i].ownersLike = likes;
                    //             //console.log('docs[i].ownersLike ' + docs[i].ownersLike + '  likes.ownerId'  + likes.ownerId);
                    //             Dpost[j] = [postName,countComments + ' comments',FName +' ' + LName,url];
                    //             j++;
                    //             // time ago 
                    //             //console.log( 'docs[i].time===> ' + docs[i].time)
                    //             let date1 = docs[i].time;
                    //             const date2 = new Date();

                    //             // To calculate the time difference of two dates
                    //             const Difference_In_Time = date2.getTime() - date1.getTime();

                    //             // To calculate the no. of days between two dates
                    //             const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);


                    //             if((Difference_In_Time / 60000) <= 1 ){

                    //                 docs[i].timeAgo = '1 minute ago';

                    //             } else if((Difference_In_Time / 60000) < 60){

                    //                 docs[i].timeAgo = Math.floor((Difference_In_Time / 60000)) + ' minutes ago' ; 

                    //             } else if ((Difference_In_Time / 60000) < 1440 ) {

                    //                 docs[i].timeAgo = Math.floor((Difference_In_Time / 60000)/60) + ' hours ago' ;

                    //             } else if((Difference_In_Time / 60000) < 43200){

                    //                 docs[i].timeAgo = Math.floor((Difference_In_Time / 60000)/1440) + ' days ago' ;

                    //             } else if((Difference_In_Time / 60000) < 525600){

                    //                 docs[i].timeAgo = Math.floor((Difference_In_Time / 60000)/43200) + ' month ago' ;

                    //             } else {
                    //                 docs[i].timeAgo = Math.floor((Difference_In_Time / 60000)/518400) + ' years ago' ;
                    //             }

                    //             // //time ago 
                    //             //Dpost.push(postName,FName,LName,url);
                    //             //i++ ;
                    //             if(i == lengthOfPost -1 ){
                    //                 res.status(200).json({Dpost});
                    //             }
                    //         })
                            
                            
                            
                    //     })
                        
                
                    // })
                    Dpost.push(docs[i]);
                    console.log('Dpost  ' + Dpost);
                }
                
            }
            if(i == docs.length -1 ){
                if(Dpost.length == 0){
                    return res.status(400).json({message:"There are no places nearby"});
                }   
                res.status(200).json({Dpost});
            }
                //return res.status(400).json({message:"There are no places nearby"});
            
            
            
            
            
        
        }
        if(Dpost.length == 0){
            return res.status(400).json({message:"There are no places nearby"});
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

// //locationMap

module.exports = router;