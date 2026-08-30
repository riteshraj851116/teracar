import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next)=>{
    let token = req.headers.authorization;
    if(!token){
        return res.json({success: false, message: "not authorized"})
    }
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length).trim();
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded){
            return res.json({success: false, message: "not authorized"})
        }
        const userId = typeof decoded === 'object' && decoded.id ? decoded.id : decoded;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.json({success: false, message: "User not found or unauthorized"});
        }
        req.user = user;
        next();
    } catch (error) {
        return res.json({success: false, message: "not authorized"})
    }
}