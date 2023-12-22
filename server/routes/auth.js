const express =require('express')
const router =express.Router()
const User =require("../models/user")
const bcrypt = require('bcryptjs')
const jwt =require('jsonwebtoken')
// const JWT_SECRET= "dkjowcnosw";
const {JWT_SECRET}= require("../key")
const requireLogin = require("../middleware/requireLogin")


router.get('/protected',requireLogin,(req,res)=>{
    res.send("hello")
});

router.post('/signup',(req,res)=>{
    const {name,email,password,pic} =req.body;

    if(!email || !name  || !password)
    {
        res.status(422).json({error:"please add all the field"});
    }
    
    User.findOne({email:email})
    .then((savedUser)=>{
          if(savedUser)
          {
            return res.status(422).json({error:"user already exist with that email"});
          }
          
    
          bcrypt.hash(password,12).then(hashedPassword=>{

              const user= new User({
                name,
                email,
                password:hashedPassword,
                pic:pic
              });
              
              user.save().then(user=>{
                res.json({message:"saved successfully"})
              }).catch(err=>{
                 console.log(err)
              });

          }).catch(err=>{
            console.log(err)
         })

    }).catch(err=>{
        console.log(err)
     })

})

router.post('/signin',(req,res)=>{
   
    const {email,password} = req.body;

    if(!email || !password)
    {
       return  res.status(422).json({error:"please add all the field"});
    }

    User.findOne({email:email}).then((savedUser)=>{
        
        if(!savedUser)
        {
            return  res.status(422).json({error:"Invalid email or password"});
        }

        bcrypt.compare(password,savedUser.password)
        .then(doMatch =>{
            if(doMatch)
            {
                // res.json({message:"successfully signed in"})
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET);
                const {_id,name,email,followers,following,pic} =savedUser;
                res.json({token,user:{_id,name,email,followers,following,pic}});

            }else{
                return  res.status(422).json({error:"Invalid email or password"});
            }
        }).catch(err=>{
            console.log(err)
        })

    }).catch(err=>{
        console.log(err)
    })
})


module.exports =router;