const express = require("express");
const { getLoginUser, logout } = require("../controllers/users");
const router = express.Router();

router.get("/user-data", getLoginUser);
router.post("/logout", logout);

module.exports = router;
