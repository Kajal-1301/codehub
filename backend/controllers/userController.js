const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");

const DUMMY_HASH = process.env.DUMMY_HASH;

//---------------------------------- Sign up function --------------------------------------------

async function signup(req, res) {

    const { username, password, email } = req.body;

    //  Basic input validation ----------

    if (!username || !password || !email) {
        return res.status(400).json({
            message: "All fields are required."
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters long."
        });
    }

    try {

        //  Check for existing user by username OR email ----------

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Username or email is already registered."
            });
        }

        //  Hash password  -----------

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User  ------------

        const newUser = await User.create({
            username,
            password: hashedPassword,
            email,
            followedUsers: [],
            starRepos: []
        });

        res.status(201).json({
            message: "Account created successfully!"
        });

    } catch (err) {

        //   Handle duplicate-key errors from schema-level unique constraints -------

        if (err.code === 11000) {
            return res.status(400).json({
                message: "Username or email already exists"
            });
        }

        console.error("Error during signup:", err.message);
        res.status(500).send("Server error");
    }
}



// --------------------------------------- Login function -----------------------------------

async function login(req, res) {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

        const hashToCompare = existingUser ? existingUser.password : DUMMY_HASH;

        const isMatch = await bcrypt.compare(password, hashToCompare);

        if (!existingUser || !isMatch) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        const token = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_SECRET_KEY
        );

        res.json({
            token,
            userId: existingUser._id
        });

    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).send("Server error!");
    }
}


// Get user profile by id --------------

async function getUserProfile(req, res) {

    const { id } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found!"
            });
        }

        res.json(user);

    } catch (err) {
        console.error("Error during fetching:", err.message);
        res.status(500).send("Server error!");
    }
}

// Update username --------------

async function updateUsername(req, res) {
    const { id } = req.params;
    const { username } = req.body;

    try {
        if (!username || !username.trim()) {
            return res.status(400).json({ error: "Username is required!" });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        user.username = username;
        const updatedUser = await user.save();

        res.json(updatedUser);

    } catch (err) {
        console.error("Error during username update:", err.message);
        res.status(500).json({ error: "Server error!" });
    }
}


module.exports = {
    signup,
    login,
    getUserProfile,
    updateUsername
}