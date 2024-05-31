const express = require("express")
const {client} = require("../Connection");
const { ObjectId } = require("mongodb");

//get all the questions
const findAllQuestions = async(req,res)=>{
    console.log("findAllQuestions request")
    try {
        const database = client.db('noob');
        const collection = database.collection('ques');
        const questionsCursor = collection.find({});
        const questionsArray = await questionsCursor.toArray();
        return res.json(questionsArray);

      } catch (error) {
        console.log('Error ', error);
        return [];
      } 
}
//get request for find the qeustion by id
const findQuestionById = async(req,res)=>{
    try{
        const id = req.body;
        const database = client.db('noob');
        const collection = database.collection("ques");
        const questions =  collection.find({
            _id:id,
        })
        const questionsArray = await questions.toArray();
        return questionsArray;
    }catch{
        return [];
    }
}
//Addlikes end point
const Addlikes = async(req,res)=>{
    try{
        const {questionId,amount} = req.body;
        const database  =client.db('noob');
        const collection = database.collection('ques');
        
        await collection.findOneAndUpdate(
          {_id: questionId},
          {$inc:{"likes":amount}}
        )
        res.json({success:true});
      }catch(erorr){
        console.error('Error updating likes:', erorr);
        res.status(500).json({ error: 'Internal server error' });
      }
}
//Add dislike end point
const AddDislike = async(req,res)=>{
    try{
        const {questionId,amount} = req.body;
        const database  =client.db('noob');
        const collection = database.collection('ques');
        
        await collection.findOneAndUpdate(
          {_id: questionId},
          {$inc:{"dislikes":amount}}
        )
        res.json({success:true});
      }catch(erorr){
        console.error('Error updating likes:', erorr);
        res.status(500).json({ error: 'Internal server error' });
      }finally{
        await client.close();
      }
}

const getAllTestCases = async(req,res)=>{
  try{
    const id = req.params.id;
    const database = client.db("noob");
    const collection = database.collection("testcases");
    const data = await collection.findOne({
      questionId:id,
    });
    // console.log(data);
    return res.json(data);
  }
  catch(error){
    // console.error('Error updating likes:', erorr);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const getExampleTestCases = async(req,res)=>{
  try{
    const id = req.params.id;
    const database = client.db("noob");
    const collection = database.collection("example_testcases");
    const data = await collection.findOne({
      questionId:id,
    });
    // console.log(data);
    return res.json(data);
  }
  catch(error){
    // console.error('Error updating likes:', erorr);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// endpoint to add posts in discuss
const addPost=async(req,res)=>{

  try {
    const {categoryTitle, postTitle, postContent} = req.body;
    const database = client.db('noob');
    const collection = database.collection('post');
    const category = collection.findOne({
      title: categoryTitle
    });

    if(category){
      const postId = new ObjectId();
      await collection.updateOne(
        { title: categoryTitle },
        { $push: { posts: {_id:postId, title: postTitle, content: postContent } }}
      )
        res.json({success:true});
    }else{
      console.error("Category not found");
    }


  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  } 
}

//endpoint to get posts

const getPost = async (req, res) => {
  try {
    const database = client.db("noob");
    const collection = database.collection('post');

    const postId = req.query.postId; // get the postId from the request query
    const selectedTab = req.query.selectedTab; // get the selectedTab from the request query
    let item;
    if(postId && selectedTab){
      let filter = {
        _id: new ObjectId(selectedTab)
      };

      let projection = {
        posts: {
          $elemMatch: {
            _id: new ObjectId(postId)
          }
        }
      };
      item = await collection.findOne(filter, { projection });
    }else {
      item = await collection.find({}).toArray();
    }

    // item = await collection.findOne(filter, { projection });
    return res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
    findAllQuestions,
    findQuestionById,
    Addlikes,
    AddDislike,
    getAllTestCases,
    getExampleTestCases,
    addPost,
    getPost
}