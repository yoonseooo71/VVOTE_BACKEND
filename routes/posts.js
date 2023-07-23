const express = require("express");
const { postWrite, getPostData, getPostsCount } = require("../controllers/posts");
const router = express.Router();

router.get("/data/:limit&:offset",getPostData);
router.get("/data/count",getPostsCount);
router.post("/write", postWrite);

module.exports = router;
