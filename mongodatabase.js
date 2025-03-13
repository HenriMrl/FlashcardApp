const { MongoClient } = require("mongodb");
require("dotenv").config(); 

const uri = process.env.MONGO_URI; 
const client = new MongoClient(uri);

let db, collection;

async function connectDB() {
    if (!db) {
        await client.connect();
        console.log("Connected to MongoDB");
        db = client.db("flashcard_db");
        collection = db.collection("flashcards");
    }
    return { db, collection };
}

module.exports = { connectDB, getCollection: async () => (await connectDB()).collection };


