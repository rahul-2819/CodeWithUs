const { MongoClient } = require('mongodb');
const uri ="mongodb+srv://rahul:rahul123@demo.sieh6ij.mongodb.net/?retryWrites=true&w=majority&appName=Demo";
const client =  new MongoClient(uri,{useNewUrlParser:true,useUnifiedTopology:true});
async function connectAtlas(){
await client.connect();
}
module.exports = {
    connectAtlas,
    client
};