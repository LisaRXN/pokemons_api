const router = require("express").Router();

const {getAll, get, add, update, remove} = require("../controllers/monsters.js");

router.get("/", getAll)
router.get("/:id", get)
router.post("/", add)
router.put("/:id", update)
router.delete("/:id", remove)

module.exports = router;
