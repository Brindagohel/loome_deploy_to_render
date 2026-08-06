const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// ========================
// REGISTER USER
// ========================
const registerUser = async (req, res) => {
  try {
    const { UserName, email, password } = req.body;

    if (!UserName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      UserName,
      email,
      password: hashPassword,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred during registration",
      error: error.message,
    });
  }
};

// ========================
// LOGIN USER
// ========================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

   
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role, UserName: user.UserName }, // add UserName here
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
     );
   
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        UserName: user.UserName,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

// ========================
// LOGOUT USER
// ========================
const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully",
  });
};

// ========================
// AUTH MIDDLEWARE
// ========================
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }

  try {
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ← was "client_SECRET"
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };