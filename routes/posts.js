const express = require("express");
const { postWrite, getInfiniteScrollData, getPostsCount, getPostInfo, commentWrite, getComment, postLikesFluctuation } = require("../controllers/posts");
const router = express.Router();

router.get("/data/:limit&:offset",getInfiniteScrollData);
router.get("/info/:postId",getPostInfo);
router.get("/info/likes/:postId&:number",postLikesFluctuation);
router.get("/data/count",getPostsCount);
router.get("/comment/:postId",getComment);
router.post("/write", postWrite);
router.post("/write/comment",commentWrite)

module.exports = router;
