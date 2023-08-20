const express = require('express');
const { getSearchInfiniteScrollData } = require('../controllers/search');
const router = express.Router() ; 
router.get('/:limit&:offset',getSearchInfiniteScrollData);

module.exports = router ; 