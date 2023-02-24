const userdb = require('../models/user')
const bcrypt = require('bcrypt');
const { db } = require('../models/user');
 const user = require('../models/user');
const products = require('../models/productlist')
require('dotenv').config()
const cart = require('../models/cartitems')
const mongoose = require('mongoose')
const address = require('../models/address')
const order=require('../models/order')
const coupan=require('../models/coupan')
const paypal=require('@paypal/checkout-server-sdk');
const wishlist=require('../models/wishlist');
const categorys=require('../models/category')
 const {sendotp,verifyotp}=require('../utilities/otp')
 let userData;
// const envirolment =
//   process.env.NODE_ENV === "production"
//     ? paypal.core.LiveEnvironment
//     : paypal.core.SandboxEnvironment;

// const paypalClient = new paypal.core.PayPalHttpClient(
//   new envirolment(process.env.clientid, process.env.secretid)
// );

const envirolment =
  process.env.NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment;

const paypalCliend = new paypal.core.PayPalHttpClient(
  new envirolment(process.env.PAYPAL_CLIND_ID, process.env.PAYPAL_CLIND_SECRET)
);

const userhome = async(req, res) =>{
  const callproductss = await products.find({})

  res.render('user/userhome', { callproductss })


} 

const userlogin = (req, res) => {
res.render('user/userlogin')
}

const userregister = (req, res) => {
    res.render('user/userregister')
  }


const loginsubmit = async (req, res) => {
  try {
    const email = req.query.email;
    const password = req.query.password;
    let response = null;
    let user = await userdb.findOne({ email: email });
    console.log(user);
    if (user) {
        let pass = bcrypt.compare(password, user.password);
        if (pass) {
            if (user.block) {
                response = "Your Account is temporarly blocked";
            } else {
                response = false;
                req.session.users = user;
            }
        } else {
            response = "Invalid Password";
            req.session.user_loginError = true;
        }
    } else {
        response = "Invalid username";
        req.session.user_loginError = true;
    }
    res.json({ response });
} catch (error) {
    console.log(error);
}
}


const createorder=async(req,res)=>{
  console.log('create orer is caling..................................................')
  const request = new paypal.orders.OrdersCreateRequest();
let balance = req.body.items[0].amount
console.log(balance);
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: balance
        },
      },
    ],
  });
  try {
    console.log(",,,,,,,");
    const order = await paypalCliend.execute(request);
    console.log(".........");
    console.log(order);
    console.log(order.result.id);
    res.json({ id: order.result.id });
  } catch (e) {
    console.log("....,.,mmm");
    console.log(e);
    res.status(500).json(e);
}

};

const otp =(req,res)=>{
  let phone = userData.phone;
  console.log(phone);
  res.render("user/otp", { phone, user_details: false ,message:false,otpErr:req.flash("otpErr")});
  
}

const postOTP = async(req,res)=>{

  let otp = req.body.otp.join('')
  console.log(otp,'dddddd')
try{
  const verified = verifyotp(userData.phone, otp).then(
    async (verification_check) => {

      
      if (verification_check.status == "approved") {

        const bcryptpass= await bcrypt.hash(userData.password, 10)

        console.log(userData.name,'userdata.name');
        console.log(userData.email,'userdata.email');
        console.log(userData.phone,'userdata.phone');
        console.log(bcryptpass,'userdata.passwrd');

       
         user.create({name:userData.name,
          password:bcryptpass,
          email:userData.email,
          phonenumber:userData.phone
        })
        res.redirect("/userlogin");
      } else if (verification_check.status == "pending") {
      
        // res.render("user/otp",{message:"Incorrect OTP",phone, user_details: false});
        req.flash("otpErr","otp not match")
        res.redirect("/otp")
      }
    }
  );
} catch (error) {
  console.log(error);
  next(error)
}
}


