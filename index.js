const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sjbgh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const run = async () => {
  const database = client.db("Niche_Products");
  const ProductsCollection = database.collection("products");
  const usersCollection = database.collection("users");

  try {
    await client.connect();
    console.log("DB is connectd");

    // update or insert an user
    app.put("/user", async (req, res) => {
      const doc = req.body;
      const filter = { email: doc.email };
      const options = { upsert: true };
      const updateDoc = { $set: filter };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // insert new user
    app.post("/user", async (req, res) => {
      const doc = req.body;
      const result = await usersCollection.insertOne(doc);
      res.json(result);
    });

    app.put;
  } finally {
    // await client.close()
  }
};

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Niche Products!");
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});
