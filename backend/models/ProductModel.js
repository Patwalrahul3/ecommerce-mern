const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Plese Enter product Name'],
        trim: true
    },
    description :{
        type: String,
        required: [true, 'Plese Enter product Description']
    },
    price:{
        type: Number,
        required: [true, 'Plese Enter product price'],
        maxLength: [8, 'Price cannot exceed 8 characters']
    },
    rating:{
        type: Number,
        default: 0
    },
    images : [
        {
            public_id : {
                type: String,
                required : true
            },
            url :{
                type: String,
                required : true
            },
        }
       
    ],

    category: {
     type: String,
     require: [true, 'Please Enter Product Category'],

    },
    Stock : {
        type: Number,
        required : [true, 'please enter product stock'],
        maxLength:[4, 'stock cannot exceed 4 characters'],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true
            },
           rating:  {
            type: Number,
            required: true 
            },
            Comment: {
                type: String,
                 required: true
            }
        }
    ],

    createdAt:{
      type: Date,
      default: Date.now
    }

})

const Product = mongoose.model("Product", productSchema)

module.exports = Product