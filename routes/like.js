const express = require('express');
const { postLike } = require('../controllers/like');
const router = express.Router();
router.post("/posts",postLike)
module.exports = router;
