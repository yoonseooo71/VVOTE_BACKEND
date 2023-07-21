const express = require("express");
const { getUser, logout } = require("../controllers/users");
const router = express.Router();

router.get("/user-data", getUser);

router.post("/logout", logout);

module.exports = router;
