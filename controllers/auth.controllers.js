import { User } from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const signup = async (req, res) => {

    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password should be atleast 6 characters" })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }
        const user = await User.findOne({ username })
        if (user) return res.status(400).json({ message: "username already exists" })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;


        const newuser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
        });
        await newuser.save();

        // Create a JWT token with the user ID
        const token = jwt.sign({ id: newuser._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

        // Set the token as a cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== "development"
        })

        res.status(201).json({
            message: "user registered successfully",
            _id: newuser._id,
            fullName: newuser.fullName,
            username: newuser.username,
            profilePic: newuser.profilePic

        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "server error" })
    }
}
export const login = async (req, res) => {

    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }
        const user = await User.findOne({ username })
        if (!user) return res.status(400).json({ message: "Invalid credentials" })

        const isPassword = await bcrypt.compare(password, user?.password || "")
        if (!isPassword) return res.status(400).json({ message: "Invalid credentials" })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'Strict',
            secure: process.env.NODE_ENV !== "development"
        })

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
           
        })
    } catch (error) {
        res.status(500).json({ message: "server error" })
    }
}
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: "0" })
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }

}
// export const updateProfile = async (req, res) => {
//     try {
//         const { profilePic } = req.body
//         const userId = req.user._id

//         if (!profilePic) {
//             return res.status(400).json({ message: "profile pic is neccessary" })
//         }
//         //upload the img to cloudinary
//         const profileResult = await cloudinary.uploader.upload(profilePic)
//         //get the url of the uploaded img
//         const updateUserProfile = await User.findByIdAndUpdate(userId, { profilePic: profileResult.secure_url }, { new: true })
//     } catch (error) {
//         console.error("Error in protectRoute middleware:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// }

// export const checkAuth = (req, res) => {
//     try {
//         res.status(200).json(req.user)
//     } catch (error) {
//         console.log("Error in check Auth controller")
//         res.status(500).json({ message: "internal server error" })

//     }
// }
