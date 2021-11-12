const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
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
  const productsCollection = database.collection("products");
  const usersCollection = database.collection("users");
  const orderCollection = database.collection("order_list");
  const reviewCollection = database.collection("user_reviews");

  try {
    await client.connect();
    console.log("DB is connectd");

    // update or insert an user
    app.put("/user", async (req, res) => {
      const doc = req.body;
      const filter = { email: doc.email, displayName: doc.displayName };
      const options = { upsert: true };
      const updateDoc = { $set: filter };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // update user role in admin
    app.put("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      console.log(updateDoc);
      console.log(result);
      // res.json(result);
    });

    // get admin
    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      console.log(query);
      let isAdmin = false;
      const user = await usersCollection.findOne(query);
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
      console.log(isAdmin);
    });

    // insert new user
    app.post("/user", async (req, res) => {
      const doc = req.body;
      const result = await usersCollection.insertOne(doc);
      res.json(result);
    });

    // get products
    app.get("/products", async (req, res) => {
      const query = await productsCollection.find({}).toArray();
      res.send(query);
    });

    // insert a product
    app.post("/products", async (req, res) => {
      const doc = req.body;
      const result = await productsCollection.insertOne(doc);
      res.json(result);
      console.log(result);
    });

    // get specific product
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });

    // set order product
    app.post("/orders", async (req, res) => {
      const doc = req.body;
      const result = await orderCollection.insertOne(doc);
      res.json(result);
      console.log(result);
    });

    // get all orders
    app.get("/orders", async (req, res) => {
      const query = await orderCollection.find({}).toArray();
      res.send(query);
    });

    // get all orders
    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const orderProduct = await orderCollection.find(query).toArray();
      console.log(orderProduct);
      res.send(orderProduct);
    });

    // delete specific order
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });

    // update specific order
    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          status: "shipped",
        },
      };
      const result = await orderCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // insert user review
    app.post("/reviews", async (req, res) => {
      const doc = req.body;
      const result = await reviewCollection.insertOne(doc);
      res.json(result);
      console.log(doc);
    });

    // get review
    app.get("/reviews", async (req, res) => {
      const query = await reviewCollection.find({}).toArray();
      res.send(query);
      res.send(query);
    });
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
