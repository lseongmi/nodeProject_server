const express = require('express');
const router = express.Router();
const journalsController = require('../controllers/journalsController');

// 일기 생성 (POST)
router.post('/', journalsController.journalsPost);

// 전체 일기 조회 (GET)
router.get('/', journalsController.journalsGet);

// 특정 ID 일기 조회 (GET)
router.get('/:id', journalsController.getJournalById);

module.exports = router;
