const express = require("express");
const { getLoginUser, logout, getUserName } = require("../controllers/users");
const router = express.Router();

router.get("/user-data", getLoginUser);
router.get("/name/:user_id", getUserName);
router.post("/logout", logout);

module.exports = router;
