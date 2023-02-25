const { render } = require("../router/user")
const User = require('../models/user')
const products = require('../models/productlist')
const category = require('../models/category')
const { name } = require("ejs")
const coupan = require('../models/coupan')
const order = require('../models/order')
const address = require('../models/address')
const banner = require('../models/banner')
const moment = require('moment');


const adminlogin = (req, res) => {
    res.render('admin/adminlogin');
}

let adminemail = "muhammmadfazil@gmail.com"
let adminpassword = 1234
const adminloginpost =async (req, res) => {

    if (req.body.email == adminemail && req.body.password == adminpassword) {
        req.session.admin=true
       
        res.render('admin/admindashboard')    
    } else {
        res.redirect('/admin')
    }
}


const admindashboard = async(req, res) =>{

   

     res.render('admin/admindashboard')
}




const productsubmit = async (req, res) => {
    // console.log(req.body);
    let { name, brand, price, stock, category, description, discount, size, selectcolor, quantity, purchased } = req.body
    let photo = req.files

    console.log(category + 1111111111111111111111);
    // Object.assign(details, { image: photo })
    let pic = [];
    for (let i = 0; i < photo.length; i++) {
        pic[i] = photo[i].path.substring(6);
    }
    console.log(pic);
    const productadding = await products.create({
        name: name,
        brand: brand,
        price: price,
        stock: stock,
        category: category,
        image: pic,
        description: description,
        discount: `${discount} %OFF`,
        size: size,
        selectcolor: selectcolor,
        quantity: quantity,
        purchased: purchased



    })
    res.redirect('/admin/productadd');

}
const productlist = async (req, res) => {

    const findproducts = await products.find({})
    console.log(findproducts);
    console.log('product list suiiiiiiiiiiiiiiiiiii');

    res.render('admin/productlist', { findproducts })

}



const productedit = async (req, res) => {

    try {
        let id = req.params.id
        const findedit = await products.findById({ _id: id })
        console.log(findedit);
        console.log("cheking hello chekking1111111111111111111111111111111111");
        const cats = await category.find({})
        res.render('admin/productedit', { findedit, cats })


    } catch (error) {
        console.log(error);
    }
}

const editing = async (req, res) => {
    try {
        const id = req.params.id;

        const images = req.files.image;
        const pro = {
            name: req.body.name,
            brand: req.body.brand,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category,
            description: req.body.description,
            discount: req.body.discount,
            size: req.body.size,
            selectcolor: req.body.selectcolor,
            quantity: req.body.quantity,
            purchased: req.body.purchased
        };

        if (images) {
            img = [];
            images.forEach((el, i, arr) => {
                img.push(arr[i].path.substring(6));
            });

            const productz = await products.updateOne(
                { _id: id },
                {
                    $set: {
                        name: pro.name,
                        brand: pro.brand,
                        price: pro.price,
                        stock: pro.stock,
                        category: pro.category,
                        image: img,
                        description: pro.description,
                        discount: pro.discount,
                        size: pro.size,
                        selectcolor: pro.selectcolor,
                        quantity: pro.quantity,
                        purchased: pro.purchased
                    }
                }
            );
        } else {
            const productz = await products.updateOne(
                { _id: id },
                {
                    $set: {
                        name: pro.name,
                        brand: pro.brand,
                        price: pro.price,
                        stock: pro.stock,
                        category: pro.category,
                        description: pro.description,
                        discount: pro.discount,
                        size: pro.size,
                        selectcolor: pro.selectcolor,
                        quantity: pro.quantity
                    }
                }
            );
        }
        res.redirect("/admin/productlist");
    }


    catch (error) {
        console.log(error);
    }
}








const userlistadmin = async (req, res) => {
    const finduser = await User.find({})
    console.log(finduser);
    res.render('admin/userlistadmin', { finduser })

}


