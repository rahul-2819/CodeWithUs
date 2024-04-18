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

module.exports = {
    findAllQuestions,
    findQuestionById,
}