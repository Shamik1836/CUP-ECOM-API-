const express = require('express');
const router=express.Router();
const {body} = require('express-validator');
const productController=require('../../../controllers/api/v1/product-controller')
router.post('/create',[
    body("name").not().isEmpty().withMessage("Name field cannot be empty"),
    body("quantity").isFloat({gt:0}).withMessage('Quantity cannot be less than 0'),
    body("price").isFloat({gt:0}).withMessage('Price cannot be lesser than 0'),
    body("description").isEmpty().withMessage("Description of a product cannot be empty")
],productController.createProduct);
router.get('/getAll',productController.getProduct);
router.patch('/update:id',productController.updateProduct);
router.delete('/delete:id',productController.deleteProduct);
module.exports=router;