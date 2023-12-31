const express = require('express');
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/user");
const requireLogin = require("../middleware/requireLogin")


router.get('/user/:id', requireLogin, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {

            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name")
                .then((posts) => {
                    res.json({ user, posts });
                }).catch(err => {
                    return res.status(422).json({ error: err });
                })

        }).catch(err => {
            return res.status(422).json({ error: "User not Found" });
        })
});

router.get('/allpost', requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .then((posts) => {
            res.json({ posts });
        }).catch((err) => {
            console.log(err);
        })
});

router.post('/createpost', requireLogin, (req, res) => {
    const { title, body, pic } = req.body;

    if (!title || !body || !pic) {
        return res.status(422).json({ error: "Please add all the field" });
    }


    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user
    });

    //   console.log(post);
    post.save().then((result) => {
        res.json({ post: result });
    }).catch((err) => {
        console.log(err);
    })
});

router.get('/mypost', requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .then((mypost) => {
            res.json({ mypost });
        }).catch((err) => {
            console.log(err);
        })
})

router.put('/like', requireLogin, (req, res) => {

    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).then((result) => {
        res.json(result);
    }).catch(err => {
        return res.status(422).json({ error: err })
    })
    // .exec((err,result)=>{
    //     if(err){
    //         return res.status(422).json({error:err})
    //     }else{
    //         res.json(result);
    //     }
    // })
})

router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).then((result) => {
        res.json(result);
    }).catch(err => {
        return res.status(422).json({ error: err })
    })
    // .exec((err,result)=>{
    //     if(err){
    //         return res.status(422).json({error:err})
    //     }else{
    //         res.json(result);
    //     }
    // })
})

router.put('/comment', requireLogin, (req, res) => {

    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }

    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    }).populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .then((result) => {
            res.json(result);
        }).catch(err => {
            return res.status(422).json({ error: err })
        })
    // .exec((err,result)=>{
    //     if(err){
    //         return res.status(422).json({error:err})
    //     }else{
    //         res.json(result);
    //     }
    // })
})

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .then((post) => {
            if (!post) {
                return res.status(422).json({ error: "Error exits" });
            }

            if (post.postedBy._id.toString() == req.user._id.toString()) {
                post.deleteOne()
                    .then((result => {
                        console.log(result);
                        res.json(result);
                    })).catch(err => {
                        console.log(err);
                    })
            }
        }).catch(err => {
            console.log(err);
        })
})

router.put('/follow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, { new: true }
        // , (err, result) => {

        //     if (err) {
        //         return res.status(422).json({ error: err });
        //     }

        //     User.findByIdAndUpdate(req.user._id,{
        //         $push:{following:req.body.followId}
        //     },{ new : true}).then(result=>{
        //         res.json(result);
        //     }).catch(err=>{
        //         return res.status(422).json({ error: err });
        //     })
        // }
    ).then((result) => {
        User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        }, { new: true }).select("-password").then( result => {
            res.json(result);
        }).catch(err => {
            return res.status(422).json({ error: err });
        })
    }).catch(err => {
        return res.status(422).json({ error: err });
    })
})


router.put('/unfollow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user._id }
    }, { new: true }
    ).then((result) => {
        User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.unfollowId }
        }, { new: true }).select("-password").then( result => {
            res.json(result);
        }).catch(err => {
            return res.status(422).json({ error: err });
        })
    }).catch(err => {
        return res.status(422).json({ error: err });
    })
})

module.exports = router;