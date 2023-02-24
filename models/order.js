const mongoose=require('mongoose')
const orderschema=new mongoose.Schema({
    date:{
        type:Date
    },
    userId:{
    type:String,
    ref:'data'
   },
   products:[{
    product:{
        type:String,
        ref:'products'
    },
    quantity:{
        type:Number
    },
    totalprice:{
        type:Number
    }
   }],
   subtotal:{
    type:Number
   },
   address:{
    type:String,
    ref:'address'
    
   },
   paymentmethod:{
    type:String
   },
   orderstatus:{
    type:String
   },
   },{timestamps:true});

const order = mongoose.model('order',orderschema)
module.exports = order;