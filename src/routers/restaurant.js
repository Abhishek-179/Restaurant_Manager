const express=require('express')
const Restaurant=require('../models/restaurant')
const router=new express.Router()
const multer=require('multer')
const sharp=require('sharp')

const upload=multer({
    // dest: 'images/Restaurant_Images',
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

router.post('/restaurants', async (req,res)=>{
    const restaurant=new Restaurant(req.body)
    try{
        await restaurant.save()
        res.status(201).send({restaurant})
    }catch (e){
        res.status(400).send(e+ "sorry")
    }
})


router.get('/restaurants',async (req,res)=>{
   // res.send(req.restaurants)
    try{
        const restaurants=await Restaurant.find({})
        res.status(210).send(restaurants)
    }
    catch(e){
            res.status(500).send()
    }
})


router.patch('/restaurant/:RestaurantName', async (req,res)=>{
    const RestName=req.params.RestaurantName
    const updates=Object.keys(req.body)
    const allowedUpdates=['restaurant_name','restaurant_address']
    const isValidOption=updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOption){
        return res.status(400).send({error:'Invalid Update'})
    }
    try{
        const restaurant=await Restaurant.findOne({restaurant_name:RestName})
        if(!restaurant){
            return res.status(404).send()
        }
        updates.forEach((update)=> restaurant[update]=req.body[update])
        await restaurant.save()
        res.send(restaurant)
    }catch(e){
        res.status(404).send(e)
    }
})


//Here I have Created seperate API to upload image

router.post('/restaurant/avatar/:name',  upload.single('avatar'), async (req , res)=>{
    const RestName=req.params.name
    const restaurant=await Restaurant.find({restaurant_name:RestName})
    if(restaurant.length===0){
        return res.status(400).send("Restaurant Not Found")
}


    res.send('Image Uploaded Successfully')

//Currently I am saving Image in folder...
//following code can be use to save the image in buffer form In mongodb...But it giving me the error.
//able to fetch buffer data from postman but error is in storing.


  /* const buffer=await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()

    const RestName=req.params.name
    console.log(RestName);

       const restaurant=await Restaurant.find({restaurant_name:RestName})
       console.log(restaurant);
        console.log(buffer);
       if(restaurant.length===0){
            return res.status(400).send("Restaurant Not Found")
}
       res.restaurant.avatar=buffer
        console.log('after req');
        await res.restaurant.save()
        //await restaurant.add({avatar:buffer})
        res.send()


*/
}, (error, req, res, next)=>{
    res.status(400).send({error:error.message})


})


//to get image...not working (this feature is not mentioned in task.)
router.get('/restaurant/avatar/:name', async (req,res)=>{
    const RestName=req.params.name

     try{
        const restaurant=await Restaurant.findOne({restaurant_name:RestName})

        if(!restaurant || !restaurant.avatar){
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
router.delete('/restaurant/avatar/:name', async (req,res)=>{
    const RestName=req.params.name
    const restaurant=await Restaurant.findOne({restaurant_name:RestName})

    req.restaurant.avatar=undefined
    await req.restaurant.save()
    res.send()
})


module.exports=router


