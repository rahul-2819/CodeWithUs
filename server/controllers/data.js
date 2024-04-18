const express = require("express")
const {client} = require("../Connection")
const findAllQuestions = async(req,res)=>{
    console.log("findAllQuestions request")
    try {
        const database = client.db('noob');
        const collection = database.collection('ques');
        const questionsCursor = await collection.find({});
        const questionsArray = await questionsCursor.toArray();
        return res.json(questionsArray);

      } catch (error) {
        console.log('Error ', error);
        return [];
      } 
}
const findQuestionById = async(req,res)=>{
    try{
        const database = client.db('noob');
        const collection = database.collection("ques");
        const questions = await collection.find({
            id:req.body.id,
        })
        const questionsArray = await questions.toArray();
        return questionsArray;
    }catch{
        return [];
    }
}
const Addlikes = async(req,res)=>{
    try{
        const {questionId,amount} = req.body;
  
        await client.connect();
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
const AddDislike = async(req,res)=>{
    try{
        const {questionId,amount} = req.body;
  
        await client.connect();
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

module.exports = {
    findAllQuestions,
    findQuestionById,
    Addlikes,
    AddDislike
}