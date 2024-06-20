const express = require('express');
const { findAllQuestions,findQuestionById, Addlikes, AddDislike, getAllTestCases,getExampleTestCases,addPost,getPost, addComment, getComment,addQuesComment,addQuesReply, getQuesComments} = require('../controllers/data');

const router = express.Router();
//find all questions
router.get("/data",findAllQuestions);
//find question by id
router.get("/data/:id",findQuestionById);
//add likes to the questions
router.post("/likes",Addlikes);
//add dislike to question
router.post("/dislikes",AddDislike);
//get all test case of question id
router.get("/testcases/:id",getAllTestCases);
//get all the example test cases
router.get("/exampletestcases/:id",getExampleTestCases);
//add post to the discuss
router.post("/addpost",addPost);
//get the specific post
router.get("/getpost", getPost);
//add commment to the post
router.post("/addcomment",addComment);
//get the comment of the post
router.get("/getcomment",getComment);
// to add comments on a question
router.post("/quescomment",addQuesComment);
// to add replies to a comment on ques
router.post("/quescommentreply",addQuesReply);
// to get comments of a question
router.get("/getquescomment",getQuesComments);

module.exports = router; 