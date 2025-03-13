const express = require("express");
const cors = require("cors");
const { getCollection } = require("./mongodatabase");

const app = express();
app.use(express.json());
app.use(cors());

// Get all flashcards
app.get("/flashcards", async (req, res) => {
    try {
        const collection = await getCollection();
        const flashcards = await collection.find().toArray();
        res.json(flashcards);
    } catch (error) {
        res.status(500).json({ message: "Error fetching flashcards", error });
    }
});

// Add a new flashcard
app.post("/flashcards", async (req, res) => {
    try {
        const collection = await getCollection();
        
        console.log("Received request body:", req.body); // Log incoming data

        const { word, answer } = req.body;
        if (!word || !answer) {
            console.log("Missing fields in request");
            return res.status(400).json({ message: "Both fields are required" });
        }

        await collection.insertOne({ word, answer });
        res.json({ message: "Flashcard added successfully" });
    } catch (error) {
        console.error("Error adding flashcard:", error);
        res.status(500).json({ message: "Error adding flashcard", error });
    }
});

// Delete a flashcard
app.delete("/flashcards/:id", async (req, res) => {
    try {
        const collection = await getCollection();
        const { id } = req.params;
        const { ObjectId } = require("mongodb");

        await collection.deleteOne({ _id: new ObjectId(id) });
        res.json({ message: "Flashcard deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting flashcard", error });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

