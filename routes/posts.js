const express = require("express");
const { postWrite, getPostsCount, getPostInfo, commentWrite, getComment, getTrendInfiniteScrollData, getRecentInfiniteScrollData} = require("../controllers/posts");
const router = express.Router();

router.get("/data/trend/:limit&:offset",getTrendInfiniteScrollData);
router.get("/data/recent/:limit&:offset",getRecentInfiniteScrollData);
router.get("/info/:postId",getPostInfo);
router.get("/data/count",getPostsCount);
router.get("/comment/:postId",getComment);
router.post("/write", postWrite);
router.post("/write/comment",commentWrite)

module.exports = router;
