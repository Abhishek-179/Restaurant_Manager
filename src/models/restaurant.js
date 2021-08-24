const mongoose=require('mongoose')
const validator=require('validator')
const express=require('express')
const sharp=require('sharp')


const restaurantSchema = new mongoose.Schema(
    {
    restaurant_name:{
        unique:true,
        type:String,
        required:true,
        trim:true,
    },
    restaurant_address:{
        type:String,
        required:true,
        trim:true,
    },
    //to save image in buffer form
    avatar:{
        type:Buffer
    },
    Opening_Hours:{
        weekday:{
            type:String,
            required:true,
            trim:true
         },
         weekend:{
            type:String,
            required:true,
            trim:true
         }
    }
    
},
{
    timestamps:true
})


restaurantSchema.virtual('Product',{
    ref:'Product',
    localField:'restaurant_name',
    foreignField:'restaurant_name'
})

const Restaurant=mongoose.model('Restaurant', restaurantSchema)
module.exports= Restaurant