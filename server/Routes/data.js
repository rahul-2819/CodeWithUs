const express = require('express');
const { findAllQuestions,findQuestionById, Addlikes, AddDislike, getAllTestCases,getExampleTestCases,addPost,getPost, addComment, getComment} = require('../controllers/data');
const router = express.Router();
router.get("/data",findAllQuestions);
router.get("/data/:id",findQuestionById);
router.post("/likes",Addlikes);
router.post("/dislikes",AddDislike);
router.get("/testcases/:id",getAllTestCases);
router.get("/exampletestcases/:id",getExampleTestCases);
router.post("/addpost",addPost);
router.get("/getpost", getPost);
router.post("/addcomment",addComment);
router.get("/getcomment",getComment);
module.exports = router;