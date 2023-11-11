const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const cloudinary=require('cloudinary').v2;
require('dotenv').config();


exports.Register=async(req,res)=>{
    try{
        const {name,email,password,conformPassword}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:'please fill all the field...'
            })
        }
        if(password !==conformPassword){
            return res.status(400).json({
                success:false,
                message:'please chack at your conformPassword..'
            })
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'user Already exist ! please Login !'
            })
        }
        if(password.length<6){
            return res.status(400).json({
                success:false,
                message:'passport must be greter than 6'
            })
        }
        const hassedPassword=await bcrypt.hash(password,10);
        const data=await User.create({name,email,password:hassedPassword});
        const token=await jwt.sign({_id:data._id},process.env.JWT_SECRETE,{
            expiresIn: '24h'
        });
        const newdata=data.toObject();
        newdata.token=token;
        newdata.password=undefined;
        return res.status(201).json({
            success:true,
            message:'Account creates Successfully.',
            user:newdata,
        })
    }catch(error){
       return res.status(500).json({
        success:false,
        message:error.message
       })
    }
}

exports.LogIn=async(req,res)=>{
   try{
      const { email,password}=req.body;
      if(!email || !password)
      {
        return res.status(400).json({
            success:false,
            message:'please fill all the field',
        })
      }
      const user=await User.findOne({email});
      if(!user){
        return res.status(400).json({
            success:false,
            message:"user dos't exist ! please Register !"
        })
      }
      if(await bcrypt.compare(password,user.password)){
        const token=await jwt.sign({_id:user._id},process.env.JWT_SECRETE,{
            expiresIn: '24h'
        });
        const newUser=user.toObject();
        newUser.token=token;
        newUser.password=undefined;
        return res.status(200).json({
            success:true,
            message:'user login SuccessFully',
            user:newUser
        })

      }else{
         return res.status(400).json({
            success:false,
            message:'email and password dose not match',
         })
      }    
   }catch(error){
     return res.status(500).json({
        success:false,
        message:error.message
       })
   }
}

exports.UpdateProfilePicture=async(req,res)=>{
    try{
        const {id}=req.body;
        const files=req.files.photo;
       

    const uploadImage=async(file,folder)=>{
        const options={folder};
        return await cloudinary.uploader.upload(file.tempFilePath,options);
    }

    const respond=await uploadImage(files,'CHATAPP');
    const data=await respond;
    const UserToUpdate=await User.findById(id);
    UserToUpdate.profilePic=data.secure_url;
    UserToUpdate.save();
    return res.status(200).json({
        success:true,
        message:'User Profile Picture is Updated',
        user:UserToUpdate
    })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error
        })
    }
}

exports.getAllUser=async(req,res)=>{
    try{
        const {id}=req.params;
        const alluser=await User.find({_id:{$ne:id}}).select('-password');
        return res.status(200).json({
            success:true,
            message:'user data fetch',
            users:alluser
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error,
        })
    }
}

exports.Chating_User=async(req,res)=>{
    try{
        const {id}=req.params;
        const user=await User.findOne({_id:id});
        if(!user){
            return res.status(400).json({
                success:false,
                message:'user dos\'t exist'
            })
        }
        user.password=undefined;
        return res.status(200).json({
            success:true,
            message:'chat_user fetch',
            chat_user:user
        })

    }catch(error)
    {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}