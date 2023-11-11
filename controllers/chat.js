const Chat=require('../models/chat');

exports.CreateChat=async(req,res)=>{
    try{
        const {sender,reciever,message}=req.body;
        const data=await Chat.create({message,sender,reciever});
        return res.status(201).json({
            success:true,
            message:'message created',
            messages:data
        })

    }catch(error){
       return res.status(500).json({
        success:false,
        message:error
       })
    }
}

exports.getAllChat=async(req,res)=>{
    try{
        const {sender,reciever}=req.body;
      
        const data=await Chat.find({$or:[{$and:[{sender},{reciever}]},{$and:[{sender:reciever},{reciever:sender}]}]});
        return res.status(200).json({
            success:true,
            message:'all message fetch',
            messages:data,
        })

    }catch(error){
      return res.status(500).json({
        success:false,
        message:error,
      })
    }
}