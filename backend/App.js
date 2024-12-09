var express = require("express");
var cors = require("cors");
var fs = require("fs");
var bodyParser = require("body-parser");
var app = express();

const { MongoClient } = require("mongodb");

// MongoDB
const url = "mongodb+srv://yonas:yonas@stormy.88gfy.mongodb.net/";
const dbName = "secoms3190";
const client = new MongoClient(url);
const db = client.db(dbName);

app.use(cors());
app.use(bodyParser.json());
const port = "8081";
const host = "localhost";
app.listen(port, () => {
    console.log("App listening at http://%s:%s", host, port);
});

app.get("/listRobots", async (req, res) => {
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");
    const query = {};
    const results = await db
        .collection("robot")
        .find(query)
        .limit(100)
        .toArray();
    console.log(results);
    res.status(200);
    res.send(results);
});

app.get("/robot", async (req, res) => {
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");
    const query = {};
    const results = await db
        .collection("robot")
        .find(query)
        .limit(100)
        .toArray();
    console.log(results);
    res.status(200);
    res.send(results);
});

app.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    console.log("Robot ID to find :", id);

    await client.connect();
    console.log("Node connected successfully to GET-id MongoDB");

    const query = { id: id };
    const results = await db.collection("robot")
        .findOne(query);
    console.log("Results :", results);

    if (!results)
        res.send("Not Found").status(404);
    else
        res.send(results).status(200);

});

app.post("/robot", async (req, res) => {
    try {
        // Connect to the MongoDB database
        await client.connect();

        // Retrieve data from the request body
        const newDocument = {
            "id": req.body.id,
            "name": req.body.name,
            "price": req.body.price,
            "description": req.body.description,
            "imageUrl": req.body.imageUrl
        };
        console.log("Adding New Robot:", newDocument);

        // Insert the new document into the database
        const results = await db.collection("robot").insertOne(newDocument);

        // Send a successful response with the result
        res.status(200).send(results);
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send({ error: 'An internal server error occurred' });
    }
});


app.delete("/robot/:id", async (req, res) => {
    try {
        // Read parameter id
        const id = Number(req.params.id);
        console.log("Robot to delete :", id);
        // Connect Mongodb
        await client.connect();
        // Delete by its id
        const query = { id: id };
        // Delete
        const results = await db.collection("robot").deleteOne(query);
        // Response to Client
        res.status(200);
        res.send(results);
    }
    catch (error) {
        console.error("Error deleting robot:", error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.put("/robot/:id", async (req, res) => {
    const id = Number(req.params.id); // Read parameter id
    console.log("Robot to Update :", id);
    await client.connect(); // Connect Mongodb
    const query = { id: id }; // Update by its id
    // Data for updating the document, typically comes from the request body
    console.log(req.body);
    const updateData = {
        $set: {
            "id" : req.body.id,
            "name": req.body.name,
            "price": req.body.price,
            "description": req.body.description,
            "imageUrl": req.body.imageUrl
        }
    };
    // Add options if needed, for example { upsert: true } to create a document if it doesn't exist
    const options = {};
    const results = await db.collection("robot").updateOne(query, updateData, options);
    res.status(200); // Response to Client
    res.send(results);
});