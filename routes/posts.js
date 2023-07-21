const express = require("express");
const { postWrite, getPostData } = require("../controllers/posts");
const dbClient = require("../postgresql");
const router = express.Router();

router.get("/data/:limit&:offset",getPostData)
router.post("/write", postWrite);

module.exports = router;
