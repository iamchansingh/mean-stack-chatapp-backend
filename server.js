const express = require('express');
const mongoose= require ('mongoose');
const dbConfig=require('./config/secrets')
const app=express();
const cookieParser=require('cookie-parser');
const logger =require('morgan');
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({extended:true,limit:'50mb' }))
mongoose.Promise=global.Promise;
mongoose.connect(dbConfig.url, { useNewUrlParser: true });
const auth=require('./routes/authRoutes');
app.use('/api/chatapp',auth);
app.listen(3000,()=>{
    console.log('running babes');
})