const express = require('express');
const app = express()
const userRouter = require('./router/user')
const adminRouter = require('./router/admin')
const flash=require('connect-flash')
const db = require('./config/server');
const session = require('express-session')
require('dotenv').config()
app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");
app.use(express.static("public"))
app.use(express.urlencoded({ extended: false }));

app.use(express.json())     
app.use(flash())

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000000 }
}))

app.use('/admin', adminRouter)
app.use('/', userRouter)





db.dbConnection((res) => {
    if (res) {
        console.log("moongoose running");
    } else {
        console.log("err");
    }
})

//  app.use((req,res,next)=>{
//     let error=new Error(`Not found this page ${req.originalUrl}`,404)
//      next(error)
// })

app.use((err, req, res, next) => {
    console.log(err)
    res.render('user/404page')
})


app.listen(process.env.PORT, () => {
  
    console.log("server started ");
});

