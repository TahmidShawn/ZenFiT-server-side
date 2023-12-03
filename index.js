const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.azrqgfm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  const featuredCollection = client.db("zenDB").collection("featured");
  const trainerCollection = client.db("zenDB").collection("trainer");
  const newsLetterCollection = client.db("zenDB").collection("newsLetterEmail");
  const userCollection = client.db("zenDB").collection("users");
  const plansCollection = client.db("zenDB").collection("plans");
  const classCollection = client.db("zenDB").collection("class");
  const imagesCollection = client.db("zenDB").collection("images");
  const forumsCollection = client.db("zenDB").collection("forums");

  // get featured data
  app.get("/featured", async (req, res) => {
    const result = await featuredCollection.find().toArray();
    res.send(result);
  });

  // get trainer data
  app.get("/trainer", async (req, res) => {
    const result = await trainerCollection.find().toArray();
    res.send(result);
  });

  // get trainer data by id
  app.get("/trainer/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await trainerCollection.findOne(query);
    res.send(result);
  });

  // store trainer data
  app.post("/trainer", async (req, res) => {
    const item = req.body;
    const result = await trainerCollection.insertOne(item);
    res.send(result);
  });

  // store newsLetterData data
  app.post("/newsLetterEmail", async (req, res) => {
    const item = req.body;
    const result = await newsLetterCollection.insertOne(item);
    res.send(result);
  });

  // get newsLetterData Data
  app.get("/newsLetterEmail", async (req, res) => {
    const result = await newsLetterCollection.find().toArray();
    res.send(result);
  });

  app.patch("/trainer/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: "trainer",
        },
      };

      const result = await trainerCollection.updateOne(filter, updatedDoc);

      res.send(result);
    } catch (error) {
      console.error("Error updating trainer:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  app.post("/users", async (req, res) => {
    const item = req.body;
    const result = await userCollection.insertOne(item);
    res.send(result);
  });

  app.get("/users", async (req, res) => {
    const result = await userCollection.find().toArray();
    res.send(result);
  });

  app.post("/plans", async (req, res) => {
    const item = req.body;
    const result = await plansCollection.insertOne(item);
    res.send(result);
  });

  app.get("/plans", async (req, res) => {
    const result = await plansCollection.find().toArray();
    res.send(result);
  });

  app.post("/class", async (req, res) => {
    const item = req.body;
    const result = await classCollection.insertOne(item);
    res.send(result);
  });

  app.get("/class", async (req, res) => {
    const result = await classCollection.find().toArray();
    res.send(result);
  });

  app.get("/images", async (req, res) => {
    const result = await imagesCollection.find().toArray();
    res.send(result);
  });

  app.post("/forums", async (req, res) => {
    const item = req.body;
    const result = await forumsCollection.insertOne(item);
    res.send(result);
  });

  app.get("/forums", async (req, res) => {
    const result = await forumsCollection.find().toArray();
    res.send(result);
  });

  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`ZenFiT server running on port ${port}`);
});
