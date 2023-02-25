const { Router } = require('express')
const express=require('express')
const { userprofile } = require('../controllers/admincontroller')
const router=express(Router)
const {usercheck}=require('../middleware/userset')
const coupan = require('../models/coupan')
const{
    userhome,
    userlogin,
    userregister,
    registersubmit,cancelorderinprofile,
    loginsubmit,shop,giveaddres,accounteditprofile,paypalpost,
    profile,addcart,shopproduct,productlistpost, displayincart,logout, addWishlist,
    deleteitems,changequantity,createorder,addaddress, successpage,addresspost, placeorder, errorpage,
    orderlist,orderhistory,wish,otp,coupans,invoice,viewhistory,deleteaddresscheckout,addresseditprofile,
    postOTP,forgotpassword,forgotpasswordpost,forgotOtpVerify,changePassword,
    }=require('../controllers/usercontroller')

   

    router.get('/',userhome)
    router.get('/userlogin',userlogin)
    router.get('/userregister',userregister)
    router.post('/registersubmit',registersubmit)
    router.post('/loginsubmit',loginsubmit)
    router.get('/shop',shopproduct)
    router.get('/userprofile',usercheck,profile)
    router.post('/cart',addcart)
    router.get('/productlistpost/:id',productlistpost)
    router.get('/displaycart',usercheck,displayincart)
    router.get('/itemdelete/:id',deleteitems)
    router.delete('/deleteproduct',deleteitems)
    router.patch('/changequantity',changequantity)
    
    router.post('/addaddress',addaddress)
    router.get('/successpagesweet',orderlist)
    router.get('/logout',logout)
    router.post('/addresspost',addresspost)
    router.get('/checkout',giveaddres)
    router.get('/deleteaddresscheckout',deleteaddresscheckout)
    // router.get('/deleteaddress/:_id',deleteaddress)
    router.post("/placeorder",placeorder)
    router.get('/error',errorpage)
    router.get('/orderlist',orderlist)
    router.post('/create-order',createorder)
    router.get('/orderhistory',orderhistory)
    router.get('/wishlist',usercheck,wish)
    router.post('/addtowishlist', addWishlist)
    router.get('/otp',otp)
    router.post('/postotp',postOTP)
    router.post('/coupancheckout',coupans)
    router.get('/invoice',invoice)
    router.get('/viewhistory/:_id',viewhistory)
    router.post('/editaddress',addresseditprofile)
    router.post('/editaccount',accounteditprofile)
    router.post('/ordercancel',cancelorderinprofile)
    router.post('/paypalpost',paypalpost)
    router.get('/forgotpassword',forgotpassword)
    router.post('/forgotpassword',forgotpasswordpost)
    router.post('/forgotOtp',forgotOtpVerify)
    router.patch('/changepassword',changePassword)
    
    module.exports=router
