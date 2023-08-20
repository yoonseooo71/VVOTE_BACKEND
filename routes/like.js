const express = require("express");
const {
  checkPostLike,
  setPostLike,
  deletePostLike,
  setCommentLike,
  deleteCommentLike,
  checkCommentLike,
} = require("../controllers/like");
const router = express.Router();
router.post("/posts", setPostLike);
router.delete("/posts", deletePostLike);
router.get("/posts/check/:postId", checkPostLike);

router.post("/comment", setCommentLike);
router.delete("/comment", deleteCommentLike);
router.get("/comment/check/:commentId", checkCommentLike);
module.exports = router;
