const express=require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require('dotenv').config()
const router=express.Router();
const {signup,login,userAuth,serializeUser,checkRole,verifyUser,addProduct,getAllProducts,deleteProduct}=require('../controllers/api/v1/authController')

//Consumer SignUp Route
router.post('/consumer-signup',async(req,res)=>{
    await signup(req.body,'consumer',res);
})

//Supplier SignUp Route
router.post('/supplier-signup',async(req,res)=>{
    await signup(req.body,'supplier',res);
})

//Admin SignUp Route
router.post('/admin-signup',async(req,res)=>{
    await signup(req.body,'admin',res);
})


//Consumer Login Route
router.post('/consumer-login',async(req,res)=>{
    await login(req.body,'consumer',res);
})


//Supplier Login Route
router.post('/supplier-login',async(req,res)=>{
    await login(req.body,'supplier',res);
})


//Admin Login Route

router.post('/admin-login',async(req,res)=>{
    await login(req.body,'admin',res);
})


//Profile Router 
router.get('/profile',userAuth,async(req,res)=>{
    return res.json(serializeUser(req.body))
})

//User Protected Route
router.get('/consumer-protected',userAuth,checkRole(['consumer']),async(req,res)=>{

})
//Supplier Protected Route
router.get('/supplier-protected',userAuth,checkRole(['supplier']),async(req,res)=>{})

//Admin Protected Route
router.get('/admin-protected',userAuth,checkRole(['admin']),async(req,res)=>{})
//Route for validating the supplier by the admin
router.post('/verify-supplier',async(req,res)=>{
    await verifyUser(req.body,'admin',res);
});
//Route for adding new product by the customer
router.post('/addProduct',async(req,res)=>{
    await addProduct(req.body,res)})
//Route for getting all the products in the cart of the customer with the given id
router.get('/getallProducts',async(req,res)=>{
    await getAllProducts(req.body,res)})
//Route for deleting the products
router.post('/deleteProduct',async(req,res)=>{
    await deleteProduct(req.body,res)
})
module.exports=router;