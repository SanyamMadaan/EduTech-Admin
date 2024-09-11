const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();
const secret=process.env.secret;

const authenticated_Admin=(req,res,next)=>{
    const token=req.headers.admintoken;
    console.log(token);
    if(!token || !token.startsWith('Bearer')){
        return res.status(411).json({msg:"Invalid Token..accees denied"});
    }
    const received_token=token.split(' ')[1];
    try{
        jwt.verify(received_token,secret);
        console.log("middleware passed");
        next();
    }
    catch(e){
        return res.status(411).json({e});
    }
}

module.exports=authenticated_Admin;