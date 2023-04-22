const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apifeatures');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('./../middleware/catchAsyncErrors')

/**
 * 
 * create Product  - >>>>>>  Admin
 * 
 */

exports.createProduct = catchAsyncErrors(async(req, res) =>{

    const product = await Product.create(req.body);

    res.status(201).json({
        success : true,
        product
    })
})

/**
 * 
 * Get all products  Product
 * ADDED FILTER , SEARCH
 */

exports.getAllProducts = catchAsyncErrors(async(req, res) => {
   
    const resultPerPage = 5;
    const productCount = await Product.countDocuments();

    const apiFeature =   new ApiFeatures(Product.find(), req.query)
    .search().filter().pagination(resultPerPage);

    const products = await  apiFeature.query;

    res.status(200).json({
       success: true,
       products,
       productCount
    })
})


/**
 * 
 * get  Product Details
 * 
 */
exports.getProductDetails = catchAsyncErrors(async(req, res , next) => {

    const product = await Product.findById(req.params.id);
    

    if(!product) {
        return next(new ErrorHandler('product not found', 404))
    }

    return res.status(200).json({
        success: true,
        product
    })

})


/**
 * 
 * update  Product - admin
 * 
 */

exports.updateProduct = catchAsyncErrors(async(req, res) => {
  
    let product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler('product not found', 404))
    }

     product = await  Product.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true,
        useFindAndModify: false

    })

    res.status(200).json({
       success: true,
       product
    })
})


/**
 * 
 * delete  Product 
 * 
 */

exports.deleteProduct = catchAsyncErrors(async(req, res) => {

   const product =  await Product.findByIdAndDelete(req.params.id);

   if(!product) {
    return next(new ErrorHandler('product not found', 404))
}


    res.status(200).json({
        success: true,
        message: 'Product deleted sucessfully'
     })


  
})