const express=require('express');
const app=express();
const cookieparser=require('cookie-parser');
const cors=require('cors');
const dbConnection=require('./config/db');
require('dotenv').config();


const PORT=process.env.PORT || 8000
// middleware
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json()) //for parsing body
app.use(cookieparser()) //for parsing cookie
app.use(express.urlencoded({ extended: true }));


// listen to port
app.listen(PORT,()=>{
    console.log(`Server listening on ${PORT}`);
})
// db connect
dbConnection();

// import routes
const routes=require('./routes/route');
app.use(routes);

// all routes


// default route
app.get('/',(req,res)=>{
    res.send('welcome');
});
  