const mongoose=require('mongoose');
require('dotenv').config();


const dbConnection=()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{console.log('Database Connected Successfully')})
    .catch((error)=>{console.log('Error Connecting to Database : ', error)});
}


module.exports=dbConnection;