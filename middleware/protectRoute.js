import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

//check weather there is a token/not
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" })

        //decode the cookie
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // if (!decoded) return res.status(401).json({ message: "Unauthorized - invalid token" })

        const user = await User.findById(decoded.id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "No user found" })

        }

        req.user = user
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}