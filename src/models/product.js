const mongoose=require('mongoose')
const validator=require('validator')
const express=require('express')
const Restaurant=require('./restaurant')


const productSchema = new mongoose.Schema({
    //to save image in buffer from 
    avatar:{
        type:Buffer
    },
    product_name:{
        type:String,
        required:true,
        trim:true,
    },
    product_price:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Cost for the Product cannot be negative')
            }
        }
    },
    product_category:{
        type:String,
        default:'Null'

    },
    restaurant_name:{
        type:String,
        required:true,
        ref:'Restaurant'
    },
},
{
    timestamps:true
})


const Product=mongoose.model('Product', productSchema)


module.exports= Product