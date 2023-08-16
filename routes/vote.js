const express = require('express');
const { setPostVote, checkPostVote, deletePostVote } = require('../controllers/vote');
const router = express.Router(); 
router.post('/post',setPostVote);
router.delete('/post',deletePostVote);
router.get('/post/check/:postId',checkPostVote);
module.exports = router;