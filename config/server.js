
const mongoose=require('mongoose');
mongoose.set('strictQuery', false);
module.exports.dbConnection=function (cb){
    mongoose.connect('mongodb://127.0.0.1:27017/project', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=>{
        cb(true)
    }).catch((err)=>{
        console.log(err);
        cb(false)
    })
    
}


// const userschema=new mongoose.Schema({
//     name:String,
//     phonenumber:Number,
//     email:email,
//     password:password,
//     conformpassword:password

// })
//  module.exports = mongoose.model('shopping',userschema)