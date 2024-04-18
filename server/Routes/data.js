const express = require('express');
const { findAllQuestions,findQuestionById, Addlikes, AddDislike} = require('../controllers/data');
const router = express.Router();
router.get("/data",findAllQuestions);
router.get("/data/:id",findQuestionById);
router.post("/likes",Addlikes);
router.post("/dislike",AddDislike);
module.exports = router;