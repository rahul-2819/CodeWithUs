const express = require('express');
const { findAllQuestions,findQuestionById} = require('../controllers/data');
const router = express.Router();
router.get("/",findAllQuestions);
router.get("/:id",findQuestionById)
module.exports = router;