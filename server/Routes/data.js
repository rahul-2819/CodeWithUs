const express = require('express');
const { findAllQuestions,findQuestionById, Addlikes, AddDislike, getAllTestCases} = require('../controllers/data');
const router = express.Router();
router.get("/data",findAllQuestions);
router.get("/data/:id",findQuestionById);
router.post("/likes",Addlikes);
router.post("/dislikes",AddDislike);
router.get("/testcases/:id",getAllTestCases);
module.exports = router;