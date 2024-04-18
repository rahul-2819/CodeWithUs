const bodyParser = require('body-parser');
const { exec } = require('child_process');
const express = require('express');
const userRouter = require("./Routes/data");
const {client} = require("./Connection");
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


 app.use("/api/data",userRouter);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
