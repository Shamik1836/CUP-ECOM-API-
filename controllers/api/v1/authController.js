const jwt=require('jsonwebtoken')
const passport=require('passport');
const bcrypt=require('bcrypt')
const User=require("../../../model/Users");


//handle errors 
const handleErrors=(err)=>{
    console.log(err.message,err.code);
    //if there is an error in email we return password and if password error then return email
    let errors={email:"",password:""}

    //incorrect Email
    if (err.message==='Incorrect Email Provided'){
        errors.email='This email is not registered with us'
    }
    //incorrect Password
    if (err.message==='Incorrect password'){
        errors.password='Sorry That password is incorrect'
    }

    //duplicate key Errors
    if (err.code===11000){
        errors.email='that email is already registered with us';
        return errors;
    }

    if (err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path]=properties.message;
        })
    }
    return errors;
}
const maxAge=3*24*60*60;
const createToken = (id)=>{
    return jwt.sign({id},'dassmik secret',{
        expiresIn:maxAge
    });
}
const signup=async (userDets,role,res)=>{
    // const {email,password}=req.body;
    try{
        const user=await User.create({...userDets,role});
        const token=createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
        res.status(201).json({user:user._id});
    }
    catch (err){
        const errors=handleErrors(err);
        res.status(400).json({errors})
    }
}

const login=async (userCreds,role,res)=>{
    let {email,password}=userCreds;

    const user= await User.findOne({email});
    //Email validation
    if (!user){
        return res.status(404).json({
            message:"Email is not valid. Invalid login Credentials",
            success:false
        });
    }
    //Role Validation
    if (user.role!=role){
        return res.status(403).json({
            message:"Please ensure you are logging in from the correct portal",
            success:false
        });
    }
    //That means user is trying to log in from the correct portal and providing coreect email also
    //Now check for the password
    let isMatch= await bcrypt.compare(password,user.password);
    if (isMatch){
        //Sign in the token and issue it to the user
        let token=jwt.sign({
            user_id:user._id,
            role:user.role,
            email:user.email
        },'dassmik',{expiresIn:"7 days"});
        let result={
            email:user.email,
            role:user.role,
            token:`Bearer ${token}`,
            expiresIn:168
        }
        return res.status(200).json({
            ...result,
            message:"You are now logged In",
            success:true
        })
    }
    else{
        return res.status(403).json({
            message:"Incorrect Password",
            success:false
        });
    }

}
//Passport middleware function
const userAuth=passport.authenticate('jwt',{session:false})

//Check role middleware
const checkRole=roles=>(req,res,next)=>{
    if (roles.includes(req.user.role)){
        return next();
    }
    return res.status(401).json({
        message:"Unauthorized",
        success:false
    })
}

const verifyUser=async(userCreds,role,res)=>{
    if (role==='admin'){
        let {email}=userCreds;

    const user= await User.findOne({email});
    if (user){
        if (user.isVerified===false){
            user.isVerified = true;
            res.status(200).json({
                message:"supplier is now verified",
                success:true
            })
        }
    }
    else{
        res.status(403).json({
            message:"Invaid Credentials",
            success:false
        })
    }
    }
    else{
        res.status(404).json({
            message:"This route is only valid for admins",
            success:false
        })
    }
    
}

const serializeUser=user=>{
    return {
        email:user.email,
        _id:user._id
    }
}

const addProduct=async (userCreds,res)=>{
    try{
        let {email,product}=userCreds;
        await User.findOneAndUpdate({
            email:email
        },{
            $addToSet:{
                products:product
            }
        })
        res.status(200).json({
            message:"Product Addition Successful",
            success:true
        })
    }
    catch(err){
        console.log(err);
        res.status(400).json({ 
            message:"Product Addition Failed",
            success:false
        })
    }
}
const getAllProducts=async (userCreds,res)=>{
    try{
        let {email}=userCreds
        const user= await User.findOne({email});
        if (user){
            const data=user.products;
            // // console.log('Products: ',user.products);
            // // return user.products;
            res.status(200).json({msg:"Products: ",data:data})
            console.log("Products: ",user.products)
        }
        res.status(200).json({
            message:"All Products fetched",
            success:true
        })
    }
    catch(err){
        console.log(err);
        res.status(400).json({ 
            message:"Can't get the products",
            success:false
        })
    }
}
const deleteProduct=async (userCreds,res)=>{
    try{
        let {email,product}=userCreds;
        await User.findOneAndUpdate({
            email:email
        },{
            $pull:{
                products:product
            }
        })
        res.status(200).json({
            message:"Successfully deleted the product",
            success:true
        })
    }
    catch(err){
        console.log(err);
        res.status(400).json({ 
            message:"Cannot Delete The Product",
            success:false
        })
    }
}

module.exports={
    addProduct,
    checkRole,
    signup,
    login,
    userAuth,
    serializeUser,
    verifyUser,
    getAllProducts,
    deleteProduct
}