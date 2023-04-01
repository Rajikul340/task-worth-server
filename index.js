const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId} = require("mongodb");


app.use(cors());
app.use(express.json());
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lrjyghr.mongodb.net/?retryWrites=true&w=majority`


console.log('uri', uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const usersCollection = client.db("ContentCreator").collection("users");
const contentCollection = client.db("ContentCreator").collection("content");

async function run() {

   try {
    app.post("/users", async (req, res) => {
        const users = req.body;
        const result = await usersCollection.insertOne(users);
        res.send(result);
      });
    
   } catch (error) {
     console.error(error)
   }
   try {
    app.post("/contents", async (req, res) => {
        const content = req.body;
        const result = await contentCollection.insertOne(content);
        res.send(result);
      });
    
   } catch (error) {
     console.error(error)
   }

   try {
    app.get("/contents", async(req, res)=>{
      const query ={};
      const contentdata = await contentCollection.find(query);
      const  result = await contentdata.toArray();
      // console.log('result', result);
      res.send(result)
    })
   } catch (error) {
    console.error(error)
    
   }
   try {
    app.get("/contents/:id", async(req, res)=>{
      const id = req.params.id
      const query ={_id:new ObjectId(id)};
      const contentdata = await contentCollection.findOne(query);
      res.send(contentdata)
    })
   } catch (error) {
    console.error(error)
    
   }
   app.put("/contents/:id", async (req, res) => {
    const id = req.params.id;
     console.log('id', id);
    const updateContent = req.body;
     console.log(updateContent);
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true }; 
    const updatedUser = {
      $set: {
        title: updateContent.title,
        description: updateContent.description,
      },
    };
  
    const result = await usersCollection.updateOne(filter, updatedUser, options);
    res.send(result);
  
  });
   try {
    app.delete("/contents/:id", async(req, res)=>{
      const id = req.params.id;
      const query ={_id:new ObjectId(id)};
      const deleteData = await contentCollection.deleteOne(query);
      res.send(deleteData)
    })
   } catch (error) {
    console.error(error)
    
   }
}

run();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

