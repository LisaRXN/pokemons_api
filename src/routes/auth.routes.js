const router = require("express").Router();

const {login, register, logout, getUser} = require("../controllers/auth.js");


router.post("/login", login)
router.post("/register", register)
router.get("/logout", logout)
router.get("/me", getUser)

module.exports = router;