const registersubmit = async (req, res, next) => {
  userData = {
      name: req.body.name,
      
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
  };
  try {
      let response = null;
      if (req.session.users) {
          // res.redirect("/login");
      } else {
           userData = req.body;
          if (await userdb.findOne({ email: userData.email })) {
              response = "Email id already exists";
          } else if (await userdb.findOne({ phone: userData.phone })) {
              response = "Mobile number is already exists";
          } else {
              userData = req.body;
              console.log(userData.phone,'kkkkkkk');
              sendotp(userData.phone);

              response = null;
          }
      }
      res.json({ response });
  } catch (error) {
      next(error);
  }
};


  
  




const shop = (req, res) => {
  res.render("user/shop")
}



const profile = async (req, res) => {
  const count = req.count;
  const User = req.user;

  const userId = req.session.users._id;

  const userdetails=await user.findOne({_id:userId})

 

  const useraddress = await address.findOne({ user: userId });

  console.log(userId + 'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
  if (useraddress) {
    const findaddress = useraddress.address;
    res.render("user/userprofile", {
      userdetails,
      findaddress,
      useraddress,
      count,
      User,

    });
  } else {
    res.render("user/userprofile", { userdetails, useraddress, count, User });
  }

};



const addaddress = async (req, res) => {

  const userId = req.session.users._id;

  const addressexist = await address.findOne({ user: userId });

  if (addressexist) {
    await address.findOneAndUpdate(
      { user: userId },
      { $push: { address: [req.body] } }
    );

    res.redirect("/profile");
  } else {

    const useraddress = await address({
      user: userId,
      address: [req.body],
    });

    useraddress.save().then(() => {
      res.redirect("/profile");
    });
  }
};




const shopproduct = async (req, res) => {
  const categoryname=req.query.name
  if (categoryname) {
    const callproducts=await products.find({category:categoryname})
     
  const categary=await categorys.find({})
  res.render('user/shop', { callproducts,categary })
  }else{
      const callproducts= await products.find({})
      const categary=await categorys.find({})
      res.render('user/shop', { callproducts,categary })
  }
 
  
  

}


const productlistpost = async (req, res) => {
  try {

    id = req.params.id
    const productviews = await products.findById({ _id: id })


    res.render('user/productview', { productviews })
  } catch (error) {
    console.log(error);
  }

}

const addcart = async (req, res) => {

  try {
    const proid = req.query.id
console.log(proid,'grrrrrrr');
    const userid = req.session.users._id


    const Product = await products.findById({ _id: mongoose.Types.ObjectId(proid) });

    if (!Product) {
      console.log('error');
    }
    const user = await cart.findOne({ owner: userid });
    if (Product.stock < 1) {

      console.log('out of stock');
    } else {

      if (!user) {
        const newCart = await cart({
          owner: userid,
          items: [{ product: proid, totalprice: Product.price }],
          cartTotal: Product.price,
        });
        await newCart.save();
      } else {
        const productlist = await cart.findOne({
          owner: userid,
          "items.product": proid,
        });

        if (productlist !== null) {
          await cart.findOneAndUpdate(
            {
              owner: userid,
              "items.product": proid,
            },
            {
              $inc: {
                "items.$.quantity": 1,
                "items.$.totalprice": Product.price,
                cartTotal: Product.price,
              },
            }
          );
        } else {
          const newproAdd = await cart.findOneAndUpdate(
            { owner: userid },
            {
              $push: {
                items: { product: proid, totalprice: Product.price },
              },
              $inc: {
                cartTotal: Product.price,
              },
            }
          );
        }
      }
    }
    res.json({response:true})

  } catch (error) {
    console.log(error); 
  }
}




const displayincart = async (req, res) => {
  try {
    const userId = req.session.users._id;
    const count = req.count;
    const userin = req.user;

    const cartitems = await cart
      .findOne({ owner: userId })
      .populate("items.product");
      let CartArray = cartitems.items
      if (cartitems==null || CartArray.length==0) {
        res.render('user/emptycart')
      }else{
        res.render("user/usercart", { cartitems })

      }
    

  } catch (error) {
    console.log(error);
  }
}



const deleteitems = async (req, res) => {
  try {
    let userdata = req.session.users._id;

    const proid = req.query.productid;
    let product = await products.findOne({ _id: proid });
    let carts = await cart.findOne({ owner: userdata });


    let index = await carts.items.findIndex((el) => {
      return el.product == proid;
    });
    console.log(index);

    let price = carts.items[index].totalprice;

    let deletingproduct = await cart.findOneAndUpdate(
      { owner: userdata },
      {
        $pull: {
          items: { product: proid },
        },
        $inc: { cartTotal: -price },
      }
    );

    res.json("succeed")


  } catch (error) {
    console.log(error);
  }
}


const changequantity = async (req, res) => {
  console.log(req.query);
  try {
    let carts = await cart.findOne({ _id: req.query.cartid });

    const product = await products.findOne({ _id: req.query.productid });
    console.log(product, 'vishnu');
    let productprice = product.price;
    let cartcount = req.query.cartcount;
    cartcount = parseInt(cartcount) 

    if (cartcount == 1) {
      console.log('hi');
      const index = carts.items.findIndex(
        (obj) => obj.product == req.query.productid
      );
      if (carts.items[index].quantity >= products.stock) {

        res.json({ stock: true });
        return;
      } else {

        var product_price = product.price;
      }
    } else {
      var product_price = -product.price;

    }

    let updatedcart = await cart.findOneAndUpdate(
      {
        _id: req.query.cartid.trim(),
        "items.product": req.query.productid,
      },
      {
        $inc: {
          "items.$.quantity": cartcount,
          "items.$.totalprice": product_price,
          cartTotal: product_price,
        },
      }
    );

    let index = updatedcart.items.findIndex(
      (objitems) => objitems.product == req.query.productid
    );
    let newcart = await cart.findOne({ _id: req.query.cartid.trim() });
    let qty = newcart.items[index].quantity;
    let total = newcart.cartTotal;
    let totalprice = newcart.items[index].totalprice;

    res.json({ total, qty, totalprice })


  } catch (error) {
    console.log(error);
  }
}




const logout = (req, res) => {
  req.session.destroy()
  res.redirect('/')
}


const addresspost = async (req, res) => {

  try {
    //  let {name,addresses,city,postalcode,state,phone}=req.body
    const userid = req.session.users._id

    const addressalready = await address.findOne({ user: userid })

    if (addressalready) {
      await address.findOneAndUpdate({ user: userid }, { $push: { address: [req.body] } })
      res.redirect('/checkout')
    }
    else {
      const addressp = await address.create({
        user: userid,
        address: [req.body] 

      })
      res.redirect('/checkout')

      
    }

  } catch (error) {
    console.log(error);
  }



}

const giveaddres = async (req, res) => {

  const userid = req.session.users._id
  const giveadd = await address.findOne({ user: userid })
  

  const checkoutpro = await cart.findOne({ owner: userid }).populate("items.product")

  const paypalClientid=process.env.clientid
  console.log(process.env.clientid);

   const cartitem = await cart
        .findOne({ owner: mongoose.Types.ObjectId(userid) })
        .populate("items.product");
       res.render('user/checkout', { giveadd, checkoutpro,cartitem,paypalClindId: process.env.PAYPAL_CLIND_ID})
  console.log(paypalClientid);
      }


// const deleteaddress=async(req,res)=>{
   
// const id=req.params._id
//     const userId=req.session.users._id
//     const dele=await address.updateOne([{user:userId},{$pull:{address:{_id:id}}}])
// }

const placeorder=async(req,res)=>{
   
  const addressid = req.query.selectaddress
  const ordertype = req.query.paytype
  const amount = req.query.total
  const changetotal=req.query.changetotal
  
  const userid=req.session.users._id
  
  const ordercart = await cart.findOne({owner:userid})

   const Address = await address.findOne({user:userid})
   
  
  const DeliveryAddress = Address.address.find(
    (el) => el._id.toString() == addressid
  );
 
  if (ordertype === "COD") {
 
    const neworder = new order({
      date: new Date(),
      userId: ordercart.owner,
      products: ordercart.items,
      subtotal: amount,
      address: DeliveryAddress._id,
      paymentmethod: ordertype,
      orderstatus: "Confirmed",
    });
    neworder.save().then((result)=>{
     req.session.orderid=result._id
      ordercart.items = [];
    ordercart.cartTotal = 0;
    ordercart.save();

      res.json({ COD: true })
    })

   
  } else if (ordertype === 'paypal') {
   
  
    const neworder = new order({
      date: new Date(),
      userId: ordercart.owner,
      products: ordercart.items,
      subtotal: amount,
      address: DeliveryAddress._id,
      paymentmethod: ordertype,
      orderstatus: "Confirmed",
    });
    await neworder.save().then((result) => {
    
      let userOrderdata = result;

      let response = {
        paypal: true,
        Balance: amount,
        userOrderData: userOrderdata,
      };
      res.json(response);
    });
  }
}

const orderlistpage=async(req,res)=>{
  const orders=await(req,res)
}
const errorpage=(req,res)=>{
  res.render('user/404page')
}

const successpage = async (req, res) => {
  const sc = res.render('user/successpagesweet')
}
const orderlist=async(req,res)=>{

  try {
     const user=req.session.users
     const orderlisting=await order.find({_id: req.session.orderid}).populate('products.product').populate("address").sort({createdAt:-1})

    const ord=res.render('user/successpage',{orderlisting})

  } catch (error) {
    console.log(error);
    next(error)

  }
}

const orderhistory=async(req,res)=>{
  const userid=req.session.users._id
  const history=await order.find({userId:userid}).populate('products.product').sort({createdAt:-1})
  console.log('starttttttttttttttttttttttttttttttttt'+history+'endttttttttttttttttttttttttttttttttttttt');
  res.render('user/orderhistory',{history})
}

const wish=async(req,res)=>{

  
    let userdetails = req.session.users;
    let user = req.session.users._id;
    let cartcount = res.locals.count;

    let wishlists =  wishlist.findOne({userId:user}).populate("products.product");
    console.log(wishlists,'ithannereeehhhhhhhhhhhh');
    res.render("user/wishlist", { wishlists, userdetails, cartcount });
};



const addWishlist = async (req, res,next) => {

  try {
    const productid = req.query.productid;
  
    const userID = req.session.users._id;
    
    console.log(productid,'itheanneeee');
    const wishListing = await wishlist.findOne({ userId: userID });
    if (wishListing) {
      const productExist = await wishlist.findOne({
        user: userID,
        products: productid,
      });
      console.log(productExist + "ithtn tt");
      if (productExist) {
        res.json({ status: false });
        console.log("product exist");
      } else {
        const addWishlist = await wishlist.updateOne(
          { user: userID },
          { $push: { products: productid } }
        );
        console.log("product added");
        res.json({ status: 'added' });
      }
    } else {
      const addWishlist = await wishlist.create({
        user: userID,
        products: productid,
      });
      console.log("wishlist created");
      res.json({ status: 'created' });
    }
  } catch (error) {
    console.log(error);
    next(error)
  }
 
};

const coupans=async(req,res)=>{
      try {

   const entercode=req.body.coupan
  const carttotal=req.body.carttotal
  console.log(entercode,'ooooooooooooooooooooooooo');
  console.log(carttotal,'kkkkkkkkkkkkkkkk');
const coupans=await coupan.findOne({code:entercode})
console.log(coupans,'hhhhhhhhhh');
   
if(coupans.mincartAmount>carttotal){
  res.json({data:true})
}
else if(coupans.mincartAmount<=carttotal){
 const newcarttotal=carttotal-coupans.redeemamount;
  res.json({status:true,newcarttotal})
  console.log(newcarttotal,'ggggggggggggggggggggg');

}else{
  res.json({status:false},"invalid coupan")
}




      } catch (error) {
        console.log(error);
      }
  
    
  
  
}


const invoice=(req,res)=>{

  res.render('user/invoice')
}
const viewhistory=async(req,res)=>{
  try {
   const userid= req.session.users
    let orderid=req.params._id
    console.log(orderid,'dddddddddddddddd');
    const findorder=await order.findOne({_id:orderid}).populate('products.product')
    const orderaddress=findorder.address
    console.log(findorder,'fucccccccccccccccccccccccccccccccccccccc');
    const findaddress=await address.findOne({user:userid})
    let index =  findaddress.address.findIndex((el) => el._id ==orderaddress);

   const finaladdress=findaddress.address[index]
   console.log(finaladdress,'lllll');
   res.render('user/viewinhistory',{findorder,finaladdress})
  } catch (error) {
    console.log(error);
  }

}
const cancelorderinprofile=async(req,res)=>{
  try {
    const orderid=req.query.id
    console.log(orderid,'hiiiiiiiiiii');
  const cancel=await order.findOneAndUpdate({_id:orderid},{$set:{
  
         orderstatus:'cancelled'
  }})
  res.json({status:true})
  console.log(cancel,'its ready');

  } catch (error) {
    console.log(error);
  }
}
const deleteaddresscheckout=async (req,res)=>{

    try {
      const id=req.query.id
      console.log(id,'kitttiiiiiii');
      
    } catch (error) {
      console.log(error);
    }

}
const addresseditprofile=async (req,res)=>{
try {
  console.log(111111111111111);
const {name,phone,city,state,addresses,_id}=req.body
console.log(name,phone,_id,'kitttiiiiii');

 const userid=req.session.users._id
 address.updateMany({user:userid,"address._id":_id},{$set:{
      "address.$.name":name,
      "address.$.phone":phone,
      "address.$.city":city,
      "address.$.address":addresses,
      "address.$.state":state,

}}).then(()=>{
  console.log(1212121212);
  res.json({status:true})
})

} catch (error) {
  console.log(error);
}


}
const accounteditprofile=async(req,res)=>{
  const name=req.query.name
  console.log(name,'check');
const id=req.session.users._id
user.updateMany({_id:id},{$set:{
  name:req.query.name,
  email:req.query.email,
  phonenumber:req.query.phone

}}).then((result)=>{
  res.json({status:true})
})

}

const paypalpost=async(req,res)=>{

 try {
  

   const userid = req.session.users._id
    const ordercart = await cart.findOne({owner:userid})
    ordercart.items = [];
    ordercart.cartTotal = 0;
     ordercart.save();
    
        res.json({success:true})
    
    
 } catch (error) {
  
 }
   
}

const forgotpassword=async(req,res)=>{
    res.render('user/forgotpassword')
}

const forgotpasswordpost = async (req,res)=>{
  console.log("jiiiiiiiiiiiiii");
  let response =null;
  console.log(req.body.email)
  let findUser = await user.findOne({ email: req.body.email},{_id:0,phonenumber:1}).then((user)=>{
    console.log(user,111  )
    if(user){
         sendotp(user.phonenumber);
        res.json({mobile:user.phonenumber ,status:true})
    }else{
      res.json({response:"email not found"});
    }
  })
}

const forgotOtpVerify = async (req, res) => {
  try {
    let {otp, mobile} = req.body;
    console.log(otp, mobile);
    await verifyotp(mobile, otp).then((response) => {
      console.log("waiting for verification");
      if(response){
        console.log("verification approved");
        res.json({response:true})
      }else{
        res.json({response:false})
      }
    })
  } catch (error) {
  console.log(error)    
  }
}


const changePassword = async(req,res,next)=>{
  try {
    let {password,email} = req.body;
    console.log(req.body,"this is req body")
    password = await bcrypt.hash(password,10);
    user.updateOne({email: email},{$set: {password:password}}).then((e)=>{
      res.json({status:true})
      console.log("password updated")
    })
  } catch (error) {
    console.log(error)
    next(error)
    
  }

}
// const category= async(req,res)=>{

//   try {
//     const category= await categorys.find({})
//     console.log(category);
//   } catch (error) {
    
//   }
//   res.render('user/category')
// }

module.exports = {
  userhome,
  userlogin,
  userregister,
  registersubmit,
  loginsubmit, profile, addWishlist,paypalpost,
  shop, addcart, shopproduct, productlistpost, addaddress,
  displayincart, deleteitems, changequantity,accounteditprofile,cancelorderinprofile,
  successpage, logout, addresspost,createorder, giveaddres,placeorder,addresseditprofile,
errorpage,orderlist,orderhistory,wish,otp,coupans,invoice,viewhistory,deleteaddresscheckout,postOTP,forgotpassword,
forgotpasswordpost,forgotOtpVerify,changePassword

}