const userblock = async (req, res) => {

    const { id } = req.params;
    const userstatus = await User.findOne({ _id: id });

    console.log(id, "idtofinduser");
    console.log(userstatus.name);
    if (userstatus.block) {
        console.log(' block');
        const blocking = await User.updateOne({ _id: id }, { $set: { block: false } })

    } else {
        const blocking = await User.updateOne({ _id: id }, { $set: { block: true } })
    }
    res.redirect('/admin/userlistadmin')
}

const addcategory = async (req, res) => {
    const categorylisting = await category.find({})
    console.log(categorylisting);

    res.render('admin/category', { categorylisting })

}
const categorypost = async (req, res) => {
    console.log(req.body);
    const categories = await category.create({
        ID: req.body.ID,
        name: req.body.name,
        description: req.body.description


    },(error)=>{
        if(error){
            res.json({Response:"wrong"})
        }else{
            res.json({Response:true})
        }
    })
   

}
const categorydisplay = async (req, res) => {

    const categorylisting = await category.find({})
    console.log(categorylisting);

    res.render('admin/category', { categorylisting })

}
const categorysetting = async (req, res) => {
    const cat = await category.find({})

    res.render('admin/productadd', { cat })
}


const categorydelete = async (req, res) => {
    id = req.params.id
    const del = await category.findByIdAndDelete(id)
    res.redirect('/admin/category')
}

const productdelete = async (req, res) => {
    try {

        id = req.params.id
        const deleteproduct = await products.findByIdAndDelete(id)
        res.redirect('/admin/productlist')
    }
    catch (error) {

        console.log(error);
    }
}

// const getcoupan=(req,res)=>{
//     res.render('admin/coupanadd')
// }

const coupanpost = async (req, res) => {
    try {
        const coupanvalue = await coupan.create({
            
            code: req.body.coupanname,
            redeemamount: req.body.redeem,
            available: req.body.available,
            mincartAmount: req.body.mincartAmount,
            startdate: req.body.startdate,
            validupto: req.body.enddate,

        })
        console.log(coupanvalue);
        res.redirect('/admin/coupanadd')

    } catch (error) {
        console.log(error);
    }

}

const getcoupan = async (req, res) => {

    const coupandetail = await coupan.find({})
    const coupanDetails = coupandetail.reduce((acc, curr) => {
        const details = {
            id:curr._id,
            code: curr.code,
            available: curr.available,
            redeemamount: curr.redeemamount,
            startdate: moment(curr.startdate).format("DD MM YYYY"),
            validupto: moment(curr.validupto).format("DD MM YYYY"),
            status: curr.status,
            usageLimit: curr.usageLimit,
            mincartAmount: curr.mincartAmount,
            maxdiscountAmount: curr.maxdiscountAmount,
            userUsed: curr.userUsed
        }
        acc.push(details);
        return acc
    }, [])
    //  console.log(coupanDetails,'coupon details')
    res.render('admin/coupanadd', { coupanDetails })
    // console.log(coupandetail);
}
const coupandelete = async (req, res) => {
    try {

        const id = req.query.id
        console.log(id);
        const coupa = await coupan.findOneAndDelete({ _id: id })
        // res.redirect('/admin/coupanadd')
        
        res.json({status:true})
    } catch (error) {
        console.log(error);
    }
    
}
const orderhistory = async (req, res) => {




    const orders = await order.find({}).populate('userId').sort({ createdAt: -1 })
    console.log('startttttttttttttttttttttttt', orders, 'enddddddddddddddddddddd');


    res.render('admin/orderhistory', { orders })
}
const orderhistorystatus = async (req, res) => {
    const deliverystatus = req.query.values
    const id = req.query.id
    await order.findOneAndUpdate({ _id: id }, { orderstatus: deliverystatus })


}

