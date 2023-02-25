const varifyAdmin = (req,res,next)=>{
    if(req.session.admin){
        next()
    }else{
        console.log(eq.session.admin,"lllllllllllllghcgc");
        res.redirect('/admin')
    }
}
module.exports={varifyAdmin}