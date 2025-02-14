const express=require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors=require('cors')
const app=express()
const port=process.env.PORT || 5000
// middelware
app.use(express.json())
app.use(cors())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2eupeky.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const menuAllData=client.db('bistroDB').collection('menu')
    const reviewsAllData=client.db('bistroDB').collection('review')
    const cardAllData=client.db('bistroDB').collection('card')
     

    app.get('/allreview', async (req,res)=>{
      const result= await reviewsAllData.find().toArray()
      res.send(result)
    }) 
    app.get('/cart', async (req,res)=>{
      const email=req.query.email;
      const query={email:email}
      const result=await cardAllData.find(query).toArray()
      res.send(result)
    })
    app.post('/carts', async (req,res)=>{
      const cartItems=req.body;
      const result=await cardAllData.insertOne(cartItems)
      res.send(result)
    })


    app.get('/menus', async (req,res)=>{
        const result=await menuAllData.find().toArray()
        res.send(result)
    }) 

   

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send('huuu my server is running now')
})
 app.listen(port, ()=>{
    console.log(` ha ha  my bistro server is running on ${port}`);
 })