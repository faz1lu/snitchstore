var mongoose=require('mongoose')
const {isEmail} = require('validator')
const userregisterschema=new mongoose.Schema({
name :{
    type: String,
    required: true,
    },
email:{
    type : String,
    required:true,
    validate:isEmail

},
phonenumber:{
    type:Number,
    required:true
    
   },
  password: {
  type:String,
  required:true
},
block:{
    type:Boolean,
    default:false  
},
total_buy:{
    type:String
}


},{timestamps:true})

const User = mongoose.model('data',userregisterschema)

 module.exports = User