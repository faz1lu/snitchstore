const usercheck = (req,res,next)=>{
    if(req.session.users){
        next()
    }else{
        res.redirect('/userlogin')
    }
}
module.exports={usercheck}