const mongoose=require('mongoose');
require('dotenv').config();

const dbConnect=()=>{
    mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>{console.log('database connect SuccessFully')}).catch((error)=>{console.log(error);process.exit(1)});
};

module.exports=dbConnect;

