const { Router } = require('express')
const express=require('express')
const { productPhotos}  = require('../config/multer')
const router = express(Router)
const {varifyAdmin}=require('../middleware/adminset')




const {admindashboard,
       adminlogin,
    productlist,
    yearlyreport, monthlyreport,
    adminloginpost,
    userlistadmin,
     productsubmit,
     userblock,
     addcategory,bannerdelete,
     categorypost,
     categorydisplay,
     categorysetting,bannerlist,
     categorydelete,productdelete,productedit,orderhistorystatus,bannerss,bannerpost,monthlychart,
     editing,coupanpost,getcoupan,coupandelete,orderhistory,orderhistoryview,dailyreport,banneredit,
     pieChart,bannereditpost
     }=require('../controllers/admincontroller')
 const category = require('../models/category')

 router.get('/',adminlogin)
 router.get('/admindashboard',varifyAdmin,admindashboard)
 router.get('/productlist',productlist)
 router.post('/adminloginpost',adminloginpost)
 router.get('/userlistadmin',varifyAdmin,userlistadmin)
 router.post('/productsubmit',productPhotos,productsubmit)
 router.get('/block/:id',userblock)
 router.post('/categorypost',categorypost)
 router.get('/category',varifyAdmin,addcategory)
 router.get('/productadd',varifyAdmin,categorysetting)
 router.get('/categorydelete/:id',varifyAdmin,categorydelete)
 router.get('/delete/:id',productdelete)
 router.get('/edit/:id',varifyAdmin,productedit)
 router.post('/editing/:id',productPhotos,editing)
 router.post('/coupanaddpost',coupanpost)
 router.get('/coupanadd',varifyAdmin,getcoupan)
 router.post('/coupandelete',coupandelete)
 router.get('/orderhistory',varifyAdmin,orderhistory)
 router.post('/orderhistory',orderhistorystatus)
 router.get('/orderhistoryview/:id',orderhistoryview)
 router.get('/banner',bannerss)
 router.post('/bannereditpost/:id',productPhotos,bannereditpost)
 router.get('/daily',varifyAdmin,dailyreport)
 router.get('/month',varifyAdmin, monthlyreport)
 router.get('/year',varifyAdmin,yearlyreport)
 router.post('/bannerpost',productPhotos,bannerpost)
 router.get('/bannerlist',varifyAdmin,bannerlist)
 router.post('/bannerdelete',bannerdelete)
 router.get('/banneredit/:id',banneredit)
 router.post('/monthlyChart',monthlychart)
 router.post('/pieChart',pieChart)
 module.exports=router
