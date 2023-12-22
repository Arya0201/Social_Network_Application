const mongoose= require('mongoose');
const  {ObjectId} =mongoose.Schema.Types;

const messageSchema = new mongoose.Schema(
    {
        senderId:{type:ObjectId , ref:"User", required:true},
        receiverId:{type:ObjectId , ref:"User", required:true},
        message:{
            type:String,
            required:true
        },
        timestamp: { type: Date, default: Date.now }
    }
)

module.exports = mongoose.model("Message",messageSchema);