const orderhistoryview = async (req, res) => {
    try {

        const viewid = req.params.id
        const showorder = await order.findOne({ _id: viewid }).populate('userId').populate("products.product")
        console.log('starttttt', showorder, 'endddddddddd');
        const addres = showorder.address
        console.log(addres, "addreesssssssssssssssssss");

        const addr = await address.findOne({ user: showorder.userId })
        console.log(addr, 111)
        const index = await addr.address.findIndex((obj) =>
            obj._id.toString() == addres
        )
        const deliveryAddress = addr.address[index];
        console.log(index, 'addressssssssssssssssssssssssssssssssss');
        res.render('admin/orderhistoryview', { showorder, deliveryAddress })
        console.log('dssssssadadadaa', deliveryAddress, 'vdddddddddddddvvvvvvvvvvv');
    } catch (error) {
        console.log(error);
    }
}
const bannerss = (req, res) => {

    res.render('admin/banner')
}
const bannerpost = async (req, res) => {

    try {
        console.log(req.files);
        console.log(req.body);
        const image = req.files
        if (image == null) {
            res.redirect("/admin/bannerpost")
        }
        else {
            console.log(1212121212);
            let img = image[0].path.substring(6);
            console.log(img);
            Object.assign(req.body, { image: img });
            console.log(req.body);
            const bannering = await banner.create(
                req.body
            )
            res.redirect("/admin/banner")
        }
        
    } catch (err) {
        console.log(err);
    }



};

const bannerlist = async (req, res) => {
    const bannerlisting = await banner.find({})

// console.log('start',bannerlisting,'end');
    res.render('admin/listbanner', { bannerlisting })
}
const bannerdelete=async(req,res)=>{
    console.log(1111111);
    const bannerid=req.query.banner
    
    console.log(bannerid,'nashippikkk');
    await banner.findOneAndDelete({_id:bannerid})

    res.json({status:true})
}
const banneredit=async(req,res)=>{
    const edit=req.params.id
    console.log(edit);
    const editfind=await banner.findOne({_id:edit})
    console.log(editfind,'ithannnneee');

    res.render('admin/editbanner',{editfind})

}
const bannereditpost=async(req,res)=>{
   
    const id=req.params.id
    console.log(id,'hhhh');
    try {
       

        const images = req.files.image;
        const pro = {
            name: req.body.title,
            description: req.body.description,
            url: req.body.url,
            
        };
        console.log(pro,'muuuuuu');

        if (images) {
            img = [];
            images.forEach((el, i, arr) => {
                img.push(arr[i].path.substring(6));
            });

            const productz = await banner.updateOne(
                { _id: id },
                {
                    $set: {
                        title: pro.name,
                        description: pro.description,
                        url: pro.url,
                       
                    }
                }
            );
        } else {
            const productz = await banner.updateOne(
                { _id: id },
                {
                    $set: {
                        title: pro.name,
                        description: pro.description,
                        url: pro.url,
                    }
                }
            );
        }
        res.redirect("/admin/bannerlist");
    }


    catch (error) {
        console.log(error);
    }

}



