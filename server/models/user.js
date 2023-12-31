const mongoose =require('mongoose');
const {ObjectId}=mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        pic:{
            type:String,
            default:"https://res.cloudinary.com/do5rqhxpz/image/upload/v1702543879/ankazl4wjpkfwcyc7lsj.png"
        },
        followers:[{type:ObjectId, ref:"User"}],
        following:[{type:ObjectId, ref:"User"}]
    }
);

 module.exports = mongoose.model("User",userSchema);