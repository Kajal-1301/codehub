const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const DUMMY_HASH = process.env.DUMMY_HASH;

const User = require("../models/userModel");

async function signup(req, res) {
    const { username, password, email } = req.body

    // 1. Input validation

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Send all details"
        })
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be 6 characters long"
        })
    }

    // 2. Check if user exists 

    try {
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists."
            })
        }

        // 3. Hash the password 

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //  4. Create user 

        const newUser = await User.create({
            username, email, password: hashedPassword, starRepos: [], allRepos: []
        })

        // 5. Sign JWT

        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        )

        res.json({
            token, userId: newUser.id
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        console.log("Error saving user :", error.message)
        res.status(500).send("Server error")
    }

}

async function login (req, res) {

    const {email , password } = req.body

    if(!email || !password) {
        return res.status(400).json({
            message : "Send all details"
        })
    }

    try {
        const existingUser = await User.findOne({email : email.toLowerCase().trim()})
        const hashToCompare = existingUser ? existingUser.password : DUMMY_HASH
        const isMatch = await bcrypt.compare(password , hashToCompare)
        if(!existingUser || !isMatch) {
            return res.status(401).json({
                message : "Invalid credentials"
            })
        }
        const token = jwt.sign(
            {userId : existingUser._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn : "1h"}
        )
        res.json({
            token , userId : existingUser._id
        })
 
    } catch (error) {
        
    }
}