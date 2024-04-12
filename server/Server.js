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

async function fetchData(){
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to DB');

    const database = client.db('noob');
    const collection = database.collection('ques');
    const items = await collection.find({
     
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
  app.get('/api/data',async(req,res)=>{
    try {
      const items = await fetchData();
      res.json(items);
    } catch (error) {
      console.log('Error ',error);
      res.status(500).json({error:'Internal server error'});
    }
  });
  // app.get()



// without using external api c++ execution
// app.post('/exec_cpp', (req, res) => {
//     const { code} = req.body;
//     // if(lang === cpp){
//         const fileName = "temp.cpp";
//         const fs = require('fs');
//         // console.log(code);
//         try {
//             fs.writeFileSync(fileName,code);
//         } catch (error) {
//             console.log('Error writing file', error);
//             res.status(500).send('Error writing file');
//             return;
//         }

//         exec(`g++ -o temp ${fileName} && temp.exe`, (error, stdout, stderr) => {
//             if (error) {
//                 res.status(500).send(`Compilation error: ${error.message}`);
//                 return;
//             }
//             if (stderr) {
//                 res.status(500).send(`Execution error: ${stderr}`);
//                 return;
//             }
//             res.send(stdout);
//         });
//     // }
//     // else{
//     //     res.status(400).json({error:"Unsupported language"});
//     // }
// });

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
