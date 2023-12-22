 const jwt =require('jsonwebtoken');
 const User = require("../models/user");
 const {JWT_SECRET}= require("../key");
 

module.exports =(req,res,next)=>{
    const {authorization} = req.headers

    if(!authorization){
     return  res.status(401).json({error:"you must be logged in"});
    }

    const token = authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            return  res.status(401).json({error:"you must be logged in"});
        }

        const {_id} = payload;
        console.log(_id);

        User.findById(_id).then(userdata=>{
            req.user=userdata;
            
            next();
        })
    })
}