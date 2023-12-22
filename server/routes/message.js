const express = require('express');
const router = express.Router();
const Message = require("../models/message");
const requireLogin = require("../middleware/requireLogin");


router.post('/message/send',requireLogin,(req,res)=>{

    const {  senderId, receiverId , message } = req.body;

    const data = new Message({
        senderId,
        receiverId, 
        message
    });

    data.save().then((msg)=>{
        res.json({message:msg});
    }).catch((err)=>{
        res.status(422).json({error:err});
    })
})


router.get("/message/:userId",requireLogin,(req,res)=>{

    const receiverId= req.params.userId;
      
   console.log("hi") 
   Message.find({
    $or: [
      { senderId: receiverId , receiverId: req.user._id},
      { senderId: req.user._id, receiverId: receiverId }
    ]
  }).then((msgs)=>{
    res.json({ messages:msgs });
  }).catch((err)=>{
    res.status(422).json({error:err});
  })

})

module.exports =router;