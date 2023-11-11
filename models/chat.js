const mongoose=require('mongoose');

const ChatSchema=new mongoose.Schema({
    message:{
        type:String,
        require:true,
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    reciever:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true});

const Chat=mongoose.model('Chat',ChatSchema);
module.exports=Chat;