const router = require("express").Router();
const authRoutes = require("./auth.routes.js");
const monstersRoutes = require("./monsters.routes.js");

router.use("/auth", authRoutes);
router.use("/monsters", monstersRoutes);

module.exports = router;
