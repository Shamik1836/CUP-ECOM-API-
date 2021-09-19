
const productModel=require('../../../model/Product')
const {validationResult}=require('express-validator')
module.exports.createProduct=async(req,res)=>{
    try{
        const errors=validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        const data=await productModel.create(req.body);
        res.status(200).json({msg:"Product Creation Successful",data:data})
    }
    catch(error){
        console.log("Error in creating the product",res);
        res.status(500).json({msg:"Internal Server Error"})
    }
}

module.exports.getProduct=async(req,res)=>{
    try{
        const data=await productModel.find({})//we are specifying empty paranthesis as we want to get the list of all the products if we want to get a particular product then we can specify findById field
        res.status(200).json({msg:"Products: ",data:data})
    }
    catch(error){
        console.log("Error in getting products",res);
        res.status(500).json({msg:"Internal Server Error"})
    }
}

module.exports.updateProduct=async(req,res)=>{
    try{
        const product= await productModel.findById(req.params.id);
        product.quantity=req.body.quantity;
        const a1=await product.save();
        res.json(a1);
    }
    catch(error){
        console.log("Error in Updating",res);
        res.status(500).json({msg:"Internal Server Error"})
    }
}
module.exports.deleteProduct=async(req,res)=>{
    try{
        const product = await productModel.findByIdAndDelete(req.params.id);
        res.json(product);
    }
    catch(error){
        console.log("Error in Deleting",res);
        res.status(500).json({msg:"Internal Server Error"})
    }
}