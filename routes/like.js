const express = require('express');
const {checkPostLike, setPostLike } = require('../controllers/like');
const router = express.Router();
router.post("/posts",setPostLike)
router.get("/posts/check/:postId",checkPostLike);
module.exports = router;
