const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const cors = require('cors');

// Load environment variables
require('dotenv').config()

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection URI
const mongoURI = process.env.DB_PASSWORD;
const url = `mongodb+srv://admin:${mongoURI}@cluster0.j3ebv0r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(url);

// Connect to MongoDB
async function connectToMongo() {
    try {
        await client.connect();
        console.log("Successfully connected to Atlas");
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err.stack);
        process.exit(1); // Exit if connection fails
    }
}

// Call connectToMongo to establish a connection
connectToMongo();

// Serve static files (like HTML, CSS, JS)
app.use(express.static('public'));

// Handle form submission
app.post('/submit', async (req, res) => {
    try {
        const { option, description } = req.body;
        let rating = null;

        // Validate the required fields
        if (!option || !description) {
            return res.status(400).send('Missing required fields');
        }

        if (option === "sad") {
            rating = -1;
        } else if (option === "neutral") {
            rating = 0;
        } else if (option === "happy") {
            rating = 1;
        }

        // Insert data into MongoDB
        const today = new Date().toISOString().split('T')[0];
        const db = client.db("spec-database");
        const collection = db.collection("mood-tracker-results");

        const existingSubmission = await collection.findOne({
            date: today
        });

        if (existingSubmission) {
            return res.status(200).send("Already submitted for today");
        }

        const result = await collection.insertOne({ option, description, rating: rating, date: today });

        console.log("Data inserted with ID:", result.insertedId);
        res.send('Data saved successfully');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Error saving data');
    }
});

app.get("/mood-data", async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const db = client.db("spec-database");
        const collection = db.collection("mood-tracker-results");

        const result = await collection.find({}).toArray();

        res.json(result);

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
})

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
