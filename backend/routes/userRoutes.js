const express = require("express");
const { registerUser, loginUser, getCurrentUser, updateEmail, changePassword } = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, getCurrentUser);

router.put("/email", validateToken, updateEmail);

router.put("/password", validateToken, changePassword);

module.exports = router;