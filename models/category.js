const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({

    name : {
        type : String,
        
    },
    
    description : {
        type : String,
        
       
    },
    ID:{
        type:Number

    }

})


const category = mongoose.model('category',categorySchema);
module.exports = category