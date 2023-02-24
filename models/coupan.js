const mongoose = require('mongoose')

const coupanSchema = new mongoose.Schema({
    code : {
        type : String,
        require:true,
        
    },
    available:{
        type : Number
    },
    redeemamount :{
        type:Number,
        require:true
    },
     startdate:{
         type:Date
        
     },
    validupto:{
        type:Date
    },
    status:{
        type:String,
        default:"active"
    },
    usageLimit:{
        type:Number
    },
    mincartAmount:{
        type: Number
    },
    // percentage:{
    //     type:Boolean
    // },
    maxdiscountAmount:{
        type:Number
    },
    userUsed:[{
        userId:{
            type:String,
            ref:'data'
        }
    }]
},{timestamps:true})

const coupan = mongoose.model('coupon',coupanSchema)
module.exports = coupan;