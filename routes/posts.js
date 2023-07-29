const express = require("express");
const { postWrite, getInfiniteScrollData, getPostsCount, getPostInfo } = require("../controllers/posts");
const router = express.Router();

router.get("/data/:limit&:offset",getInfiniteScrollData);
router.get("/info/:postId",getPostInfo);
router.get("/data/count",getPostsCount);
router.post("/write", postWrite);

module.exports = router;
