const express=require('express')
const Product=require('../models/product')
const router=new express.Router()
const multer=require('multer')
const Restaurant = require('../models/restaurant')


router.post('/products/:RestaurantName', async(req,res) => {
    const name=req.params.RestaurantName
    const product=new Product({
        ...req.body,
        restaurant_name:name
    })
    try{
        const restaurant=await Restaurant.find({restaurant_name: name})
        if(restaurant.length===0){
            return res.status(400).send("Restaurant not Found")
        }
        await product.save() 
        res.status(201).send(product)
    }
    catch(e){
        res.status(400).send(e)
    }
})


router.get('/products/:RestaurantName',async (req,res)=>{
    const name=req.params.RestaurantName
    try{
      const product=await Product.find({restaurant_name: name})
      if(product.length===0){
        return res.status(400).send("Restaurant not Found")
      }
        res.send(product)
     }
    catch(e){
        res.status(500).send(e)
    }
})


router.delete('/product/:RestaurantName&:ProductName', async (req,res)=>{
//Same can be done by following url:
//router.delete('/product/:RestaurantName/:ProductName', async (req,res)=>{

    const RestName=req.params.RestaurantName
    const ProductName=req.params.ProductName
    try{
       const product=await Product.findOneAndDelete({product_name:ProductName, restaurant_name:RestName})
        if(!product){
            return res.status(400).send()
        }
        res.send(product)
    }catch(e){
        res.status(500).send(e)
    }
})


router.patch('/product/:RestaurantName/:ProductName', async (req,res)=>{
    const RestName=req.params.RestaurantName
    const ProductName=req.params.ProductName
    const updates=Object.keys(req.body)
    const allowedUpdates=['product_name','product_category','product_price']
    const isValidOption=updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOption){
        return res.status(400).send({error:'Invalid Update'})
    }
    try{
        const product=await Product.findOne({product_name:ProductName, restaurant_name:RestName})
        if(!product){
            return res.status(404).send()
        }
        updates.forEach((update)=>product[update]=req.body[update])
        await product.save()
        res.send(product)
    }catch(e){
        res.status(404).send(e)
    }
})


const upload=multer({
    dest: 'images/Prodcut_Images',
      limits:{
          fileSize:1000000
      },
      fileFilter(req,file,cb){
          if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
              return cb(new Error('please upload image only'))
          }
          cb(undefined,true)
      }
  })
  router.post('/product/avatar/:RestaurantName/:ProductName',  upload.single('avatar'), async (req , res)=>{
      const RestName=req.params.RestaurantName
      const ProdName=req.params.ProductName
      const product=await Product.find({restaurant_name:RestName, product_name:ProdName})
      if(product.length===0){
          return res.status(400).send("Product Not Found")
  }
  
  
      res.send('Image Uploaded Successfully')
   
  }, (error, req, res, next)=>{
      res.status(400).send({error:error.message})
  
  
  })
  
  //to get image...not working (this feature is not mentioned in task.)

  router.get('/product/avatar/:RestaurantName/:ProductName', async (req,res)=>{
    const RestName=req.params.RestaurantName
    const ProdName=req.params.ProductName

       try{
          const product=await Product.findOne({restaurant_name:RestName, product_name:ProdName})
  
          if(!product || !product.avatar){
              throw new Error("Image not found")
          }
          res.set('Content-Type', 'image/png')
          res.send(restaurant.avatar)
      }catch(e){
          console.log(e);
          res.status(404).send('' + e)
      }
  })
  
  
  // to delete image....Not working (This feature is not mentioned in task)

  router.delete('/product/avatar/:RestaurantName/:ProductName', async (req,res)=>{
    const RestName=req.params.RestaurantName
    const ProdName=req.params.ProductName      
    const product=await Restaurant.findOne({restaurant_name:RestName, product_name:ProdName})
  
      req.product.avatar=undefined
      await req.product.save()
      res.send()
      
  })
  
  
  module.exports=router