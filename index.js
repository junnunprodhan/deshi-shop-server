const express = require("express");
const app = express();
const port = 5000;
require("dotenv").config();
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const productsCollection = client.db("DeshiShop").collection("products");
    const orderCollection = client.db("DeshiShop").collection("orders");

    // Send a ping to confirm a successful connection

    app.get("/products", async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);
    });
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    app.get("/orders", async (req, res) => {
      const result = await orderCollection.find().toArray();
      res.send(result);
    });
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      console.log(req)
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/flash-sale", async (req, res) => {
      const falseSale = await productsCollection
        .find()
        .sort({ createdAt: 1 })
        .toArray();
      const filter = falseSale.filter((flash) => flash.isFlash == true);
      res.send(filter);
    });


    app.get("/brands/:category", async (req, res) => {
      const category = req.params.category;
      const query = { category: category };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });
    
    app.get("/brands/:category/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await productsCollection.findOne(query);
    
        if (result) {
          res.json(result);
        } else {
          res.status(404).json({ error: "Product not found" });
        }
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  const serverStatus = {
      message: 'Server is running smoothly',
      timestamp: new Date()
  };
  res.json(serverStatus);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


