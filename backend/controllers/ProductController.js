const Product = require('../models/ProductModel')

/**
 * 
 * create Product  - >>>>>>  Admin
 * 
 */

exports.createProduct = async(req, res) =>{

    const product = await Product.create(req.body);

    res.status(201).json({
        success : true,
        product
    })
}

/**
 * 
 * Get all products  Product
 * 
 */

exports.getAllProducts = async(req, res) => {
    const products = await  Product.find();

    res.status(200).json({
       success: true,
       products
    })
}

/**
 * 
 * update  Product - admin
 * 
 */

exports.updateProduct = async(req, res) => {
  
    let product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
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
}


/**
 * 
 * delete  Product 
 * 
 */

exports.deleteProduct = async(req, res) => {

   const product =  await Product.findByIdAndDelete(req.params.id);

   if(!product){
    return res.status(500).json({
        success: false,
        message: "Product not found"
    })
   }


    res.status(200).json({
        success: true,
        message: 'Product deleted sucessfully'
     })


  
}