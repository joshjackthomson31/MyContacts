const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Register a new user
//@route POST /api/users/register
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if(!username || !email || !password) {
        res.status(400);
        throw new Error("Please fill in all fields");
    }
    const userAvailable = await User.findOne({ email });
    if(userAvailable) {
        res.status(400);
        throw new Error("User already registered");
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    console.log(`User created: ${user}`);
    if(user)
    {
        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }

    res.json({message: "Register a new user"});
});

//@desc Login a user
//@route POST /api/users/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {  
        res.status(400);
        throw new Error("Please fill in all fields");
    }
    const user = await User.findOne({ email });
    if(user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );
        res.json({ accessToken });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

//@desc Get current user information
//@route GET /api/users/current
//@access Private
const getCurrentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

//@desc Update user email
//@route PUT /api/users/email
//@access Private
const updateEmail = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        res.status(400);
        throw new Error("Please provide new email and current password");
    }

    // Get user from database (req.user only has basic info from token)
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Verify current password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401);
        throw new Error("Current password is incorrect");
    }

    // Check if email is already taken by another user
    const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
    if (emailExists) {
        res.status(400);
        throw new Error("Email is already in use");
    }

    // Update email
    user.email = email;
    await user.save();

    // Generate new token with updated email
    const accessToken = jwt.sign(
        {
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ 
        message: "Email updated successfully",
        email: user.email,
        accessToken 
    });
});

//@desc Change user password
//@route PUT /api/users/password
//@access Private
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
        res.status(400);
        throw new Error("Please provide current password and new password");
    }

    if (newPassword.length < 6) {
        res.status(400);
        throw new Error("New password must be at least 6 characters");
    }

    // Get user from database
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        res.status(401);
        throw new Error("Current password is incorrect");
    }

    // Hash new password and save
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
});

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    updateEmail,
    changePassword,
};