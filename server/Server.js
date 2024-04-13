const bodyParser = require('body-parser');
const { exec } = require('child_process');
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 5000;
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","http://localhost:3000");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
app.use(bodyParser.json());


const uri ="mongodb+srv://rahul:rahul123@demo.sieh6ij.mongodb.net/?retryWrites=true&w=majority&appName=Demo";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function fetchData(){

  try {
    await client.connect();
    console.log('Connected to DB');
    const database = client.db('noob');
    const collection = database.collection('ques');
    const items = await collection.find({
      difficulty:"Easy"
    }).toArray();
    console.log('Items fetched');
    return items;
  } catch (error) {
    console.log('Error ', error);
    return [];
  } 
  // finally{
  //   await client.close();
  //   console.log('Disconnected');
  // }
}

// endpoint for fetching question data for selected questionID
  app.get('/api/data',async(req,res)=>{
    try {
      // const {questionId} = req.body;
      // const items = await fetchData(questionId);
      const items = await fetchData();
      res.json(items);
    } catch (error) {
      console.log('Error ',error);
      res.status(500).json({error:'Internal server error'});
    }
  });


  // endpoint for updating likes of a selected question
  app.post('/api/likes',async(req,res)=>{
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
  })


  //endpoint for updating dislikes of selected question
  app.post('/api/dislikes',async(req,res)=>{
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
  })
  
  


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
