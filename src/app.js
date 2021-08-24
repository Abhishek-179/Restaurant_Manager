const express=require('express')
const path=require('path')

require('./db/mongoose')
const restaurantRouter =require ('./routers/restaurant')
const productRouter =require ('./routers/product')
 
const app=express()
//const port=process.env.PORT

app.use(express.json())
app.use(restaurantRouter)
app.use(productRouter)


module.exports=app