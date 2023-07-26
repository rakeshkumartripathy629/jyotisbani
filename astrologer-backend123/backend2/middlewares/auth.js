const jwt = require("jsonwebtoken");
const SECRET_KEY = "ASTROLOGER";

const auth = (req,res,next)=>{
    try{
        let token = req.headers.authorization;
        
        if(token){
            token = token.split(" ")[1];
            let astrologer = jwt.verify(token,SECRET_KEY);
            req.astrologerId = astrologer.id;
            req.astrologerEmail = astrologer.email;
            next();
        }else{
            res.status(401).json({message:"unauthorised Astrologer"})
        }
        
    }catch(error){
        if(error) console.log(error);
        res.status(401).json({message:"unauthorised Astrologer"})
    }
}

module.exports = auth;