const dailyreport = async (req, res) => {

    try {
        const dailyreports = await order.aggregate([
            {
                $match: {
                    orderstatus: { $eq: "delivered" },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                    },
                    totalprice: { $sum: "$subtotal" },
                    products: { $sum: { $size: "$products" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { createdAt: -1 } },
        ]);
        console.log(dailyreports[0].totalprice);
        console.log(dailyreports, 'llllllll');
        res.render("admin/dailyreport", { dailyreports });
    } catch (err) {
        console.log(err);
    }
};


const monthlyreport = async (req, res) => {


    try {
        const monthlyreports = await order.aggregate([
            {
                $match: { orderstatus: { $eq: "delivered" } },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    totalprice: { $sum: "$subtotal" },
                    products: { $sum: { $size: "$products" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { createdAt: -1 } },
        ]);
        console.log(monthlyreports, 'kkkkkkkkkkk');
        function getMonthName(monthNumber) {
            const date = new Date();
            date.setMonth(monthNumber - 1);

            return date.toLocaleString("en-US", { month: "long" });
        }
        let month = [];
        for (let i = 0; i < monthlyreports.length; i++) {
            month.push(getMonthName(monthlyreports[i]._id.month));
        }

        res.render("admin/monthlyreport", { monthlyreports, month });
        console.log('starttttt', month, monthlyreports, 'enddddddd');
    } catch (err) {
        console.log(err);
    }

};
const yearlyreport = async (req, res) => {
    try {
        const yearreport = await order.aggregate([
            {
                $match: { orderstatus: { $eq: "delivered" } },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                    },
                    totalprice: { $sum: "$subtotal" },
                    products: { $sum: { $size: "$products" } },
                    count: { $sum: 1 },
                },
            },
        ]);
        console.log(yearreport);
        res.render("admin/yearlyreport", { yearreport });
    } catch (err) {
        console.log(err);
    }

}

// const paypalpost=
const monthlychart=async(req,res)=>{
  
        try {
          const monthlyReports = await order.aggregate([
            {
              $match: { orderstatus: { $eq: "Confirmed" } },
            },
            {
              $group: {
                _id: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" },
                },
                totalprice: { $sum: "$subtotal" },
                products: { $sum: { $size: "$products" } },
                count: { $sum: 1 },
              },
            },
            { $sort: { "_id.month": -1 } },
          ]);
        
          let ordersTotal = [];
          let salesprofit = [];
          let orderCount = [];
          for (let i = 0; i < monthlyReports.length; i++) {
            console.log(monthlyReports[i]);
            ordersTotal.unshift(monthlyReports[i].totalprice);
            orderCount.unshift(monthlyReports[i].count);
            salesprofit.unshift(monthlyReports[i].totalprice * (15 / 100));
          }
          res.json({ status: true, ordersTotal, salesprofit, orderCount });
        
          console.log(ordersTotal, salesprofit, orderCount);
        } catch (error) {
          console.log(error);
          error.admin=true
          next(error)
        }
       
    
}

const pieChart=async(req,res)=>{
    try {
        const orderDelivered = await order
        .find({ orderstatus: "delivered" })
        .count();
      const orderCancelled = await order
        .find({ orderstatus: "cancelled" })
        .count();
        const orderConfirm= await order
        .find({ orderstatus: "Confirmed" })
        .count();
      const orderReturned = await order.find({ orderstatus: "pending" }).count();
    
      console.log(orderCancelled,111111111111111);
      console.log(orderDelivered);
      let data = [];
      data.push(orderDelivered);
      data.push(orderCancelled);
      data.push(orderReturned);
      data.push(orderConfirm);
      console.log(data);
      res.json({ data });
      } catch (error) {
        console.log(error);
       
      }
}
const dailyChart = async (req, res,next) => {

    try {
      const order = await order.find({});
    let today = new Date();
    let startDate = new Date(today.setUTCHours(0, 0, 0, 0));
    let endDate = new Date(today.setUTCHours(23, 59, 59, 999));
  
   const todaySales = await order.aggregate([
      {
        $match: {
          orderstatus: { $eq: "delivered" },
          createdAt: { $lt: endDate, $gt: startDate },
        },
      },
      {
        $group: {
          _id: "",
  
          total: { $sum: "$subtotal" },
          count:{$sum:1}
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);
    const totalAmount=todaySales[0].total
    const totalOrder=todaySales[0].count
    console.log( totalAmount,1111111);
      res.json({status:true,totalAmount,totalOrder})
    } catch (error) {
      console.log(error);
      error.admin=true
      next(error)
    }
    
    
  };
module.exports = {
    adminlogin,
    admindashboard,
    productlist,
    productedit,
    adminloginpost,
    userlistadmin,
    productsubmit,
    userblock, addcategory, categorypost,
    categorydisplay,
    categorysetting,
    categorydelete,bannerdelete,
    productlist, productdelete, productedit, editing, getcoupan, coupanpost,
    coupandelete, orderhistory, orderhistoryview, orderhistorystatus, bannerss, dailyreport,
    monthlyreport, yearlyreport, bannerpost, bannerlist,banneredit,monthlychart,pieChart,bannereditpost

}
