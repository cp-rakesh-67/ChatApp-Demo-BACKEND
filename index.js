const express=require('express');
const cors=require('cors');
const fileupload=require('express-fileupload');
require('dotenv').config();
const dbconnect=require('./config/db');
const cloudinaryConnect=require('./config/cloudinary');
const userRouter=require('./routes/auth');
const ChatRouter=require('./routes/chat');


// initialization................................
const app=express();

// middleWare...................................
app.use(cors());
app.use(express.json());
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

// mounting.....................................
app.use('/api/v1/auth',userRouter);
app.use('/api/v1/message',ChatRouter);

// listening App...................................
const port=process.env.PORT || 4000;
dbconnect();
cloudinaryConnect();
const server=app.listen(port,()=>{
    console.log(`server is running at http://localhost:${port}`);
});

// default Router....................................
app.get('/',(req,res)=>{
    res.send('this is default router of CHATapp');
})

// soket io server>>>>>>>>>>>>>>>>>>>>>>>>>>

const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:'https://chatappdemo67.netlify.app/',
    }
});

io.on('connection',(socket)=>{
    console.log('connected to socket.io');

    socket.on('setup',(userData)=>{
         socket.join(userData._id);
         console.log(userData);
         socket.emit('connected');
    });

    socket.on('join Chat',(chat_User)=>{
        socket.join(chat_User);
        console.log(chat_User);
    })

    socket.on('new message',(newMassage)=>{
        var chat=newMassage;
        if(!chat)return console.log('chat in not define');

        
        socket.in(newMassage.reciever).emit('message recieved',newMassage);
       
    });
});


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>