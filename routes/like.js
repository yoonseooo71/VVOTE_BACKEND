const express = require('express');
const {checkPostLike, setPostLike, deletePostLike } = require('../controllers/like');
const router = express.Router();
router.post("/posts",setPostLike);
router.delete("/posts",deletePostLike);
router.get("/posts/check/:postId",checkPostLike);
module.exports = router;
