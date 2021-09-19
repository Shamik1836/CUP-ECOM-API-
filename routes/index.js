const express=require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require('dotenv').config()
const router=express.Router();
const authController=require('../controllers/api/v1/authController');
// app.use(express.json());
router.get('/',(req,res)=>{
    res.send("Hello World");
})
router.use('/api',require('./api'))

router.get('/signup',authController.signup_get)
router.post('/signup',authController.signup_post)
router.get('/login',authController.login_get)
router.post('/login',authController.login_post)
module.exports=router;
// router.post('/login',(req,res)=>{
//     const username=req.body.username;
//     const user={name:username}
//     //this would take an user object
//     const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
//     res.json({accessToken:accessToken})
// })
// function authenticateToken(req,res,next){
//     const authHeader=req.headers['authorization']
//     //Bearer TOKEN
//     const token=authHeader && authHeader.split(' ')[1]
//     if (token==null) return res.sendStatus(401);
//     jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
//         if (err) return res.sendStatus(403);
//         req.user=user
//         next()
//     })
// }
