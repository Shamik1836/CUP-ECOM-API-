const express=require('express');
const dotenv=require('dotenv').config()
const port=process.env.PORT||8000;
const app=express();
const db=require('./config/mongoose');
const cookieParser=require('cookie-parser')
const passport=require('passport');

app.use(express.json());
app.use(passport.initialize())
require('./middlewares/passport')(passport);
// app.use('/',require('./routes'))
app.use('/api/users',require('./routes/users'))
app.use(cookieParser());

app.listen(port,()=>console.log('listening on port',port));

