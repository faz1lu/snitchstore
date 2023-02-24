var mongoose=require('mongoose');
const productschema=new mongoose.Schema({
    name : {
        type:String,
        
    },
    brand : {
        type:String
    },
    price : {
        type:Number
    },
    stock :{
        type:Number
    },
    category :{
        type:String,
        
    },
    image : {
        type:Array,
        
    },
    description :{
        type:String,
        max:100,
    },
    discount:{
        type:String,
    },
    size:{
        type:Array,
    },
    selectcolor:{
        type:String,
    },
    quantity:{
        type:String,

    },
    purchased:{
        type:String,
    }
    },)

const products=mongoose.model("products",productschema)
module.exports=products