const express=require('express');
const { Register,LogIn, UpdateProfilePicture, getAllUser, Chating_User } = require('../controllers/auth');
const router=express.Router();

router.post('/register',Register);
router.post('/login',LogIn);
router.post('/update-profile-picture',UpdateProfilePicture);
router.get('/getAlluser/:id',getAllUser);
router.get('/chat_user/:id',Chating_User);

module.exports=router;