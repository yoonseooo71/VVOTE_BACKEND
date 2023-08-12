const express = require('express');
const { postLike, isPostLike } = require('../controllers/like');
const router = express.Router();
router.post("/posts",postLike)
router.get("/posts/check/:postId",isPostLike);
module.exports = router;
