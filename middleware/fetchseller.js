
const secretstr= "khushalisagoodboy"
const  jwt = require('jsonwebtoken');
const fetchseller =async(req,res,next)=>{
    const token = req.header("auth-token")
    if(!token){
        res.status(401).json({error:"token not found"})
    }
    try
    {const data=  jwt.verify(token , secretstr)

    req.seller= data.user}catch(err){
        res.status(400).json({error:"validate using valid token"})
     }
     
    next()
}

module.exports = fetchseller