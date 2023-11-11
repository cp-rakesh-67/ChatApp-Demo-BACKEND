const express=require('express');
const { CreateChat, getAllChat } = require('../controllers/chat');
const router=express.Router();

router.post('/createChat',CreateChat);
router.post('/getAllChat',getAllChat);

module.exports=router;